import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('promotion_usages')
@Index(['promotionId'])
@Index(['userId'])
@Index(['bookingId'])
@Index(['usedAt'])
export class PromotionUsage {
  @ApiProperty({ description: 'Unique identifier for the promotion usage' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Promotion ID' })
  @Column({ name: 'promotion_id', type: 'uuid' })
  promotionId: string;

  @ApiProperty({ description: 'User ID who used the promotion' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Booking ID where promotion was applied' })
  @Column({ name: 'booking_id', type: 'uuid' })
  bookingId: string;

  @ApiProperty({ description: 'Discount amount applied' })
  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @ApiProperty({ description: 'Original amount before discount' })
  @Column({ name: 'original_amount', type: 'decimal', precision: 10, scale: 2 })
  originalAmount: number;

  @ApiProperty({ description: 'Final amount after discount' })
  @Column({ name: 'final_amount', type: 'decimal', precision: 10, scale: 2 })
  finalAmount: number;

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;

  // Relations
  @ManyToOne(() => Promotion, promotion => promotion.usages)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}