import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('google_calendar_tokens')
export class GoogleCalendarToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'bigint', nullable: true })
  expiryDate: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scope: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  calendarId: string;

  @Column({ type: 'boolean', default: true })
  syncEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  twoWaySync: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tokenType: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}