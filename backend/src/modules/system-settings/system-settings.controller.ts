import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SystemSettingsService } from './system-settings.service';
import { SystemSetting } from '../../entities/system-setting.entity';

@ApiTags('System Settings')
@ApiBearerAuth()
@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create system setting' })
  @ApiResponse({ status: 201, description: 'System setting created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() data: Partial<SystemSetting>): Promise<SystemSetting> {
    return this.systemSettingsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  async findAll(): Promise<SystemSetting[]> {
    return this.systemSettingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get system setting by ID' })
  @ApiParam({ name: 'id', description: 'System setting ID' })
  @ApiResponse({ status: 200, description: 'System setting retrieved successfully' })
  @ApiResponse({ status: 404, description: 'System setting not found' })
  async findOne(@Param('id') id: string): Promise<SystemSetting | null> {
    return this.systemSettingsService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get system setting by key' })
  @ApiParam({ name: 'key', description: 'System setting key' })
  @ApiResponse({ status: 200, description: 'System setting retrieved successfully' })
  @ApiResponse({ status: 404, description: 'System setting not found' })
  async findByKey(@Param('key') key: string): Promise<SystemSetting | null> {
    return this.systemSettingsService.findByKey(key);
  }
}
