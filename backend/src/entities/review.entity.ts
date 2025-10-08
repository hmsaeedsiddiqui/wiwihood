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
import { Booking } from './booking.entity';
import { Provider } from './provider.entity';

@Entity('reviews')
@Index(['customerId'])
@Index(['providerId'])
@Index(['bookingId'], { unique: true })
@Index(['rating'])
export class Review {
  @ApiProperty({ description: 'Unique identifier for the review' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Review rating (1-5)' })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ description: 'Review title', required: false })
  @Column({ nullable: true, length: 200 })
  title?: string;

  @ApiProperty({ description: 'Review comment', required: false })
  @Column({ nullable: true, type: 'text' })
  comment?: string;

  @ApiProperty({ description: 'Review is published publicly' })
  @Column({ default: true })
  isPublished: boolean;

  @ApiProperty({ description: 'Review is verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Provider response to review', required: false })
  @Column({ nullable: true, type: 'text' })
  providerResponse?: string;

  @ApiProperty({ description: 'Provider response timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  providerResponseAt?: Date;

  @ApiProperty({ description: 'Review creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Customer user ID' })
  @Column({ type: 'uuid' })
  customerId: string;

  @ApiProperty({ description: 'Provider ID' })
  @Column({ type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'Booking ID' })
  @Column({ type: 'uuid' })
  bookingId: string;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
