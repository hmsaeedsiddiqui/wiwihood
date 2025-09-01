import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './provider.entity';

export enum TimeOffType {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  PERSONAL = 'personal',
  HOLIDAY = 'holiday',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}

export enum TimeOffStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity('provider_time_off')
export class ProviderTimeOff {
  @ApiProperty({ description: 'Unique identifier for time off' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Time off title/reason' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ description: 'Time off description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'Time off type', enum: TimeOffType })
  @Column({
    type: 'enum',
    enum: TimeOffType,
    default: TimeOffType.PERSONAL,
  })
  type: TimeOffType;


  @ApiProperty({ description: 'Start date and time' })
  @Column({ type: 'timestamp' })
  startDate: Date;

  @ApiProperty({ description: 'End date and time' })
  @Column({ type: 'timestamp' })
  endDate: Date;

  @ApiProperty({ description: 'Is full day time off' })
  @Column({ default: true })
  isFullDay: boolean;

  @ApiProperty({ description: 'Start time for partial day off (HH:MM)', required: false })
  @Column({ nullable: true, type: 'time' })
  startTime?: string;

  @ApiProperty({ description: 'End time for partial day off (HH:MM)', required: false })
  @Column({ nullable: true, type: 'time' })
  endTime?: string;

  @ApiProperty({ description: 'Recurring time off pattern', required: false })
  @Column({ nullable: true, length: 100 })
  recurringPattern?: string;

  @ApiProperty({ description: 'Time off status', enum: TimeOffStatus })
  @Column({
    type: 'enum',
    enum: TimeOffStatus,
    default: TimeOffStatus.ACTIVE,
  })
  status: TimeOffStatus;

  @ApiProperty({ description: 'Automatically block bookings during this time' })
  @Column({ default: true })
  blockBookings: boolean;

  @ApiProperty({ description: 'Notify customers about this time off' })
  @Column({ default: false })
  notifyCustomers: boolean;

  @ApiProperty({ description: 'Custom message for customers', required: false })
  @Column({ nullable: true, type: 'text' })
  customerMessage?: string;

  @ApiProperty({ description: 'Time off creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  // Relationships
  @ManyToOne(() => Provider, (provider) => provider.timeOffs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  // Virtual properties
  @ApiProperty({ description: 'Duration in days' })
  get durationDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  @ApiProperty({ description: 'Is currently active' })
  get isCurrentlyActive(): boolean {
    const now = new Date();
    return this.status === TimeOffStatus.ACTIVE && 
           now >= this.startDate && 
           now <= this.endDate;
  }
}
