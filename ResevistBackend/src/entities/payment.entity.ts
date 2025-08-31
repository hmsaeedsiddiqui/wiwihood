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
import { Booking } from './booking.entity';
import { Refund } from './refund.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

export enum PaymentType {
  FULL_PAYMENT = 'full_payment',
  DEPOSIT = 'deposit',
  REMAINING_BALANCE = 'remaining_balance',
}

@Entity('payments')
@Index(['bookingId'], { unique: true })
@Index(['status'])
@Index(['paymentMethod'])
@Index(['stripePaymentIntentId'])
export class Payment {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Payment amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({ length: 3, default: 'EUR' })
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.STRIPE,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Payment type', enum: PaymentType })
  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.FULL_PAYMENT,
  })
  paymentType: PaymentType;

  @ApiProperty({ description: 'Stripe Payment Intent ID', required: false })
  @Column({ nullable: true, length: 255 })
  stripePaymentIntentId?: string;

  @ApiProperty({ description: 'Stripe Charge ID', required: false })
  @Column({ nullable: true, length: 255 })
  stripeChargeId?: string;

  @ApiProperty({ description: 'Payment gateway transaction ID', required: false })
  @Column({ nullable: true, length: 255 })
  transactionId?: string;

  @ApiProperty({ description: 'Payment gateway response', required: false })
  @Column({ nullable: true, type: 'json' })
  gatewayResponse?: any;

  @ApiProperty({ description: 'Payment processing fee', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  processingFee?: number;

  @ApiProperty({ description: 'Platform commission amount', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  platformCommission?: number;

  @ApiProperty({ description: 'Provider payout amount', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  providerAmount?: number;

  @ApiProperty({ description: 'Payment failure reason', required: false })
  @Column({ nullable: true, type: 'text' })
  failureReason?: string;

  @ApiProperty({ description: 'Payment notes', required: false })
  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @ApiProperty({ description: 'Payment processed timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  processedAt?: Date;

  @ApiProperty({ description: 'Payment failed timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  failedAt?: Date;

  @ApiProperty({ description: 'Payment creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Booking ID' })
  @Column({ type: 'uuid' })
  bookingId: string;

  // Relationships
  @OneToOne(() => Booking, (booking) => booking.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];

  // Virtual properties
  @ApiProperty({ description: 'Total refunded amount' })
  get totalRefundedAmount(): number {
    return this.refunds?.reduce((sum, refund) => sum + Number(refund.amount), 0) || 0;
  }

  @ApiProperty({ description: 'Remaining refundable amount' })
  get refundableAmount(): number {
    return Number(this.amount) - this.totalRefundedAmount;
  }

  @ApiProperty({ description: 'Is payment refundable' })
  get isRefundable(): boolean {
    return [PaymentStatus.COMPLETED].includes(this.status) && 
           this.refundableAmount > 0;
  }
}
