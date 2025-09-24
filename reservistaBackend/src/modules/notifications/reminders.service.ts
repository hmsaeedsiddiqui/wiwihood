import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Reminder } from '../../entities/reminder.entity';
import { User } from '../../entities/user.entity';
import { Booking } from '../../entities/booking.entity';
import { NotificationsService } from './notifications.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private notificationsService: NotificationsService,
  ) {}

  async findUserReminders(userId: string): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: { userId },
      relations: ['booking'],
      order: { scheduledAt: 'ASC' }
    });
  }

  async create(data: {
    userId: string;
    bookingId?: string;
    title: string;
    message: string;
    type?: string;
    scheduledAt: Date;
    deliveryMethod?: string;
    data?: any;
  }): Promise<Reminder> {
    const reminder = this.reminderRepository.create({
      userId: data.userId,
      bookingId: data.bookingId,
      title: data.title,
      message: data.message,
      type: data.type || 'custom',
      scheduledAt: data.scheduledAt,
      deliveryMethod: data.deliveryMethod || 'notification',
      data: data.data
    });

    return this.reminderRepository.save(reminder);
  }

  async update(id: string, data: any, userId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id, userId }
    });

    if (!reminder) {
      throw new Error('Reminder not found or access denied');
    }

    Object.assign(reminder, data);
    return this.reminderRepository.save(reminder);
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.reminderRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new Error('Reminder not found or access denied');
    }
  }

  // Process pending reminders (called by cron job)
  async processPendingReminders(): Promise<void> {
    const now = new Date();
    const pendingReminders = await this.reminderRepository.find({
      where: {
        scheduledAt: LessThan(now),
        isSent: false
      },
      relations: ['user', 'booking']
    });

    for (const reminder of pendingReminders) {
      try {
        // Send notification
        if (reminder.deliveryMethod === 'notification' || reminder.deliveryMethod === 'all') {
          await this.notificationsService.create({
            userId: reminder.userId,
            title: reminder.title,
            message: reminder.message,
            type: 'reminder',
            data: {
              reminderId: reminder.id,
              bookingId: reminder.bookingId,
              ...reminder.data
            }
          });
        }

        // Mark as sent
        reminder.isSent = true;
        reminder.sentAt = now;
        await this.reminderRepository.save(reminder);
      } catch (error) {
        console.error(`Failed to process reminder ${reminder.id}:`, error);
      }
    }
  }

  // Create automatic reminders for bookings
  async createBookingReminders(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['customer', 'provider', 'service']
    });

    if (!booking) return;

    const bookingDateTime = booking.startDateTime;
    const serviceName = booking.service?.name || 'appointment';
    const timeString = bookingDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 24 hours before reminder
    const dayBeforeReminder = new Date(bookingDateTime);
    dayBeforeReminder.setHours(dayBeforeReminder.getHours() - 24);

    if (dayBeforeReminder > new Date()) {
      await this.create({
        userId: booking.customerId,
        bookingId: booking.id,
        title: 'Booking Reminder - Tomorrow',
        message: `You have a ${serviceName} appointment tomorrow at ${timeString}`,
        type: 'booking',
        scheduledAt: dayBeforeReminder,
        deliveryMethod: 'all'
      });
    }

    // 2 hours before reminder
    const twoHoursBeforeReminder = new Date(bookingDateTime);
    twoHoursBeforeReminder.setHours(twoHoursBeforeReminder.getHours() - 2);

    if (twoHoursBeforeReminder > new Date()) {
      await this.create({
        userId: booking.customerId,
        bookingId: booking.id,
        title: 'Booking Reminder - 2 Hours',
        message: `Your ${serviceName} appointment is in 2 hours at ${timeString}`,
        type: 'booking',
        scheduledAt: twoHoursBeforeReminder,
        deliveryMethod: 'notification'
      });
    }

    // Provider reminder - 30 minutes before
    const providerReminder = new Date(bookingDateTime);
    providerReminder.setMinutes(providerReminder.getMinutes() - 30);

    if (providerReminder > new Date()) {
      await this.create({
        userId: booking.providerId,
        bookingId: booking.id,
        title: 'Upcoming Appointment',
        message: `You have an appointment with ${booking.customer?.firstName || 'customer'} in 30 minutes`,
        type: 'booking',
        scheduledAt: providerReminder,
        deliveryMethod: 'notification'
      });
    }
  }
}