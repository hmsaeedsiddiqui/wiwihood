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
import { User } from './user.entity';
import { Provider } from './provider.entity';
import { Service } from './service.entity';
import { Booking } from './booking.entity';

export enum GiftCardStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  PARTIALLY_REDEEMED = 'partially_redeemed',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

export enum TransactionType {
  REDEMPTION = 'redemption',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
}

export enum PromotionType {
  BONUS = 'bonus',
  DISCOUNT = 'discount',
  BULK = 'bulk',
}

@Entity('gift_cards')
@Index(['code'], { unique: true })
@Index(['purchaserEmail'])
@Index(['recipientEmail'])
@Index(['status'])
@Index(['expiryDate'])
@Index(['providerId'])
@Index(['purchaseDate'])
export class GiftCard {
  @ApiProperty({ description: 'Unique identifier for the gift card' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unique gift card code' })
  @Column({ length: 20, unique: true })
  code: string;

  @ApiProperty({ description: 'Original gift card amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Current balance amount' })
  @Column({ name: 'current_balance', type: 'decimal', precision: 10, scale: 2 })
  currentBalance: number;

  @ApiProperty({ description: 'Currency code', default: 'USD' })
  @Column({ length: 3, default: 'USD' })
  currency: string;

  // Purchase Information
  @ApiProperty({ description: 'Purchaser email address' })
  @Column({ name: 'purchaser_email', length: 255 })
  purchaserEmail: string;

  @ApiProperty({ description: 'Purchaser name' })
  @Column({ name: 'purchaser_name', length: 255, nullable: true })
  purchaserName?: string;

  @ApiProperty({ description: 'Purchaser phone number' })
  @Column({ name: 'purchaser_phone', length: 20, nullable: true })
  purchaserPhone?: string;

  @ApiProperty({ description: 'Purchaser user ID if registered user' })
  @Column({ name: 'purchaser_id', nullable: true })
  purchaserId?: string;

  // Recipient Information
  @ApiProperty({ description: 'Recipient email address' })
  @Column({ name: 'recipient_email', length: 255 })
  recipientEmail: string;

  @ApiProperty({ description: 'Recipient name' })
  @Column({ name: 'recipient_name', length: 255, nullable: true })
  recipientName?: string;

  @ApiProperty({ description: 'Personal message for recipient' })
  @Column({ name: 'personal_message', type: 'text', nullable: true })
  personalMessage?: string;

  // Status and Lifecycle
  @ApiProperty({ description: 'Gift card status', enum: GiftCardStatus })
  @Column({
    type: 'varchar',
    length: 20,
    default: GiftCardStatus.ACTIVE,
  })
  status: GiftCardStatus;

  @ApiProperty({ description: 'Is physical gift card' })
  @Column({ name: 'is_physical', default: false })
  isPhysical: boolean;

  @ApiProperty({ description: 'Is transferable to other users' })
  @Column({ name: 'is_transferable', default: true })
  isTransferable: boolean;

  // Dates
  @ApiProperty({ description: 'Purchase date' })
  @CreateDateColumn({ name: 'purchase_date' })
  purchaseDate: Date;

  @ApiProperty({ description: 'Delivery date' })
  @Column({ name: 'delivery_date', type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @ApiProperty({ description: 'First redemption date' })
  @Column({ name: 'first_redemption_date', type: 'timestamp', nullable: true })
  firstRedemptionDate?: Date;

  @ApiProperty({ description: 'Last redemption date' })
  @Column({ name: 'last_redemption_date', type: 'timestamp', nullable: true })
  lastRedemptionDate?: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ name: 'expiry_date', type: 'timestamp' })
  expiryDate: Date;

  // Business Logic
  @ApiProperty({ description: 'Provider ID if gift card is for specific provider' })
  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  @ApiProperty({ description: 'Service ID if gift card is for specific service' })
  @Column({ name: 'service_id', nullable: true })
  serviceId?: string;

  @ApiProperty({ description: 'Minimum spend amount to use gift card' })
  @Column({ name: 'minimum_spend', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumSpend: number;

  @ApiProperty({ description: 'Maximum discount this gift card can provide' })
  @Column({ name: 'maximum_discount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscount?: number;

  // Payment Information
  @ApiProperty({ description: 'Payment gateway intent ID' })
  @Column({ name: 'payment_intent_id', length: 255, nullable: true })
  paymentIntentId?: string;

  @ApiProperty({ description: 'Payment status' })
  @Column({ name: 'payment_status', length: 20, default: 'pending' })
  paymentStatus: string;

  @ApiProperty({ description: 'Transaction fee amount' })
  @Column({ name: 'transaction_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  transactionFee: number;

  // Metadata
  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of admin/user who created this gift card' })
  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @ApiProperty({ description: 'Current owner ID if transferred' })
  @Column({ name: 'current_owner_id', nullable: true })
  currentOwnerId?: string;

  // Relations
  @ApiProperty({ description: 'User who purchased the gift card' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'purchaser_id' })
  purchaser?: User;

  @ApiProperty({ description: 'Current owner of the gift card' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'current_owner_id' })
  currentOwner?: User;

  @ApiProperty({ description: 'Provider if gift card is provider-specific' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider?: Provider;

  @ApiProperty({ description: 'Service if gift card is service-specific' })
  @ManyToOne(() => Service, { eager: false })
  @JoinColumn({ name: 'service_id' })
  service?: Service;

  @ApiProperty({ description: 'Gift card transaction history' })
  @OneToMany(() => GiftCardTransaction, (transaction) => transaction.giftCard)
  transactions: GiftCardTransaction[];
}

@Entity('gift_card_transactions')
@Index(['giftCardId'])
@Index(['transactionDate'])
@Index(['userId'])
@Index(['providerId'])
export class GiftCardTransaction {
  @ApiProperty({ description: 'Unique identifier for the transaction' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Gift card ID' })
  @Column({ name: 'gift_card_id' })
  giftCardId: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @Column({
    name: 'transaction_type',
    type: 'varchar',
    length: 20,
    default: TransactionType.REDEMPTION,
  })
  transactionType: TransactionType;

  @ApiProperty({ description: 'Transaction amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Balance before transaction' })
  @Column({ name: 'balance_before', type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @ApiProperty({ description: 'Balance after transaction' })
  @Column({ name: 'balance_after', type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  // Order/Service Information
  @ApiProperty({ description: 'Booking ID if used for service booking' })
  @Column({ name: 'booking_id', nullable: true })
  bookingId?: string;

  @ApiProperty({ description: 'Order ID if used for product purchase' })
  @Column({ name: 'order_id', nullable: true })
  orderId?: string;

  @ApiProperty({ description: 'Provider ID where gift card was redeemed' })
  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  // User Information
  @ApiProperty({ description: 'Email of person who redeemed' })
  @Column({ name: 'redeemed_by_email', length: 255, nullable: true })
  redeemedByEmail?: string;

  @ApiProperty({ description: 'User ID who performed transaction' })
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  // Location and Context
  @ApiProperty({ description: 'Location where redeemed' })
  @Column({ name: 'redemption_location', length: 255, nullable: true })
  redemptionLocation?: string;

  @ApiProperty({ description: 'IP address for security' })
  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent for security' })
  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'Transaction date' })
  @CreateDateColumn({ name: 'transaction_date' })
  transactionDate: Date;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Associated gift card' })
  @ManyToOne(() => GiftCard, (giftCard) => giftCard.transactions)
  @JoinColumn({ name: 'gift_card_id' })
  giftCard: GiftCard;

  @ApiProperty({ description: 'User who performed transaction' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ApiProperty({ description: 'Associated booking' })
  @ManyToOne(() => Booking, { eager: false })
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @ApiProperty({ description: 'Provider where redeemed' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider?: Provider;
}

@Entity('gift_card_promotions')
@Index(['isActive'])
@Index(['startDate', 'endDate'])
export class GiftCardPromotion {
  @ApiProperty({ description: 'Unique identifier for the promotion' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Promotion name' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Promotion description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Promotion type', enum: PromotionType })
  @Column({
    name: 'promotion_type',
    type: 'varchar',
    length: 20,
    default: PromotionType.BONUS,
  })
  promotionType: PromotionType;

  @ApiProperty({ description: 'Bonus percentage' })
  @Column({ name: 'bonus_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  bonusPercentage: number;

  @ApiProperty({ description: 'Fixed bonus amount' })
  @Column({ name: 'bonus_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonusAmount: number;

  @ApiProperty({ description: 'Minimum purchase to qualify' })
  @Column({ name: 'minimum_purchase', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumPurchase: number;

  @ApiProperty({ description: 'Promotion start date' })
  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @ApiProperty({ description: 'Promotion end date' })
  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @ApiProperty({ description: 'Is promotion active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Total usage limit' })
  @Column({ name: 'usage_limit', nullable: true })
  usageLimit?: number;

  @ApiProperty({ description: 'Current usage count' })
  @Column({ name: 'usage_count', default: 0 })
  usageCount: number;

  @ApiProperty({ description: 'Per customer limit' })
  @Column({ name: 'per_customer_limit', default: 1 })
  perCustomerLimit: number;

  @ApiProperty({ description: 'Customer email pattern for targeting' })
  @Column({ name: 'customer_email_pattern', length: 255, nullable: true })
  customerEmailPattern?: string;

  @ApiProperty({ description: 'Provider ID for provider-specific promotions' })
  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of admin who created this promotion' })
  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  // Relations
  @ApiProperty({ description: 'Provider for provider-specific promotions' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider?: Provider;
}

@Entity('gift_card_settings')
export class GiftCardSetting {
  @ApiProperty({ description: 'Unique identifier for the setting' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Setting key' })
  @Column({ name: 'setting_key', length: 100, unique: true })
  settingKey: string;

  @ApiProperty({ description: 'Setting value' })
  @Column({ name: 'setting_value', type: 'text' })
  settingValue: string;

  @ApiProperty({ description: 'Data type of the setting value' })
  @Column({ name: 'data_type', length: 20, default: 'string' })
  dataType: string;

  @ApiProperty({ description: 'Setting description' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Is setting accessible by frontend' })
  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of admin who updated this setting' })
  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;
}