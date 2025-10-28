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

export enum BlockedTimeType {
  VACATION = 'vacation',
  PERSONAL = 'personal',
  MAINTENANCE = 'maintenance',
  HOLIDAY = 'holiday',
  EMERGENCY = 'emergency',
  OTHER = 'other',
}

@Entity('provider_blocked_times')
@Index(['providerId'])
@Index(['blockDate'])
@Index(['isActive'])
export class ProviderBlockedTime {
  @ApiProperty({ description: 'Unique identifier for blocked time' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date to block (YYYY-MM-DD format)' })
  @Column({ type: 'date' })
  blockDate: string;

  @ApiProperty({ description: 'Start time (HH:MM format). Null for all-day blocks' })
  @Column({ type: 'time', nullable: true })
  startTime?: string;

  @ApiProperty({ description: 'End time (HH:MM format). Null for all-day blocks' })
  @Column({ type: 'time', nullable: true })
  endTime?: string;

  @ApiProperty({ description: 'Is this an all-day block' })
  @Column({ default: false })
  isAllDay: boolean;

  @ApiProperty({ description: 'Type of blocked time', enum: BlockedTimeType })
  @Column({
    type: 'enum',
    enum: BlockedTimeType,
    default: BlockedTimeType.PERSONAL,
  })
  blockType: BlockedTimeType;

  @ApiProperty({ description: 'Reason for blocking this time' })
  @Column({ length: 500 })
  reason: string;

  @ApiProperty({ description: 'Is this blocked time active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Is this a recurring block (e.g., every Monday)' })
  @Column({ default: false })
  isRecurring: boolean;

  @ApiProperty({ description: 'Recurring pattern (weekly, monthly, etc.)', required: false })
  @Column({ length: 50, nullable: true })
  recurringPattern?: string;

  @ApiProperty({ description: 'End date for recurring blocks', required: false })
  @Column({ type: 'date', nullable: true })
  recurringEndDate?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Blocked time creation timestamp' })
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
  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  // Virtual properties
  @ApiProperty({ description: 'Formatted display of blocked time' })
  get formattedBlockTime(): string {
    if (this.isAllDay) {
      return 'All day';
    }
    
    if (this.startTime && this.endTime) {
      return `${this.startTime} - ${this.endTime}`;
    }
    
    return 'Time not specified';
  }

  @ApiProperty({ description: 'Is this block currently active (based on date)' })
  get isCurrentlyActive(): boolean {
    if (!this.isActive) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const blockDate = this.blockDate;

    if (this.isRecurring && this.recurringEndDate) {
      return blockDate <= today && today <= this.recurringEndDate;
    }

    return blockDate >= today;
  }
}