import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './provider.entity';
import { Service } from './service.entity';
import { PromotionUsage } from './promotion-usage.entity';

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
  FREE_SERVICE = 'free_service',
}

export enum PromotionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled',
}

@Entity('promotions')
@Index(['code'], { unique: true })
@Index(['status'])
@Index(['startDate'])
@Index(['endDate'])
@Index(['providerId'])
export class Promotion {
  @ApiProperty({ description: 'Unique identifier for the promotion' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Promotion name' })
  @Column({ name: 'name', length: 255 })
  name: string;

  @ApiProperty({ description: 'Promotion description' })
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Promotion code for users to enter' })
  @Column({ name: 'code', length: 50, unique: true })
  code: string;

  @ApiProperty({ description: 'Type of promotion', enum: PromotionType })
  @Column({ name: 'type', type: 'enum', enum: PromotionType })
  type: PromotionType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue?: number;

  @ApiProperty({ description: 'Maximum discount amount for percentage discounts' })
  @Column({ name: 'max_discount_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Minimum order amount required' })
  @Column({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount?: number;

  @ApiProperty({ description: 'Promotion status', enum: PromotionStatus })
  @Column({ name: 'status', type: 'enum', enum: PromotionStatus, default: PromotionStatus.ACTIVE })
  status: PromotionStatus;

  @ApiProperty({ description: 'Start date of the promotion' })
  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @ApiProperty({ description: 'End date of the promotion' })
  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @ApiProperty({ description: 'Maximum number of times this promotion can be used' })
  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit?: number;

  @ApiProperty({ description: 'Maximum uses per customer' })
  @Column({ name: 'usage_limit_per_customer', type: 'int', nullable: true })
  usageLimitPerCustomer?: number;

  @ApiProperty({ description: 'Current usage count' })
  @Column({ name: 'usage_count', type: 'int', default: 0 })
  usageCount: number;

  @ApiProperty({ description: 'Whether the promotion is stackable with others' })
  @Column({ name: 'is_stackable', type: 'boolean', default: false })
  isStackable: boolean;

  @ApiProperty({ description: 'Priority for applying multiple promotions' })
  @Column({ name: 'priority', type: 'int', default: 0 })
  priority: number;

  @ApiProperty({ description: 'Applicable to all services or specific ones' })
  @Column({ name: 'applies_to_all_services', type: 'boolean', default: true })
  appliesToAllServices: boolean;

  @ApiProperty({ description: 'Applicable to new customers only' })
  @Column({ name: 'new_customers_only', type: 'boolean', default: false })
  newCustomersOnly: boolean;

  @ApiProperty({ description: 'Provider ID (null for platform-wide promotions)' })
  @Column({ name: 'provider_id', type: 'uuid', nullable: true })
  providerId?: string;

  @ApiProperty({ description: 'Promotion banner image URL' })
  @Column({ name: 'banner_image', length: 500, nullable: true })
  bannerImage?: string;

  @ApiProperty({ description: 'Terms and conditions' })
  @Column({ name: 'terms_and_conditions', type: 'text', nullable: true })
  termsAndConditions?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Provider, provider => provider.promotions, { nullable: true })
  @JoinColumn({ name: 'provider_id' })
  provider?: Provider;

  @OneToMany(() => PromotionUsage, usage => usage.promotion)
  usages: PromotionUsage[];
}