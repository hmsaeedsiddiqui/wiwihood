import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Analytics } from '../../entities/analytics.entity';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create analytics data' })
  @ApiResponse({ status: 201, description: 'Analytics data created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() data: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analytics data' })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  async findAll(): Promise<Analytics[]> {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics data by ID' })
  @ApiParam({ name: 'id', description: 'Analytics ID' })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Analytics data not found' })
  async findOne(@Param('id') id: string): Promise<Analytics | null> {
    return this.analyticsService.findOne(id);
  }
}
