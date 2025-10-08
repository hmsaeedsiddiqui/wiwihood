import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecurringAppointmentDto } from './dto/create-recurring-appointment.dto';
import { UpdateRecurringAppointmentDto } from './dto/update-recurring-appointment.dto';
import { RecurringAppointment, RecurringInterval, RecurringStatus } from './entities/recurring-appointment.entity';

@Injectable()
export class RecurringAppointmentsService {
  constructor(
    @InjectRepository(RecurringAppointment)
    private recurringAppointmentRepository: Repository<RecurringAppointment>,
  ) {}

  async create(createRecurringAppointmentDto: CreateRecurringAppointmentDto, userId: string) {
    // Get provider ID from user ID
    const providerId = userId; // Assuming user is provider

    const recurringAppointment = this.recurringAppointmentRepository.create({
      ...createRecurringAppointmentDto,
      providerId,
      nextOccurrence: this.calculateNextOccurrence(
        createRecurringAppointmentDto.startDate,
        createRecurringAppointmentDto.interval
      ),
    });

    const savedAppointment = await this.recurringAppointmentRepository.save(recurringAppointment);

    // TODO: Schedule automatic booking creation for each occurrence
    
    return savedAppointment;
  }

  async findAll(userId: string, status?: string) {
    const providerId = userId;
    const query = this.recurringAppointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.service', 'service')
      .where('appointment.providerId = :providerId', { providerId });

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    return query.orderBy('appointment.nextOccurrence', 'ASC').getMany();
  }

  async findOne(id: string, userId: string) {
    const providerId = userId;
    const appointment = await this.recurringAppointmentRepository.findOne({
      where: { id, providerId },
      relations: ['service'],
    });

    if (!appointment) {
      throw new NotFoundException('Recurring appointment not found');
    }

    return appointment;
  }

  async update(id: string, updateRecurringAppointmentDto: UpdateRecurringAppointmentDto, userId: string) {
    const appointment = await this.findOne(id, userId);
    
    Object.assign(appointment, updateRecurringAppointmentDto);
    
    // Recalculate next occurrence if interval or start date changed
    if (updateRecurringAppointmentDto.interval || updateRecurringAppointmentDto.startDate) {
      appointment.nextOccurrence = this.calculateNextOccurrence(
        appointment.startDate,
        appointment.interval
      );
    }
    
    return this.recurringAppointmentRepository.save(appointment);
  }

  async remove(id: string, userId: string) {
    const appointment = await this.findOne(id, userId);
    await this.recurringAppointmentRepository.remove(appointment);
    return { message: 'Recurring appointment deleted successfully' };
  }

  async pause(id: string, userId: string) {
    const appointment = await this.findOne(id, userId);
    appointment.status = RecurringStatus.PAUSED;
    await this.recurringAppointmentRepository.save(appointment);
    return { message: 'Recurring appointment paused successfully' };
  }

  async resume(id: string, userId: string) {
    const appointment = await this.findOne(id, userId);
    appointment.status = RecurringStatus.ACTIVE;
    appointment.nextOccurrence = this.calculateNextOccurrence(
      new Date().toISOString().split('T')[0],
      appointment.interval
    );
    await this.recurringAppointmentRepository.save(appointment);
    return { message: 'Recurring appointment resumed successfully' };
  }

  private calculateNextOccurrence(startDate: string, interval: RecurringInterval): string {
    const start = new Date(startDate);
    const now = new Date();
    let nextOccurrence = new Date(start);

    // If start date is in the past, calculate next occurrence from today
    if (start < now) {
      nextOccurrence = new Date(now);
    }

    switch (interval) {
      case RecurringInterval.WEEKLY:
        nextOccurrence.setDate(nextOccurrence.getDate() + 7);
        break;
      case RecurringInterval.BIWEEKLY:
        nextOccurrence.setDate(nextOccurrence.getDate() + 14);
        break;
      case RecurringInterval.MONTHLY:
        nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
        break;
    }

    return nextOccurrence.toISOString().split('T')[0];
  }
}