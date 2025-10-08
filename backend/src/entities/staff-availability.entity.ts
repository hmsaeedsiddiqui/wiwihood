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
import { Staff } from './staff.entity';

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OUT_OF_OFFICE = 'OUT_OF_OFFICE',
  BLOCKED = 'BLOCKED',
}

@Entity('staff_availability')
@Index(['staffId', 'startDateTime'])
@Index(['providerId', 'startDateTime'])
@Index(['status'])
export class StaffAvailability {
  @ApiProperty({ description: 'Unique identifier for availability slot' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Availability start date and time' })
  @Column({ name: 'start_date_time', type: 'timestamp' })
  startDateTime: Date;

  @ApiProperty({ description: 'Availability end date and time' })
  @Column({ name: 'end_date_time', type: 'timestamp' })
  endDateTime: Date;

  @ApiProperty({ description: 'Availability status', enum: AvailabilityStatus })
  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    default: AvailabilityStatus.AVAILABLE,
  })
  status: AvailabilityStatus;

  @ApiProperty({ description: 'Reason for unavailability', required: false })
  @Column({ nullable: true, type: 'text' })
  reason?: string;

  @ApiProperty({ description: 'Is this a recurring availability slot' })
  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @ApiProperty({ description: 'Buffer time before next appointment (minutes)' })
  @Column({ name: 'buffer_minutes', type: 'int', default: 0 })
  bufferMinutes: number;

  @ApiProperty({ description: 'Maximum concurrent bookings for this slot' })
  @Column({ name: 'max_concurrent_bookings', type: 'int', default: 1 })
  maxConcurrentBookings: number;

  @ApiProperty({ description: 'Current booking count for this slot' })
  @Column({ name: 'current_booking_count', type: 'int', default: 0 })
  currentBookingCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Staff ID (optional for provider-level availability)' })
  @Column({ name: 'staff_id', type: 'uuid', nullable: true })
  staffId?: string;

  // Relationships
  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => Staff, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff?: Staff;

  // Virtual properties
  @ApiProperty({ description: 'Is slot available for booking' })
  get isAvailable(): boolean {
    return this.status === AvailabilityStatus.AVAILABLE && 
           this.currentBookingCount < this.maxConcurrentBookings;
  }

  @ApiProperty({ description: 'Remaining booking capacity' })
  get remainingCapacity(): number {
    return this.maxConcurrentBookings - this.currentBookingCount;
  }
}