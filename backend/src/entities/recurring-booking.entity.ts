import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Provider } from './provider.entity';
import { Service } from './service.entity';
import { Booking } from './booking.entity';

export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum RecurrenceStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('recurring_bookings')
@Index(['customerId'])
@Index(['providerId'])
@Index(['serviceId'])
@Index(['status'])
@Index(['nextBookingDate'])
export class RecurringBooking {
  @ApiProperty({ description: 'Unique identifier for the recurring booking' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Recurrence frequency', enum: RecurrenceFrequency })
  @Column({
    type: 'enum',
    enum: RecurrenceFrequency,
  })
  frequency: RecurrenceFrequency;

  @ApiProperty({ description: 'Recurrence status', enum: RecurrenceStatus })
  @Column({
    type: 'enum',
    enum: RecurrenceStatus,
    default: RecurrenceStatus.ACTIVE,
  })
  status: RecurrenceStatus;

  @ApiProperty({ description: 'Start time (time only, date from next booking date)' })
  @Column({ name: 'start_time', type: 'varchar' })
  startTime: string;

  @ApiProperty({ description: 'Duration in minutes' })
  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @ApiProperty({ description: 'Days of week for weekly recurrence (1=Monday, 7=Sunday)', required: false })
  @Column({ name: 'days_of_week', type: 'json', nullable: true })
  daysOfWeek?: number[];

  @ApiProperty({ description: 'Interval for recurrence (e.g., every 2 weeks)', required: false })
  @Column({ name: 'recurrence_interval', type: 'int', default: 1 })
  recurrenceInterval: number;

  @ApiProperty({ description: 'Next scheduled booking date' })
  @Column({ name: 'next_booking_date', type: 'date' })
  nextBookingDate: Date;

  @ApiProperty({ description: 'End date for recurrence (null for indefinite)' })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Maximum number of bookings (null for unlimited)' })
  @Column({ name: 'max_bookings', type: 'int', nullable: true })
  maxBookings?: number;

  @ApiProperty({ description: 'Current booking count' })
  @Column({ name: 'current_booking_count', type: 'int', default: 0 })
  currentBookingCount: number;

  @ApiProperty({ description: 'Special instructions for all bookings' })
  @Column({ name: 'special_instructions', type: 'text', nullable: true })
  specialInstructions?: string;

  @ApiProperty({ description: 'Auto-confirm bookings' })
  @Column({ name: 'auto_confirm', default: true })
  autoConfirm: boolean;

  @ApiProperty({ description: 'Notification preferences (JSON)' })
  @Column({ name: 'notification_preferences', type: 'jsonb', nullable: true })
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    reminderDaysBefore: number[];
  };

  @ApiProperty({ description: 'Days to skip (JSON array of dates)' })
  @Column({ name: 'skip_dates', type: 'json', nullable: true })
  skipDates?: string[];

  @ApiProperty({ description: 'Last booking creation date' })
  @Column({ name: 'last_booking_created', type: 'timestamp', nullable: true })
  lastBookingCreated?: Date;

  @ApiProperty({ description: 'Recurring booking creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Customer ID' })
  @Column({ name: 'customer_id' })
  customerId: string;

  @ApiProperty({ description: 'Customer who made the recurring booking' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id' })
  providerId: string;

  @ApiProperty({ description: 'Provider for the recurring booking' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ApiProperty({ description: 'Service ID' })
  @Column({ name: 'service_id' })
  serviceId: string;

  @ApiProperty({ description: 'Service for the recurring booking' })
  @ManyToOne(() => Service, { eager: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ApiProperty({ description: 'Bookings created from this recurring booking' })
  @OneToMany(() => Booking, (booking) => booking.recurringBooking)
  bookings: Booking[];
}

@Entity('recurring_booking_exceptions')
@Index(['recurringBookingId'])
@Index(['exceptionDate'])
export class RecurringBookingException {
  @ApiProperty({ description: 'Unique identifier for the exception' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the exception' })
  @Column({ name: 'exception_date', type: 'date' })
  exceptionDate: Date;

  @ApiProperty({ description: 'Type of exception' })
  @Column({
    name: 'exception_type',
    type: 'enum',
    enum: ['skip', 'reschedule', 'cancel'],
  })
  exceptionType: 'skip' | 'reschedule' | 'cancel';

  @ApiProperty({ description: 'New date if rescheduled' })
  @Column({ name: 'new_date', type: 'date', nullable: true })
  newDate?: Date;

  @ApiProperty({ description: 'New time if rescheduled' })
  @Column({ name: 'new_time', type: 'time', nullable: true })
  newTime?: string;

  @ApiProperty({ description: 'Reason for exception' })
  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ApiProperty({ description: 'Exception creation date' })
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ApiProperty({ description: 'Recurring booking ID' })
  @Column({ name: 'recurring_booking_id' })
  recurringBookingId: string;

  @ApiProperty({ description: 'Associated recurring booking' })
  @ManyToOne(() => RecurringBooking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recurring_booking_id' })
  recurringBooking: RecurringBooking;
}