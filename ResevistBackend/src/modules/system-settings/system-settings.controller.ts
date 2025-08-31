import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { SystemSetting } from '../../entities/system-setting.entity';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Post()
  async create(@Body() data: Partial<SystemSetting>): Promise<SystemSetting> {
    return this.systemSettingsService.create(data);
  }

  @Get()
  async findAll(): Promise<SystemSetting[]> {
    return this.systemSettingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SystemSetting | null> {
    return this.systemSettingsService.findOne(id);
  }

  @Get('key/:key')
  async findByKey(@Param('key') key: string): Promise<SystemSetting | null> {
    return this.systemSettingsService.findByKey(key);
  }
}
