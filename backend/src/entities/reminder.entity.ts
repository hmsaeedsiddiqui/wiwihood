import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('reminders')
@Index(['userId'])
@Index(['bookingId'])
@Index(['scheduledAt'])
@Index(['isSent'])
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  bookingId?: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, default: 'booking' })
  type: string; // booking, appointment, payment, review, custom

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'boolean', default: false })
  isSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ type: 'varchar', length: 50, default: 'notification' })
  deliveryMethod: string; // notification, email, sms, all

  @Column({ type: 'json', nullable: true })
  data?: any; // Additional reminder data

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}