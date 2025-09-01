import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  findAll() {
    return this.notificationRepository.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.notificationRepository.findOne({ where: { id }, relations: ['user'] });
  }

  create(data: Partial<Notification>) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  update(id: string, data: Partial<Notification>) {
    return this.notificationRepository.update(id, data);
  }

  remove(id: string) {
    return this.notificationRepository.delete(id);
  }
}
