import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { OAuthAccount } from './oauth-account.entity';
import { Provider } from './provider.entity';
import { Role } from './role.entity';
import { Booking } from './booking.entity';
// import { Review } from './review.entity';
import { Favorite } from './favorite.entity';
import { CartItem } from './cart-item.entity';
import { SupportTicket } from './support-ticket.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true, length: 255 })
  email: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'phone', nullable: true, length: 20 })
  phone?: string;

  @Column({ name: 'profile_picture', nullable: true, length: 500 })
  profilePicture?: string;

  @Column({ name: 'profile_picture_public_id', nullable: true, length: 255 })
  profilePicturePublicId?: string;

  @Column({ name: 'date_of_birth', nullable: true, type: 'date' })
  dateOfBirth?: Date;

  @Column({ name: 'address', nullable: true, type: 'text' })
  address?: string;

  @Column({ name: 'city', nullable: true, length: 100 })
  city?: string;

  @Column({ name: 'country', nullable: true, length: 100 })
  country?: string;

  @Column({ name: 'postal_code', nullable: true, length: 20 })
  postalCode?: string;

  @Column({ name: 'language', nullable: true, length: 5, default: 'en' })
  language: string;

  @Column({ name: 'timezone', nullable: true, length: 50 })
  timezone?: string;

  @Column({ name: 'role', nullable: true, length: 50, default: 'customer' })
  role: string;

  @Column({ name: 'status', nullable: true, length: 50, default: 'pending_verification' })
  status: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'is_two_factor_enabled', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', nullable: true, length: 255 })
  twoFactorSecret?: string;

  @Column({ name: 'email_verification_token', nullable: true, length: 255 })
  emailVerificationToken?: string;

  @Column({ name: 'password_reset_token', nullable: true, length: 255 })
  passwordResetToken?: string;

  @Column({ name: 'password_reset_expires', nullable: true, type: 'timestamp' })
  passwordResetExpires?: Date;

  @Column({ name: 'last_login_at', nullable: true, type: 'timestamp' })
  lastLoginAt?: Date;

  @Column({ name: 'gdpr_consent', default: false })
  gdprConsent: boolean;

  @Column({ name: 'marketing_consent', default: false })
  marketingConsent: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => OAuthAccount, (oauthAccount) => oauthAccount.user, { cascade: true })
  oauthAccounts: OAuthAccount[];

  @OneToOne(() => Provider, (provider) => provider.user)
  provider: Provider;

  // TODO: Add remaining relationships when entities are created
  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];

  // @OneToMany(() => Review, (review) => review.customer)
  // reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  supportTickets: SupportTicket[];

  // @OneToMany(() => CalendarAccount, (calendar) => calendar.user)
  // calendarAccounts: CalendarAccount[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user, { cascade: true })
  cartItems: CartItem[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user, { cascade: true })
  paymentMethods: PaymentMethod[];

  // Virtual properties
  @ApiProperty({ description: 'User full name' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty({ description: 'User initials' })
  get initials(): string {
    return `${this.firstName?.[0] || ''}${this.lastName?.[0] || ''}`.toUpperCase();
  }
}
