import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '../../entities/system-setting.entity';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingsRepository: Repository<SystemSetting>,
  ) {}

  async create(data: Partial<SystemSetting>): Promise<SystemSetting> {
    const setting = this.settingsRepository.create(data);
    return this.settingsRepository.save(setting);
  }

  async findAll(): Promise<SystemSetting[]> {
    return this.settingsRepository.find({ order: { key: 'ASC' } });
  }

  async findOne(id: string): Promise<SystemSetting | null> {
    return this.settingsRepository.findOneBy({ id });
  }

  async findByKey(key: string): Promise<SystemSetting | null> {
    return this.settingsRepository.findOneBy({ key });
  }
}
