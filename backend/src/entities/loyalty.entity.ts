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

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum PointTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment',
}

@Entity('loyalty_accounts')
@Index(['userId'], { unique: true })
@Index(['tier'])
export class LoyaltyAccount {
  @ApiProperty({ description: 'Unique identifier for the loyalty account' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Current points balance' })
  @Column({ type: 'int', default: 0 })
  currentPoints: number;

  @ApiProperty({ description: 'Total points earned lifetime' })
  @Column({ type: 'int', default: 0 })
  totalPointsEarned: number;

  @ApiProperty({ description: 'Total points redeemed lifetime' })
  @Column({ type: 'int', default: 0 })
  totalPointsRedeemed: number;

  @ApiProperty({ description: 'Current loyalty tier', enum: LoyaltyTier })
  @Column({
    type: 'enum',
    enum: LoyaltyTier,
    default: LoyaltyTier.BRONZE,
  })
  tier: LoyaltyTier;

  @ApiProperty({ description: 'Points needed for next tier' })
  @Column({ type: 'int', default: 0 })
  pointsToNextTier: number;

  @ApiProperty({ description: 'Last tier upgrade date' })
  @Column({ type: 'timestamp', nullable: true })
  lastTierUpgrade?: Date;

  @ApiProperty({ description: 'Account creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'userId' })
  userId: string;

  @ApiProperty({ description: 'Associated user' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Point transactions history' })
  @OneToMany(() => PointTransaction, (transaction) => transaction.loyaltyAccount)
  transactions: PointTransaction[];
}

@Entity('point_transactions')
@Index(['loyaltyAccountId'])
@Index(['type'])
@Index(['createdAt'])
export class PointTransaction {
  @ApiProperty({ description: 'Unique identifier for the transaction' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Transaction type', enum: PointTransactionType })
  @Column({
    type: 'enum',
    enum: PointTransactionType,
  })
  type: PointTransactionType;

  @ApiProperty({ description: 'Points amount (positive for earned, negative for redeemed)' })
  @Column({ type: 'int' })
  points: number;

  @ApiProperty({ description: 'Balance after transaction' })
  @Column({ type: 'int' })
  balanceAfter: number;

  @ApiProperty({ description: 'Transaction description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Reference ID (booking, referral, etc.)' })
  @Column({ length: 255, nullable: true })
  referenceId?: string;

  @ApiProperty({ description: 'Reference type (booking, referral, review, etc.)' })
  @Column({ length: 100, nullable: true })
  referenceType?: string;

  @ApiProperty({ description: 'Points expiration date (for earned points)' })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ApiProperty({ description: 'Transaction date' })
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ApiProperty({ description: 'Loyalty account ID' })
  @Column({ name: 'loyaltyAccountId' })
  loyaltyAccountId: string;

  @ApiProperty({ description: 'Associated loyalty account' })
  @ManyToOne(() => LoyaltyAccount, (account) => account.transactions)
  @JoinColumn({ name: 'loyaltyAccountId' })
  loyaltyAccount: LoyaltyAccount;
}

@Entity('loyalty_rewards')
@Index(['minimumTier'])
@Index(['isActive'])
export class LoyaltyReward {
  @ApiProperty({ description: 'Unique identifier for the reward' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Reward name' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Reward description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Points required to redeem' })
  @Column({ name: 'points_required', type: 'int' })
  pointsRequired: number;

  @ApiProperty({ description: 'Reward type' })
  @Column({ name: 'reward_type', default: 'discount' })
  rewardType: string;

  @ApiProperty({ description: 'Reward value' })
  @Column({ name: 'reward_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  rewardValue: number;

  @ApiProperty({ description: 'Minimum tier required', enum: LoyaltyTier })
  @Column({
    name: 'tier_required',
    type: 'varchar',
    default: 'bronze',
  })
  minimumTier: string;

  @ApiProperty({ description: 'Is reward currently active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Reward creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}