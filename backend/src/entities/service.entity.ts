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
import { ServiceAvailabilitySettings } from './service-availability-settings.entity';

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
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

  @ApiProperty({ description: 'Admin quality rating for service', required: false })
  @Column({ type: 'int', nullable: true })
  adminQualityRating?: number;

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

  // Frontend Display Fields
  @ApiProperty({ description: 'Display location for service cards', required: false })
  @Column({ nullable: true, length: 300 })
  displayLocation?: string;

  @ApiProperty({ description: 'Provider business name for display', required: false })
  @Column({ nullable: true, length: 200 })
  providerBusinessName?: string;

  @ApiProperty({ description: 'Highlight badge text', required: false })
  @Column({ nullable: true, length: 100 })
  highlightBadge?: string;

  @ApiProperty({ description: 'Featured image URL', required: false })
  @Column({ nullable: true })
  featuredImage?: string;

  @ApiProperty({ description: 'Available time slots (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  availableSlots?: string[];

  @ApiProperty({ description: 'Promotion text', required: false })
  @Column({ nullable: true, length: 150 })
  promotionText?: string;

  @ApiProperty({ description: 'Service difficulty level', required: false })
  @Column({ nullable: true, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' })
  difficultyLevel?: string;

  @ApiProperty({ description: 'Special requirements or notes', required: false })
  @Column({ nullable: true, length: 500 })
  specialRequirements?: string;

  @ApiProperty({ description: 'What service includes (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  includes?: string[];

  @ApiProperty({ description: 'What service excludes (JSON array)', required: false })
  @Column({ nullable: true, type: 'json' })
  excludes?: string[];

  @ApiProperty({ description: 'Age restrictions', required: false })
  @Column({ nullable: true, length: 50 })
  ageRestriction?: string;

  @ApiProperty({ description: 'Gender preference for service', required: false })
  @Column({ nullable: true, enum: ['any', 'male', 'female'], default: 'any' })
  genderPreference?: string;

  // Promotional and Deal Fields
  @ApiProperty({ description: 'Is this service part of a promotional deal', required: false })
  @Column({ default: false })
  isPromotional?: boolean;

  @ApiProperty({ description: 'Discount percentage for promotional deals', required: false })
  @Column({ nullable: true, length: 20 })
  discountPercentage?: string;

  @ApiProperty({ description: 'Promotional code for the deal', required: false })
  @Column({ nullable: true, length: 50 })
  promoCode?: string;

  @ApiProperty({ description: 'Deal validity end date', required: false })
  @Column({ nullable: true, type: 'date' })
  dealValidUntil?: string;

  @ApiProperty({ description: 'Deal category/type', required: false })
  @Column({ nullable: true, length: 100 })
  dealCategory?: string;

  @ApiProperty({ description: 'Deal title (different from service name)', required: false })
  @Column({ nullable: true, length: 200 })
  dealTitle?: string;

  @ApiProperty({ description: 'Deal specific description', required: false })
  @Column({ nullable: true, length: 500 })
  dealDescription?: string;

  @ApiProperty({ description: 'Original price before discount', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  originalPrice?: number;

  @ApiProperty({ description: 'Minimum booking amount for deal to apply', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  minBookingAmount?: number;

  @ApiProperty({ description: 'Maximum number of times this deal can be used per customer', required: false })
  @Column({ nullable: true, type: 'int' })
  usageLimit?: number;

  @ApiProperty({ description: 'Deal terms and conditions', required: false })
  @Column({ nullable: true, length: 1000 })
  dealTerms?: string;

  @ApiProperty({ description: 'Service creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Admin approval fields
  @ApiProperty({ description: 'Service approval status' })
  @Column({ default: false })
  isApproved: boolean;

  @ApiProperty({ description: 'Admin who approved/rejected the service', required: false })
  @Column({ nullable: true, type: 'uuid' })
  approvedByAdminId?: string;

  @ApiProperty({ description: 'Date when service was approved/rejected', required: false })
  @Column({ nullable: true })
  approvalDate?: Date;

  @ApiProperty({ description: 'Admin comments for approval/rejection', required: false })
  @Column({ nullable: true, type: 'text' })
  adminComments?: string;

  @ApiProperty({ description: 'Badge assigned by admin', required: false })
  @Column({ nullable: true, length: 100 })
  adminAssignedBadge?: string;

  @ApiProperty({ description: 'Service approval status', enum: ServiceStatus })
  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.PENDING_APPROVAL,
  })
  approvalStatus: ServiceStatus;

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

  @OneToMany(() => ServiceAvailabilitySettings, (settings) => settings.service)
  availabilitySettings: ServiceAvailabilitySettings[];

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
