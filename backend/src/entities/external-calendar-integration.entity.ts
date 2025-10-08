import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export enum CalendarProvider {
  GOOGLE = 'GOOGLE',
  OUTLOOK = 'OUTLOOK',
  ICAL = 'ICAL',
  APPLE = 'APPLE',
}

export enum SyncDirection {
  ONE_WAY_TO_EXTERNAL = 'ONE_WAY_TO_EXTERNAL',
  ONE_WAY_FROM_EXTERNAL = 'ONE_WAY_FROM_EXTERNAL',
  TWO_WAY = 'TWO_WAY',
}

@Entity('external_calendar_integrations')
export class ExternalCalendarIntegration {
  @ApiProperty({ description: 'Unique identifier for calendar integration' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Calendar provider', enum: CalendarProvider })
  @Column({
    type: 'enum',
    enum: CalendarProvider,
  })
  provider: CalendarProvider;

  @ApiProperty({ description: 'External calendar ID' })
  @Column({ name: 'external_calendar_id', length: 500 })
  externalCalendarId: string;

  @ApiProperty({ description: 'Calendar display name' })
  @Column({ name: 'calendar_name', length: 255 })
  calendarName: string;

  @ApiProperty({ description: 'Access token for calendar API' })
  @Column({ name: 'access_token', type: 'text', nullable: true })
  accessToken?: string;

  @ApiProperty({ description: 'Refresh token for calendar API' })
  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken?: string;

  @ApiProperty({ description: 'Token expiry timestamp' })
  @Column({ name: 'token_expiry', type: 'timestamp', nullable: true })
  tokenExpiry?: Date;

  @ApiProperty({ description: 'iCal feed URL for read-only calendars' })
  @Column({ name: 'ical_url', type: 'text', nullable: true })
  icalUrl?: string;

  @ApiProperty({ description: 'Sync direction', enum: SyncDirection })
  @Column({
    name: 'sync_direction',
    type: 'enum',
    enum: SyncDirection,
    default: SyncDirection.ONE_WAY_TO_EXTERNAL,
  })
  syncDirection: SyncDirection;

  @ApiProperty({ description: 'Is sync currently enabled' })
  @Column({ name: 'sync_enabled', default: true })
  syncEnabled: boolean;

  @ApiProperty({ description: 'Last successful sync timestamp' })
  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt?: Date;

  @ApiProperty({ description: 'Last sync error message' })
  @Column({ name: 'last_sync_error', type: 'text', nullable: true })
  lastSyncError?: string;

  @ApiProperty({ description: 'Sync frequency in minutes' })
  @Column({ name: 'sync_frequency_minutes', type: 'int', default: 15 })
  syncFrequencyMinutes: number;

  @ApiProperty({ description: 'Include booking details in external calendar' })
  @Column({ name: 'include_booking_details', default: true })
  includeBookingDetails: boolean;

  @ApiProperty({ description: 'Prefix for external calendar events' })
  @Column({ name: 'event_prefix', length: 50, nullable: true })
  eventPrefix?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Virtual properties
  @ApiProperty({ description: 'Is token valid and not expired' })
  get isTokenValid(): boolean {
    if (!this.accessToken) return false;
    if (!this.tokenExpiry) return true;
    return new Date() < this.tokenExpiry;
  }

  @ApiProperty({ description: 'Is sync currently active' })
  get isSyncActive(): boolean {
    return this.syncEnabled && (this.isTokenValid || !!this.icalUrl);
  }
}