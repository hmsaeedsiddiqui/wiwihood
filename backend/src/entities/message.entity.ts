import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('messages')
@Index(['senderId'])
@Index(['receiverId'])
@Index(['conversationId'])
@Index(['isRead'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'uuid' })
  receiverId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  conversationId?: string; // To group messages in conversations

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  type: string; // text, booking, reminder, system

  @Column({ type: 'json', nullable: true })
  attachments?: any; // File attachments, booking details, etc.

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}