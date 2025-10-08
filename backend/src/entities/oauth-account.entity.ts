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

export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Entity('oauth_accounts')
@Index(['provider', 'providerId'], { unique: true })
@Index(['userId'])
export class OAuthAccount {
  @ApiProperty({ description: 'Unique identifier for the OAuth account' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'OAuth provider', enum: OAuthProvider })
  @Column({
    type: 'enum',
    enum: OAuthProvider,
  })
  provider: OAuthProvider;

  @ApiProperty({ description: 'Provider-specific user ID' })
  @Column({ length: 255 })
  providerId: string;

  @ApiProperty({ description: 'User email from OAuth provider' })
  @Column({ length: 255 })
  email: string;

  @ApiProperty({ description: 'User name from OAuth provider', required: false })
  @Column({ nullable: true, length: 255 })
  name?: string;

  @ApiProperty({ description: 'Profile picture URL from OAuth provider', required: false })
  @Column({ nullable: true, length: 500 })
  picture?: string;

  @ApiProperty({ description: 'OAuth access token', required: false })
  @Column({ nullable: true, type: 'text' })
  accessToken?: string;

  @ApiProperty({ description: 'OAuth refresh token', required: false })
  @Column({ nullable: true, type: 'text' })
  refreshToken?: string;

  @ApiProperty({ description: 'Token expiry timestamp', required: false })
  @Column({ nullable: true, type: 'timestamp' })
  tokenExpiry?: Date;

  @ApiProperty({ description: 'Account creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({ description: 'Associated user ID' })
  @Column({ type: 'uuid' })
  userId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.oauthAccounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
