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

export enum GiftCardStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('gift_cards')
@Index(['code'], { unique: true })
@Index(['purchaserId'])
@Index(['recipientId'])
@Index(['status'])
export class GiftCard {
  @ApiProperty({ description: 'Unique identifier for the gift card' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unique gift card code' })
  @Column({ length: 20, unique: true })
  code: string;

  @ApiProperty({ description: 'Original gift card amount' })
  @Column({ name: 'original_amount', type: 'decimal', precision: 10, scale: 2 })
  originalAmount: number;

  @ApiProperty({ description: 'Current balance amount' })
  @Column({ name: 'current_balance', type: 'decimal', precision: 10, scale: 2 })
  currentBalance: number;

  @ApiProperty({ description: 'Currency code', default: 'USD' })
  @Column({ length: 3, default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Gift card status', enum: GiftCardStatus })
  @Column({
    type: 'enum',
    enum: GiftCardStatus,
    default: GiftCardStatus.ACTIVE,
  })
  status: GiftCardStatus;

  @ApiProperty({ description: 'Gift card message' })
  @Column({ type: 'text', nullable: true })
  message?: string;

  @ApiProperty({ description: 'Recipient name' })
  @Column({ name: 'recipient_name', length: 255, nullable: true })
  recipientName?: string;

  @ApiProperty({ description: 'Recipient email' })
  @Column({ name: 'recipient_email', length: 255, nullable: true })
  recipientEmail?: string;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ApiProperty({ description: 'Date when gift card was redeemed' })
  @Column({ name: 'redeemed_at', type: 'timestamp', nullable: true })
  redeemedAt?: Date;

  @ApiProperty({ description: 'Purchase date' })
  @CreateDateColumn({ name: 'purchased_at' })
  purchasedAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'ID of the user who purchased the gift card' })
  @Column({ name: 'purchaser_id' })
  purchaserId: string;

  @ApiProperty({ description: 'User who purchased the gift card' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'purchaser_id' })
  purchaser: User;

  @ApiProperty({ description: 'ID of the user who received the gift card' })
  @Column({ name: 'recipient_id', nullable: true })
  recipientId?: string;

  @ApiProperty({ description: 'User who received the gift card' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'recipient_id' })
  recipient?: User;

  @ApiProperty({ description: 'Gift card usage history' })
  @OneToMany(() => GiftCardUsage, (usage) => usage.giftCard)
  usageHistory: GiftCardUsage[];
}

@Entity('gift_card_usage')
@Index(['giftCardId'])
@Index(['usedInBookingId'])
export class GiftCardUsage {
  @ApiProperty({ description: 'Unique identifier for the usage record' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Amount used from gift card' })
  @Column({ name: 'amount_used', type: 'decimal', precision: 10, scale: 2 })
  amountUsed: number;

  @ApiProperty({ description: 'Remaining balance after usage' })
  @Column({ name: 'remaining_balance', type: 'decimal', precision: 10, scale: 2 })
  remainingBalance: number;

  @ApiProperty({ description: 'Date when gift card was used' })
  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;

  @ApiProperty({ description: 'Booking ID where gift card was used' })
  @Column({ name: 'used_in_booking_id', nullable: true })
  usedInBookingId?: string;

  @ApiProperty({ description: 'Description of usage' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relations
  @ApiProperty({ description: 'Gift card ID' })
  @Column({ name: 'gift_card_id' })
  giftCardId: string;

  @ApiProperty({ description: 'Associated gift card' })
  @ManyToOne(() => GiftCard, (giftCard) => giftCard.usageHistory)
  @JoinColumn({ name: 'gift_card_id' })
  giftCard: GiftCard;
}