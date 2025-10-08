import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './provider.entity';

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payouts')
export class Payout {
  @ApiProperty({ description: 'Payout unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @ManyToOne(() => Provider, provider => provider.payouts, { nullable: false })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ApiProperty({ description: 'Payout amount' })
  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Payout status' })
  @Column({ 
    name: 'status',
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING
  })
  status: PayoutStatus;

  @ApiProperty({ description: 'Payment processor transaction ID' })
  @Column({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true })
  transactionId?: string;

  @ApiProperty({ description: 'Payout method' })
  @Column({ name: 'payout_method', type: 'varchar', length: 255, nullable: true })
  payoutMethod?: string;

  @ApiProperty({ description: 'Payout scheduled timestamp' })
  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt?: Date;

  @ApiProperty({ description: 'Payout processed timestamp' })
  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  @ApiProperty({ description: 'Payout failure reason' })
  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason?: string;

  @ApiProperty({ description: 'Admin notes' })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Payout creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Payout last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
