import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './provider.entity';
import { Category } from './category.entity';
import { Booking } from './booking.entity';

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

export enum ServiceType {
  APPOINTMENT = 'appointment',
  PACKAGE = 'package',
  CONSULTATION = 'consultation',
}

export enum PricingType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
  VARIABLE = 'variable',
}

@Entity('services')
@Index(['providerId'])
@Index(['categoryId'])
@Index(['status'])
@Index(['isActive'])
export class Service {
  @ApiProperty({ description: 'Unique identifier for the service' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Service name' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ description: 'Service description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Short service description for listings' })
  @Column({ length: 500 })
  shortDescription: string;

  @ApiProperty({ description: 'Service type', enum: ServiceType })
  @Column({
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.APPOINTMENT,
  })
  serviceType: ServiceType;

  @ApiProperty({ description: 'Service pricing type', enum: PricingType })
  @Column({
    type: 'enum',
    enum: PricingType,
    default: PricingType.FIXED,
  })
  pricingType: PricingType;

  @ApiProperty({ description: 'Service base price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @ApiProperty({ description: 'Service currency code (e.g., EUR, USD)' })
  @Column({ length: 3, default: 'EUR' })
  currency: string;

  @ApiProperty({ description: 'Service duration in minutes' })
  @Column({ type: 'int' })
  durationMinutes: number;

  @ApiProperty({ description: 'Buffer time after service in minutes' })
  @Column({ type: 'int', default: 0 })
  bufferTimeMinutes: number;

  @ApiProperty({ description: 'Maximum advance booking days' })
  @Column({ type: 'int', default: 30 })
  maxAdvanceBookingDays: number;

  @ApiProperty({ description: 'Minimum advance booking hours' })
  @Column({ type: 'int', default: 2 })
  minAdvanceBookingHours: number;

  @ApiProperty({ description: 'Maximum cancellation hours before service' })
  @Column({ type: 'int', default: 24 })
  cancellationPolicyHours: number;

  @ApiProperty({ description: 'Service requires deposit' })
  @Column({ default: false })
  requiresDeposit: boolean;

  @ApiProperty({ description: 'Deposit amount', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  depositAmount?: number;

  @ApiProperty({ description: 'Service image URLs (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  images?: string[];

  @ApiProperty({ description: 'Service images Cloudinary public IDs (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  imagesPublicIds?: string[];

  @ApiProperty({ description: 'Service tags for search (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  tags?: string[];

  @ApiProperty({ description: 'Service preparation instructions', required: false })
  @Column({ nullable: true, type: 'text' })
  preparationInstructions?: string;

  @ApiProperty({ description: 'Service aftercare instructions', required: false })
  @Column({ nullable: true, type: 'text' })
  aftercareInstructions?: string;

  @ApiProperty({ description: 'Service is online/virtual' })
  @Column({ default: false })
  isOnline: boolean;

  @ApiProperty({ description: 'Service status', enum: ServiceStatus })
  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @ApiProperty({ description: 'Service is active and bookable' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Service is featured' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Service display order' })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Total bookings count' })
  @Column({ default: 0 })
  totalBookings: number;

  @ApiProperty({ description: 'Average rating (1-5)', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 2 })
  averageRating?: number;

  @ApiProperty({ description: 'Total reviews count' })
  @Column({ default: 0 })
  totalReviews: number;

  @ApiProperty({ description: 'SEO meta title', required: false })
  @Column({ nullable: true, length: 200 })
  metaTitle?: string;

  @ApiProperty({ description: 'SEO meta description', required: false })
  @Column({ nullable: true, length: 500 })
  metaDescription?: string;

  @ApiProperty({ description: 'Service creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Category ID' })
  @Column({ type: 'uuid' })
  categoryId: string;

  // Relationships
  @ManyToOne(() => Provider, (provider) => provider.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  // @ManyToMany('ServiceAddon', 'compatibleServices')
  // compatibleAddons: any[];

  // Virtual properties
  @ApiProperty({ description: 'Formatted price with currency' })
  get formattedPrice(): string {
    return `${this.basePrice} ${this.currency}`;
  }

  @ApiProperty({ description: 'Service duration formatted as hours:minutes' })
  get formattedDuration(): string {
    const hours = Math.floor(this.durationMinutes / 60);
    const minutes = this.durationMinutes % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }
}
