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
import { User } from './user.entity';

export enum PaymentMethodType {
  CARD = 'card',
  BANK = 'bank',
  DIGITAL_WALLET = 'digital_wallet',
}

@Entity('payment_methods')
@Index(['userId'])
@Index(['isDefault'])
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Payment method ID' })
  id: string;

  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'User ID who owns this payment method' })
  userId: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: PaymentMethodType,
    default: PaymentMethodType.CARD,
  })
  @ApiProperty({ 
    description: 'Payment method type',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD
  })
  type: PaymentMethodType;

  @Column({ name: 'stripe_payment_method_id', nullable: true })
  @ApiProperty({ description: 'Stripe payment method ID', required: false })
  stripePaymentMethodId?: string;

  @Column({ name: 'last_four_digits', length: 4, nullable: true })
  @ApiProperty({ description: 'Last 4 digits of card/account', example: '4242', required: false })
  lastFourDigits?: string;

  @Column({ name: 'card_brand', length: 50, nullable: true })
  @ApiProperty({ description: 'Card brand (visa, mastercard, etc.)', example: 'visa', required: false })
  cardBrand?: string;

  @Column({ name: 'expiry_month', type: 'int', nullable: true })
  @ApiProperty({ description: 'Card expiry month', example: 12, required: false })
  expiryMonth?: number;

  @Column({ name: 'expiry_year', type: 'int', nullable: true })
  @ApiProperty({ description: 'Card expiry year', example: 2025, required: false })
  expiryYear?: number;

  @Column({ name: 'billing_name', length: 255, nullable: true })
  @ApiProperty({ description: 'Billing name on payment method', example: 'John Doe', required: false })
  billingName?: string;

  @Column({ name: 'billing_email', length: 255, nullable: true })
  @ApiProperty({ description: 'Billing email', example: 'john.doe@example.com', required: false })
  billingEmail?: string;

  @Column({ name: 'billing_address', type: 'text', nullable: true })
  @ApiProperty({ description: 'Billing address', required: false })
  billingAddress?: string;

  @Column({ name: 'billing_city', length: 100, nullable: true })
  @ApiProperty({ description: 'Billing city', example: 'New York', required: false })
  billingCity?: string;

  @Column({ name: 'billing_state', length: 100, nullable: true })
  @ApiProperty({ description: 'Billing state/province', example: 'NY', required: false })
  billingState?: string;

  @Column({ name: 'billing_postal_code', length: 20, nullable: true })
  @ApiProperty({ description: 'Billing postal code', example: '10001', required: false })
  billingPostalCode?: string;

  @Column({ name: 'billing_country', length: 2, nullable: true })
  @ApiProperty({ description: 'Billing country (ISO code)', example: 'US', required: false })
  billingCountry?: string;

  @Column({ name: 'is_default', default: false })
  @ApiProperty({ description: 'Whether this is the default payment method', example: false })
  isDefault: boolean;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: 'Whether this payment method is active', example: true })
  isActive: boolean;

  @Column({ name: 'nickname', length: 100, nullable: true })
  @ApiProperty({ description: 'User-friendly nickname for the payment method', example: 'My Visa Card', required: false })
  nickname?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'When the payment method was added' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'When the payment method was last updated' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.paymentMethods)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Virtual properties
  @ApiProperty({ description: 'Masked card/account number for display' })
  get maskedNumber(): string {
    if (this.lastFourDigits) {
      return `**** **** **** ${this.lastFourDigits}`;
    }
    return 'Payment Method';
  }

  @ApiProperty({ description: 'Display name for the payment method' })
  get displayName(): string {
    if (this.nickname) {
      return this.nickname;
    }
    if (this.cardBrand && this.lastFourDigits) {
      return `${this.cardBrand.toUpperCase()} ending in ${this.lastFourDigits}`;
    }
    return this.type.replace('_', ' ').toUpperCase();
  }

  @ApiProperty({ description: 'Whether the payment method is expired' })
  get isExpired(): boolean {
    if (!this.expiryMonth || !this.expiryYear) {
      return false;
    }
    const now = new Date();
    const expiry = new Date(this.expiryYear, this.expiryMonth - 1);
    return expiry < now;
  }
}