import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Service } from './service.entity';
import { ProviderWorkingHours } from './provider-working-hours.entity';
import { ProviderTimeOff } from './provider-time-off.entity';
import { Booking } from './booking.entity';
// import { Review } from './review.entity';
import { Favorite } from './favorite.entity';
import { Payout } from './payout.entity';

export enum ProviderStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export enum ProviderType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

@Entity('providers')
@Index(['userId'], { unique: true })
@Index(['status'])
@Index(['isVerified'])
export class Provider {
  @ApiProperty({ description: 'Unique identifier for the provider' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Business/provider name' })
  @Column({ length: 200 })
  businessName: string;

  @ApiProperty({ description: 'Provider type', enum: ProviderType })
  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.INDIVIDUAL,
  })
  providerType: ProviderType;

  @ApiProperty({ description: 'Business description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'Business address' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ description: 'Business city' })
  @Column({ length: 100 })
  city: string;

  @ApiProperty({ description: 'Business state/region', required: false })
  @Column({ nullable: true, length: 100 })
  state?: string;

  @ApiProperty({ description: 'Business country' })
  @Column({ length: 100 })
  country: string;

  @ApiProperty({ description: 'Business postal code' })
  @Column({ length: 20 })
  postalCode: string;

  @ApiProperty({ description: 'Business latitude for mapping', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  latitude?: number;

  @ApiProperty({ description: 'Business longitude for mapping', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 11, scale: 8 })
  longitude?: number;

  @ApiProperty({ description: 'Business phone number' })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({ description: 'Business website URL', required: false })
  @Column({ nullable: true, length: 500 })
  website?: string;

  @ApiProperty({ description: 'Business license number', required: false })
  @Column({ nullable: true, length: 100 })
  licenseNumber?: string;

  @ApiProperty({ description: 'Tax identification number', required: false })
  @Column({ nullable: true, length: 100 })
  taxId?: string;

  @ApiProperty({ description: 'Business logo URL', required: false })
  @Column({ nullable: true, length: 500 })
  logo?: string;

  @ApiProperty({ description: 'Business cover image URL', required: false })
  @Column({ nullable: true, length: 500 })
  coverImage?: string;

  @ApiProperty({ description: 'Provider status', enum: ProviderStatus })
  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.PENDING_VERIFICATION,
  })
  status: ProviderStatus;

  @ApiProperty({ description: 'Provider verification status' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Provider accepts online payments' })
  @Column({ default: true })
  acceptsOnlinePayments: boolean;

  @ApiProperty({ description: 'Provider accepts cash payments' })
  @Column({ default: false })
  acceptsCashPayments: boolean;

  @ApiProperty({ description: 'Provider requires deposit' })
  @Column({ default: false })
  requiresDeposit: boolean;

  @ApiProperty({ description: 'Deposit percentage (0-100)', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  depositPercentage?: number;

  @ApiProperty({ description: 'Cancellation policy hours' })
  @Column({ default: 24, type: 'int' })
  cancellationPolicyHours: number;

  @ApiProperty({ description: 'Platform commission rate (0-100)' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.00 })
  commissionRate: number;

  @ApiProperty({ description: 'Average rating (1-5)', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 2 })
  averageRating?: number;

  @ApiProperty({ description: 'Total number of reviews' })
  @Column({ default: 0 })
  totalReviews: number;

  @ApiProperty({ description: 'Total number of completed bookings' })
  @Column({ default: 0 })
  totalBookings: number;

  @ApiProperty({ description: 'Provider verification notes', required: false })
  @Column({ nullable: true, type: 'text' })
  verificationNotes?: string;

  @ApiProperty({ description: 'Provider verification date', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  verifiedAt?: Date;

  @ApiProperty({ description: 'Account creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Associated user ID' })
  @Column({ type: 'uuid' })
  userId: string;

  // Relationships
  @OneToOne(() => User, (user) => user.provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @OneToMany(() => ProviderWorkingHours, (workingHours) => workingHours.provider)
  workingHours: ProviderWorkingHours[];

  @OneToMany(() => ProviderTimeOff, (timeOff) => timeOff.provider)
  timeOffs: ProviderTimeOff[];

  @OneToMany(() => Booking, (booking) => booking.provider)
  bookings: Booking[];

  // @OneToMany(() => Review, (review) => review.provider)
  // reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.provider)
  favorites: Favorite[];

  @OneToMany(() => Payout, (payout) => payout.provider)
  payouts: Payout[];

  // Virtual properties
  @ApiProperty({ description: 'Full business address' })
  get fullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state ? this.state + ', ' : ''}${this.country} ${this.postalCode}`;
  }
}
