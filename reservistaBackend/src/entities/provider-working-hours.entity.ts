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

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('provider_working_hours')
@Index(['dayOfWeek'])
@Index(['isActive'])
export class ProviderWorkingHours {
  @ApiProperty({ description: 'Unique identifier for working hours' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Day of the week', enum: DayOfWeek })
  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ description: 'Start time (HH:MM format)' })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({ description: 'End time (HH:MM format)' })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({ description: 'Working hours are active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Break start time (HH:MM format)', required: false })
  @Column({ nullable: true, type: 'time' })
  breakStartTime?: string;

  @ApiProperty({ description: 'Break end time (HH:MM format)', required: false })
  @Column({ nullable: true, type: 'time' })
  breakEndTime?: string;

  @ApiProperty({ description: 'Timezone for working hours' })
  @Column({ length: 50, default: 'Europe/Berlin' })
  timezone: string;

  @ApiProperty({ description: 'Notes for this working day', required: false })
  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @ApiProperty({ description: 'Working hours creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  @Index()
  providerId: string;

  // Relationships
  @ManyToOne(() => Provider, (provider) => provider.workingHours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  // Virtual properties
  @ApiProperty({ description: 'Working duration in minutes' })
  get workingDurationMinutes(): number {
    const start = this.timeToMinutes(this.startTime);
    const end = this.timeToMinutes(this.endTime);
    let duration = end - start;
    
    // Subtract break time if exists
    if (this.breakStartTime && this.breakEndTime) {
      const breakStart = this.timeToMinutes(this.breakStartTime);
      const breakEnd = this.timeToMinutes(this.breakEndTime);
      duration -= (breakEnd - breakStart);
    }
    
    return duration;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
