import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from './service.entity';
import { Provider } from './provider.entity';

@Entity('service_availability_settings')
@Index(['serviceId'])
@Index(['providerId'])
export class ServiceAvailabilitySettings {
  @ApiProperty({ description: 'Unique identifier for service availability settings' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Service ID' })
  @Column({ type: 'uuid' })
  serviceId: string;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Custom duration for this service (overrides provider default)' })
  @Column({ type: 'int', nullable: true })
  customDurationMinutes?: number;

  @ApiProperty({ description: 'Custom buffer time for this service (overrides provider default)' })
  @Column({ type: 'int', nullable: true })
  customBufferTimeMinutes?: number;

  @ApiProperty({ description: 'Custom advance booking days for this service' })
  @Column({ type: 'int', nullable: true })
  customMaxAdvanceBookingDays?: number;

  @ApiProperty({ description: 'Custom minimum advance booking hours for this service' })
  @Column({ type: 'int', nullable: true })
  customMinAdvanceBookingHours?: number;

  @ApiProperty({ description: 'Specific days this service is available (JSON array)' })
  @Column({ type: 'json', nullable: true })
  availableDays?: string[]; // ['monday', 'tuesday', etc.]

  @ApiProperty({ description: 'Specific time slots for this service (JSON array)' })
  @Column({ type: 'json', nullable: true })
  customTimeSlots?: string[]; // ['09:00', '10:30', etc.]

  @ApiProperty({ description: 'Custom working hours for this service (JSON object)' })
  @Column({ type: 'json', nullable: true })
  customWorkingHours?: {
    [day: string]: {
      startTime: string;
      endTime: string;
      breakStartTime?: string;
      breakEndTime?: string;
    };
  };

  @ApiProperty({ description: 'Service requires special scheduling' })
  @Column({ default: false })
  requiresSpecialScheduling: boolean;

  @ApiProperty({ description: 'Service can be booked on weekends' })
  @Column({ default: true })
  allowWeekends: boolean;

  @ApiProperty({ description: 'Service allows back-to-back bookings' })
  @Column({ default: true })
  allowBackToBack: boolean;

  @ApiProperty({ description: 'Maximum bookings per day for this service' })
  @Column({ type: 'int', nullable: true })
  maxBookingsPerDay?: number;

  @ApiProperty({ description: 'Custom preparation time before service' })
  @Column({ type: 'int', default: 0 })
  preparationTimeMinutes: number;

  @ApiProperty({ description: 'Custom cleanup time after service' })
  @Column({ type: 'int', default: 0 })
  cleanupTimeMinutes: number;

  @ApiProperty({ description: 'Service priority (higher number = higher priority)' })
  @Column({ type: 'int', default: 0 })
  priority: number;

  @ApiProperty({ description: 'Service-specific notes for availability' })
  @Column({ type: 'text', nullable: true })
  availabilityNotes?: string;

  @ApiProperty({ description: 'Service is temporarily unavailable' })
  @Column({ default: false })
  isTemporarilyUnavailable: boolean;

  @ApiProperty({ description: 'Reason for temporary unavailability' })
  @Column({ nullable: true })
  unavailabilityReason?: string;

  @ApiProperty({ description: 'When service becomes available again' })
  @Column({ type: 'timestamp', nullable: true })
  availableAgainAt?: Date;

  @ApiProperty({ description: 'Settings are active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // =================== RELATIONSHIPS ===================

  @ManyToOne(() => Service, service => service.availabilitySettings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  // =================== COMPUTED PROPERTIES ===================

  @ApiProperty({ description: 'Effective duration (custom or service default)' })
  get effectiveDurationMinutes(): number {
    return this.customDurationMinutes || this.service?.durationMinutes || 60;
  }

  @ApiProperty({ description: 'Effective buffer time (custom or provider default)' })
  get effectiveBufferTimeMinutes(): number {
    return this.customBufferTimeMinutes || 15;
  }

  @ApiProperty({ description: 'Total time including preparation and cleanup' })
  get totalTimeMinutes(): number {
    return this.effectiveDurationMinutes + 
           this.preparationTimeMinutes + 
           this.cleanupTimeMinutes + 
           this.effectiveBufferTimeMinutes;
  }

  @ApiProperty({ description: 'Whether service has custom availability settings' })
  get hasCustomSettings(): boolean {
    return !!(
      this.customDurationMinutes ||
      this.customBufferTimeMinutes ||
      this.availableDays?.length ||
      this.customTimeSlots?.length ||
      this.customWorkingHours ||
      this.requiresSpecialScheduling ||
      this.maxBookingsPerDay
    );
  }
}