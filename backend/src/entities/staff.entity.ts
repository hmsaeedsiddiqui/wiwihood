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
import { Provider } from './provider.entity';
import { Service } from './service.entity';
import { Booking } from './booking.entity';
import { User } from './user.entity';

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

export enum StaffRole {
  STAFF = 'staff',
  SENIOR_STAFF = 'senior_staff',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
}

@Entity('staff')
@Index(['providerId'])
@Index(['userId'])
@Index(['status'])
@Index(['role'])
export class Staff {
  @ApiProperty({ description: 'Unique identifier for the staff member' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Staff member first name' })
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Staff member last name' })
  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Staff member email' })
  @Column({ name: 'email', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Staff member phone number' })
  @Column({ name: 'phone', length: 20, nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole })
  @Column({ name: 'role', type: 'enum', enum: StaffRole, default: StaffRole.STAFF })
  role: StaffRole;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus })
  @Column({ name: 'status', type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus;

  @ApiProperty({ description: 'Staff specialization/expertise' })
  @Column({ name: 'specialization', length: 500, nullable: true })
  specialization?: string;

  @ApiProperty({ description: 'Years of experience' })
  @Column({ name: 'experience_years', type: 'int', nullable: true })
  experienceYears?: number;

  @ApiProperty({ description: 'Staff bio/description' })
  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  @ApiProperty({ description: 'Profile image URL' })
  @Column({ name: 'profile_image', length: 500, nullable: true })
  profileImage?: string;

  @ApiProperty({ description: 'Hourly rate' })
  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @ApiProperty({ description: 'Commission percentage' })
  @Column({ name: 'commission_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionPercentage?: number;

  @ApiProperty({ description: 'Date hired' })
  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate?: Date;

  @ApiProperty({ description: 'Date terminated (if applicable)' })
  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate?: Date;

  @ApiProperty({ description: 'Emergency contact name' })
  @Column({ name: 'emergency_contact_name', length: 255, nullable: true })
  emergencyContactName?: string;

  @ApiProperty({ description: 'Emergency contact phone' })
  @Column({ name: 'emergency_contact_phone', length: 20, nullable: true })
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Notes about the staff member' })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Whether staff can be booked online' })
  @Column({ name: 'is_bookable', type: 'boolean', default: true })
  isBookable: boolean;

  @ApiProperty({ description: 'Whether staff shows in public listings' })
  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @ApiProperty({ description: 'Verification status for admin approval' })
  @Column({ 
    name: 'verification_status', 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  })
  verificationStatus: 'pending' | 'approved' | 'rejected';

  @ApiProperty({ description: 'Whether staff is verified by admin' })
  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Provider ID this staff belongs to' })
  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @ApiProperty({ description: 'User ID if staff has login access' })
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Provider, provider => provider.staff)
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Booking, booking => booking.staff)
  bookings: Booking[];

  // Virtual properties
  @ApiProperty({ description: 'Full name' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty({ description: 'Is currently available for bookings' })
  get isAvailable(): boolean {
    return this.status === StaffStatus.ACTIVE && this.isBookable;
  }
}