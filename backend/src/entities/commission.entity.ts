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
import { Booking } from './booking.entity';
import { User } from './user.entity';

export enum CommissionStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export enum PayoutStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('commissions')
@Index(['providerId', 'payoutStatus'])
@Index(['bookingId'], { unique: true })
export class Commission {
  @ApiProperty({ description: 'Commission unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Associated booking ID' })
  @Column({ name: 'booking_id', type: 'uuid' })
  bookingId: string;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ApiProperty({ description: 'Total booking amount' })
  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({ description: 'Commission amount deducted' })
  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @ApiProperty({ description: 'Provider earning after commission' })
  @Column({ name: 'provider_earning', type: 'decimal', precision: 10, scale: 2 })
  providerEarning: number;

  @ApiProperty({ description: 'Commission rate percentage' })
  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number;

  @ApiProperty({ description: 'Commission processing status' })
  @Column({
    name: 'status',
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @ApiProperty({ description: 'Payout status' })
  @Column({
    name: 'payout_status',
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  payoutStatus: PayoutStatus;

  @ApiProperty({ description: 'Payout ID when paid' })
  @Column({ name: 'payout_id', type: 'uuid', nullable: true })
  payoutId?: string;

  @ApiProperty({ description: 'Commission processed timestamp' })
  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  @ApiProperty({ description: 'Payout completion timestamp' })
  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date;

  @ApiProperty({ description: 'Commission notes' })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ApiProperty({ description: 'Commission creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Commission last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}