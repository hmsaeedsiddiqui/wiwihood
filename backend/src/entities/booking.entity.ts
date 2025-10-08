 import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Provider } from './provider.entity';
import { Service } from './service.entity';
import { Payment } from './payment.entity';
import { BookingAddon } from './service-addon.entity';
import { RecurringBooking } from './recurring-booking.entity';
import { Staff } from './staff.entity';
// import { Review } from './review.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum BookingSource {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  ADMIN_PANEL = 'ADMIN_PANEL',
  PHONE = 'PHONE',
  WALK_IN = 'WALK_IN',
}

@Entity('bookings')
@Index(['customerId'])
@Index(['providerId'])
@Index(['serviceId'])
@Index(['status'])
@Index(['startDateTime'])
@Index(['bookingNumber'], { unique: true })
export class Booking {
  @ApiProperty({ description: 'Unique identifier for the booking' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Human-readable booking number' })
  @Column({ unique: true, length: 20 })
  bookingNumber: string;

  @ApiProperty({ description: 'Booking start date and time' })
  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @ApiProperty({ description: 'Booking end date and time' })
  @Column({ type: 'timestamp' })
  endDateTime: Date;

  @ApiProperty({ description: 'Service duration in minutes' })
  @Column({ type: 'int' })
  durationMinutes: number;

  @ApiProperty({ description: 'Total booking price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({ length: 3, default: 'EUR' })
  currency: string;

  @ApiProperty({ description: 'Deposit amount', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  depositAmount?: number;

  @ApiProperty({ description: 'Booking status', enum: BookingStatus })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({ description: 'Booking source', enum: BookingSource })
  @Column({
    type: 'enum',
    enum: BookingSource,
    default: BookingSource.WEBSITE,
  })
  source: BookingSource;

  @ApiProperty({ description: 'Customer notes for the booking', required: false })
  @Column({ nullable: true, type: 'text' })
  customerNotes?: string;

  @ApiProperty({ description: 'Provider notes for the booking', required: false })
  @Column({ nullable: true, type: 'text' })
  providerNotes?: string;

  @ApiProperty({ description: 'Recurring booking ID if this is a recurring booking', required: false })
  @Column({ name: 'recurring_booking_id', nullable: true })
  recurringBookingId?: string;

  @ApiProperty({ description: 'Associated recurring booking', required: false })
  @ManyToOne(() => RecurringBooking, { nullable: true })
  @JoinColumn({ name: 'recurring_booking_id' })
  recurringBooking?: RecurringBooking;

  @ApiProperty({ description: 'Internal admin notes', required: false })
  @Column({ nullable: true, type: 'text' })
  adminNotes?: string;

  @ApiProperty({ description: 'Customer contact phone for this booking', required: false })
  @Column({ nullable: true, length: 20 })
  customerPhone?: string;

  @ApiProperty({ description: 'Customer contact email for this booking', required: false })
  @Column({ nullable: true, length: 255 })
  customerEmail?: string;

  @ApiProperty({ description: 'Is online/virtual booking' })
  @Column({ default: false })
  isOnline: boolean;

  @ApiProperty({ description: 'Online meeting link', required: false })
  @Column({ nullable: true, length: 500 })
  onlineMeetingLink?: string;

  @ApiProperty({ description: 'Booking location address', required: false })
  @Column({ nullable: true, type: 'text' })
  location?: string;

  @ApiProperty({ description: 'Reminder sent to customer' })
  @Column({ default: false })
  reminderSent: boolean;

  @ApiProperty({ description: 'Confirmation sent to customer' })
  @Column({ default: false })
  confirmationSent: boolean;

  @ApiProperty({ description: 'Follow-up sent to customer' })
  @Column({ default: false })
  followUpSent: boolean;

  @ApiProperty({ description: 'Cancellation reason', required: false })
  @Column({ nullable: true, type: 'text' })
  cancellationReason?: string;

  @ApiProperty({ description: 'Cancelled by user ID', required: false })
  @Column({ nullable: true, type: 'uuid' })
  cancelledBy?: string;

  @ApiProperty({ description: 'Cancellation timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  cancelledAt?: Date;

  @ApiProperty({ description: 'Booking confirmation timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  confirmedAt?: Date;

  @ApiProperty({ description: 'Service completion timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  completedAt?: Date;

  @ApiProperty({ description: 'Check-in timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  checkedInAt?: Date;

  @ApiProperty({ description: 'Booking creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Customer user ID' })
  @Column({ type: 'uuid' })
  customerId: string;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Service ID' })
  @Column({ type: 'uuid' })
  serviceId: string;

  @ApiProperty({ description: 'Staff ID (optional for multi-staff providers)' })
  @Column({ type: 'uuid', nullable: true })
  staffId?: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => Provider, (provider) => provider.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @ManyToOne(() => Service, (service) => service.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => Staff, (staff) => staff.bookings, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'staffId' })
  staff?: Staff;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  // @OneToMany(() => Review, (review) => review.booking)
  // reviews: Review[];

  // @OneToMany(() => BookingAddon, (addon) => addon.booking)
  // addons: BookingAddon[];

  // Virtual properties
  @ApiProperty({ description: 'Is booking in the past' })
  get isPast(): boolean {
    return new Date() > this.endDateTime;
  }

  @ApiProperty({ description: 'Is booking upcoming' })
  get isUpcoming(): boolean {
    return new Date() < this.startDateTime;
  }

  @ApiProperty({ description: 'Is booking currently active' })
  get isActive(): boolean {
    const now = new Date();
    return now >= this.startDateTime && now <= this.endDateTime;
  }

  @ApiProperty({ description: 'Can booking be cancelled' })
  get canBeCancelled(): boolean {
    return [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(this.status) && 
           !this.isPast;
  }

  @ApiProperty({ description: 'Can booking be rescheduled' })
  get canBeRescheduled(): boolean {
    return [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(this.status) && 
           !this.isPast;
  }
}
