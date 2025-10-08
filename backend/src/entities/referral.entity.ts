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

export enum ReferralStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum ReferralRewardType {
  POINTS = 'points',
  DISCOUNT = 'discount',
  CASH = 'cash',
  FREE_SERVICE = 'free_service',
}

@Entity('referral_codes')
@Index(['code'], { unique: true })
@Index(['userId'])
@Index(['isActive'])
export class ReferralCode {
  @ApiProperty({ 
    description: 'Unique identifier for the referral code',
    example: '550e8400-e29b-41d4-a716-446655440010'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unique referral code' })
  @Column({ length: 20, unique: true })
  code: string;

  @ApiProperty({ description: 'Total uses of this code' })
  @Column({ type: 'int', default: 0 })
  totalUses: number;

  @ApiProperty({ description: 'Maximum allowed uses (null for unlimited)' })
  @Column({ type: 'int', nullable: true })
  maxUses?: number;

  @ApiProperty({ description: 'Is code currently active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Code expiration date' })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ApiProperty({ description: 'Code creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ 
    description: 'User ID who owns this referral code',
    example: '550e8400-e29b-41d4-a716-446655440011'
  })
  @Column({ name: 'userId' })
  userId: string;

  @ApiProperty({ description: 'User who owns this referral code' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Referrals made with this code' })
  @OneToMany(() => Referral, (referral) => referral.referralCode)
  referrals: Referral[];
}

@Entity('referrals')
@Index(['referrerId'])
@Index(['refereeId'])
@Index(['status'])
@Index(['createdAt'])
export class Referral {
  @ApiProperty({ 
    description: 'Unique identifier for the referral',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Referral status', enum: ReferralStatus })
  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status: ReferralStatus;

  @ApiProperty({ description: 'Date when referral was completed' })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ description: 'Reward given to referrer' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  referrerReward?: number;

  @ApiProperty({ description: 'Reward given to referee' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refereeReward?: number;

  @ApiProperty({ description: 'Referrer reward type', enum: ReferralRewardType })
  @Column({
    type: 'enum',
    enum: ReferralRewardType,
    nullable: true,
  })
  referrerRewardType?: ReferralRewardType;

  @ApiProperty({ description: 'Referee reward type', enum: ReferralRewardType })
  @Column({
    type: 'enum',
    enum: ReferralRewardType,
    nullable: true,
  })
  refereeRewardType?: ReferralRewardType;

  @ApiProperty({ 
    description: 'First booking ID that completed the referral',
    example: '550e8400-e29b-41d4-a716-446655440004'
  })
  @Column({ name: 'completingBookingId', nullable: true })
  completingBookingId?: string;

  @ApiProperty({ description: 'Referral creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ 
    description: 'ID of user who made the referral',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @Column({ name: 'referrerId' })
  referrerId: string;

  @ApiProperty({ description: 'User who made the referral' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @ApiProperty({ 
    description: 'ID of user who was referred',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  @Column({ name: 'refereeId' })
  refereeId: string;

  @ApiProperty({ description: 'User who was referred' })
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'refereeId' })
  referee: User;

  @ApiProperty({ 
    description: 'Referral code used',
    example: '550e8400-e29b-41d4-a716-446655440003'
  })
  @Column({ name: 'referralCodeId' })
  referralCodeId: string;

  @ApiProperty({ description: 'Associated referral code' })
  @ManyToOne(() => ReferralCode, (code) => code.referrals)
  @JoinColumn({ name: 'referralCodeId' })
  referralCode: ReferralCode;
}

@Entity('referral_campaigns')
@Index(['isActive'])
@Index(['startDate'])
@Index(['endDate'])
export class ReferralCampaign {
  @ApiProperty({ description: 'Unique identifier for the campaign' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Campaign name' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Campaign description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Referrer reward amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  referrerRewardAmount: number;

  @ApiProperty({ description: 'Referee reward amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  refereeRewardAmount: number;

  @ApiProperty({ description: 'Referrer reward type', enum: ReferralRewardType })
  @Column({
    type: 'enum',
    enum: ReferralRewardType,
  })
  referrerRewardType: ReferralRewardType;

  @ApiProperty({ description: 'Referee reward type', enum: ReferralRewardType })
  @Column({
    type: 'enum',
    enum: ReferralRewardType,
  })
  refereeRewardType: ReferralRewardType;

  @ApiProperty({ description: 'Campaign start date' })
  @Column({ type: 'timestamp' })
  startDate: Date;

  @ApiProperty({ description: 'Campaign end date' })
  @Column({ type: 'timestamp' })
  endDate: Date;

  @ApiProperty({ description: 'Is campaign currently active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Maximum referrals per user' })
  @Column({ type: 'int', nullable: true })
  maxReferralsPerUser?: number;

  @ApiProperty({ description: 'Campaign creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;
}