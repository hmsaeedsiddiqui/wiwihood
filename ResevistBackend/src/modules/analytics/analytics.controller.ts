import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Analytics } from '../../entities/analytics.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  async create(@Body() data: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsService.create(data);
  }

  @Get()
  async findAll(): Promise<Analytics[]> {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Analytics | null> {
    return this.analyticsService.findOne(id);
  }
}
