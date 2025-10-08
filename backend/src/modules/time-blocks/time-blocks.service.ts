import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { UpdateTimeBlockDto } from './dto/update-time-block.dto';
import { TimeBlock } from './entities/time-block.entity';

@Injectable()
export class TimeBlocksService {
  constructor(
    @InjectRepository(TimeBlock)
    private timeBlockRepository: Repository<TimeBlock>,
  ) {}

  async create(createTimeBlockDto: CreateTimeBlockDto, providerId: string) {
    // Check for conflicts with existing time blocks
    const conflictingBlocks = await this.timeBlockRepository.find({
      where: {
        providerId,
        date: createTimeBlockDto.date,
        startTime: Between(createTimeBlockDto.startTime, createTimeBlockDto.endTime),
      },
    });

    if (conflictingBlocks.length > 0) {
      throw new ForbiddenException('Time block conflicts with existing block');
    }

    const timeBlock = this.timeBlockRepository.create({
      ...createTimeBlockDto,
      providerId,
    });

    const savedTimeBlock = await this.timeBlockRepository.save(timeBlock);

    // If recurring, create future instances
    if (createTimeBlockDto.recurring) {
      await this.createRecurringInstances(savedTimeBlock);
    }

    return savedTimeBlock;
  }

  async findAll(providerId: string, startDate?: string, endDate?: string) {
    const query = this.timeBlockRepository.createQueryBuilder('timeBlock')
      .where('timeBlock.providerId = :providerId', { providerId });

    if (startDate && endDate) {
      query.andWhere('timeBlock.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getMany();
  }

  async findOne(id: string, providerId: string) {
    const timeBlock = await this.timeBlockRepository.findOne({
      where: { id, providerId },
    });

    if (!timeBlock) {
      throw new NotFoundException('Time block not found');
    }

    return timeBlock;
  }

  async update(id: string, updateTimeBlockDto: UpdateTimeBlockDto, providerId: string) {
    const timeBlock = await this.findOne(id, providerId);
    
    Object.assign(timeBlock, updateTimeBlockDto);
    return this.timeBlockRepository.save(timeBlock);
  }

  async remove(id: string, providerId: string) {
    const timeBlock = await this.findOne(id, providerId);
    await this.timeBlockRepository.remove(timeBlock);
    return { message: 'Time block deleted successfully' };
  }

  private async createRecurringInstances(timeBlock: TimeBlock) {
    const instances = [];
    const startDate = new Date(timeBlock.date);
    const endDate = timeBlock.endDate ? new Date(timeBlock.endDate) : new Date(startDate.getFullYear(), 11, 31); // End of year if no end date
    
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 7); // Start from next week

    while (currentDate <= endDate) {
      const instance = this.timeBlockRepository.create({
        providerId: timeBlock.providerId,
        date: currentDate.toISOString().split('T')[0],
        startTime: timeBlock.startTime,
        endTime: timeBlock.endTime,
        type: timeBlock.type,
        reason: timeBlock.reason,
        recurring: false, // Individual instances are not recurring
        parentId: timeBlock.id,
      });
      
      instances.push(instance);
      currentDate.setDate(currentDate.getDate() + 7); // Next week
    }

    if (instances.length > 0) {
      await this.timeBlockRepository.save(instances);
    }
  }
}