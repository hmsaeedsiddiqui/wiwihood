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
import { Payment } from './payment.entity';

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum RefundReason {
  CUSTOMER_REQUEST = 'customer_request',
  PROVIDER_CANCELLATION = 'provider_cancellation',
  SERVICE_ISSUE = 'service_issue',
  NO_SHOW = 'no_show',
  TECHNICAL_ISSUE = 'technical_issue',
  DISPUTE = 'dispute',
  OTHER = 'other',
}

@Entity('refunds')
@Index(['paymentId'])
@Index(['status'])
@Index(['reason'])
export class Refund {
  @ApiProperty({ description: 'Unique identifier for the refund' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Refund amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({ length: 3, default: 'EUR' })
  currency: string;

  @ApiProperty({ description: 'Refund status', enum: RefundStatus })
  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status: RefundStatus;

  @ApiProperty({ description: 'Refund reason', enum: RefundReason })
  @Column({
    type: 'enum',
    enum: RefundReason,
    default: RefundReason.CUSTOMER_REQUEST,
  })
  reason: RefundReason;

  @ApiProperty({ description: 'Detailed refund reason', required: false })
  @Column({ nullable: true, type: 'text' })
  reasonDetails?: string;

  @ApiProperty({ description: 'Stripe refund ID', required: false })
  @Column({ nullable: true, length: 255 })
  stripeRefundId?: string;

  @ApiProperty({ description: 'Payment gateway transaction ID', required: false })
  @Column({ nullable: true, length: 255 })
  transactionId?: string;

  @ApiProperty({ description: 'Gateway response', required: false })
  @Column({ nullable: true, type: 'json' })
  gatewayResponse?: any;

  @ApiProperty({ description: 'Processing fee refunded', required: false })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  processingFeeRefunded?: number;

  @ApiProperty({ description: 'Refund failure reason', required: false })
  @Column({ nullable: true, type: 'text' })
  failureReason?: string;

  @ApiProperty({ description: 'Admin notes', required: false })
  @Column({ nullable: true, type: 'text' })
  adminNotes?: string;

  @ApiProperty({ description: 'Refund processed timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  processedAt?: Date;

  @ApiProperty({ description: 'Refund failed timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  failedAt?: Date;

  @ApiProperty({ description: 'Refund creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Payment ID' })
  @Column({ type: 'uuid' })
  paymentId: string;

  // Relationships
  @ManyToOne(() => Payment, (payment) => payment.refunds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;
}
