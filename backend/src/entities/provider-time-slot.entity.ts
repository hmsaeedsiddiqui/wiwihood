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
import { Service } from './service.entity';

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  BREAK = 'break',
}

@Entity('provider_time_slots')
@Index(['providerId'])
@Index(['slotDate'])
@Index(['startTime'])
@Index(['status'])
@Index(['serviceId'])
export class ProviderTimeSlot {
  @ApiProperty({ description: 'Unique identifier for time slot' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the slot (YYYY-MM-DD format)' })
  @Column({ type: 'date' })
  slotDate: string;

  @ApiProperty({ description: 'Start time of slot (HH:MM format)' })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({ description: 'End time of slot (HH:MM format)' })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({ description: 'Duration in minutes' })
  @Column({ type: 'int' })
  durationMinutes: number;

  @ApiProperty({ description: 'Status of the time slot', enum: TimeSlotStatus })
  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  @ApiProperty({ description: 'Maximum bookings for this slot' })
  @Column({ type: 'int', default: 1 })
  maxBookings: number;

  @ApiProperty({ description: 'Current number of bookings' })
  @Column({ type: 'int', default: 0 })
  currentBookings: number;

  @ApiProperty({ description: 'Buffer time after this slot in minutes' })
  @Column({ type: 'int', default: 0 })
  bufferTimeMinutes: number;

  @ApiProperty({ description: 'Is this slot manually created or auto-generated' })
  @Column({ default: false })
  isManuallyCreated: boolean;

  @ApiProperty({ description: 'Is this slot part of a break' })
  @Column({ default: false })
  isBreakSlot: boolean;

  @ApiProperty({ description: 'Price for this specific slot (overrides service price)', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  customPrice?: number;

  @ApiProperty({ description: 'Notes for this slot', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Time slot creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Service ID (if slot is for specific service)', required: false })
  @Column({ type: 'uuid', nullable: true })
  serviceId?: string;

  // Relationships
  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service?: Service;

  // Virtual properties
  @ApiProperty({ description: 'Is this slot available for booking' })
  get isAvailable(): boolean {
    return this.status === TimeSlotStatus.AVAILABLE && 
           this.currentBookings < this.maxBookings;
  }

  @ApiProperty({ description: 'Remaining booking capacity' })
  get remainingCapacity(): number {
    return Math.max(0, this.maxBookings - this.currentBookings);
  }

  @ApiProperty({ description: 'Formatted time display' })
  get formattedTime(): string {
    return `${this.startTime} - ${this.endTime}`;
  }

  @ApiProperty({ description: 'Full datetime for slot start' })
  get slotDateTime(): Date {
    return new Date(`${this.slotDate}T${this.startTime}:00`);
  }

  @ApiProperty({ description: 'Is this slot in the past' })
  get isPast(): boolean {
    const now = new Date();
    const slotDateTime = this.slotDateTime;
    return slotDateTime < now;
  }
}