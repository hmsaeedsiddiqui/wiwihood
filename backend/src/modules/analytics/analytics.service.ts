import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from '../../entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  async create(data: Partial<Analytics>): Promise<Analytics> {
    const analytics = this.analyticsRepository.create(data);
    return this.analyticsRepository.save(analytics);
  }

  async findAll(): Promise<Analytics[]> {
    return this.analyticsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Analytics | null> {
    return this.analyticsRepository.findOneBy({ id });
  }
}
