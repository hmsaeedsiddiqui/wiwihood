import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../entities/notification.entity';
import { Message } from '../../entities/message.entity';
import { Reminder } from '../../entities/reminder.entity';
import { User } from '../../entities/user.entity';
import { Booking } from '../../entities/booking.entity';
import { NotificationsService } from './notifications.service';
import { MessagesService } from './messages.service';
import { RemindersService } from './reminders.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])], // Simplified for testing
  providers: [NotificationsService], // Simplified for testing
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
