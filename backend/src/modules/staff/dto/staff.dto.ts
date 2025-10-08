import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsEnum, IsUUID, Min, Max, IsIn } from 'class-validator';
import { StaffStatus, StaffRole } from '../../../entities/staff.entity';

export class CreateStaffDto {
  @ApiProperty({ 
    description: 'Staff first name', 
    example: 'Sarah' 
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Staff last name', 
    example: 'Johnson' 
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Staff email address', 
    example: 'sarah.johnson@example.com' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Staff phone number', 
    example: '+1234567890',
    required: false 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    description: 'Staff role', 
    enum: StaffRole, 
    example: StaffRole.SENIOR_STAFF,
    examples: {
      staff: { value: 'staff', description: 'Regular staff member' },
      senior_staff: { value: 'senior_staff', description: 'Senior staff with more experience' },
      supervisor: { value: 'supervisor', description: 'Team supervisor' },
      manager: { value: 'manager', description: 'Department manager' }
    },
    required: false 
  })
  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;

  @ApiProperty({ 
    description: 'Staff specialization', 
    example: 'Hair Styling & Color, Extensions',
    required: false 
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ 
    description: 'Years of experience', 
    example: 5,
    minimum: 0,
    maximum: 50,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experienceYears?: number;

  @ApiProperty({ 
    description: 'Staff bio/description', 
    example: 'Experienced hairstylist specializing in modern cuts and color techniques. Certified in advanced coloring methods.',
    required: false 
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    description: 'Profile image URL or Cloudinary public ID', 
    example: 'staff/profile_images/sarah_johnson_abc123',
    required: false 
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ 
    description: 'Verification status for admin approval', 
    example: 'pending',
    enum: ['pending', 'approved', 'rejected'],
    required: false 
  })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  verificationStatus?: 'pending' | 'approved' | 'rejected';

  @ApiProperty({ 
    description: 'Whether staff is verified by admin', 
    example: false,
    default: false,
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ 
    description: 'Hourly rate', 
    example: 45.00,
    minimum: 0,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ 
    description: 'Commission percentage', 
    example: 15.5,
    minimum: 0,
    maximum: 100,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage?: number;

  @ApiProperty({ 
    description: 'Whether staff can be booked online', 
    example: true,
    default: true,
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;

  @ApiProperty({ 
    description: 'Whether staff shows in public listings', 
    example: true,
    default: true,
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ 
    description: 'Provider ID', 
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiProperty({ 
    description: 'User ID for login access', 
    example: '650e8400-e29b-41d4-a716-446655440001',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class UpdateStaffDto {
  @ApiProperty({ description: 'Staff first name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Staff last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Staff email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Staff phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole, required: false })
  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus, required: false })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({ description: 'Staff specialization', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ description: 'Years of experience', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experienceYears?: number;

  @ApiProperty({ description: 'Staff bio/description', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ description: 'Hourly rate', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ description: 'Commission percentage', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage?: number;

  @ApiProperty({ description: 'Whether staff can be booked online', required: false })
  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;

  @ApiProperty({ description: 'Whether staff shows in public listings', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class StaffResponseDto {
  @ApiProperty({ description: 'Staff ID' })
  id: string;

  @ApiProperty({ description: 'Staff first name' })
  firstName: string;

  @ApiProperty({ description: 'Staff last name' })
  lastName: string;

  @ApiProperty({ description: 'Staff full name' })
  fullName: string;

  @ApiProperty({ description: 'Staff email' })
  email: string;

  @ApiProperty({ description: 'Staff phone' })
  phone?: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole })
  role: StaffRole;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus })
  status: StaffStatus;

  @ApiProperty({ description: 'Staff specialization' })
  specialization?: string;

  @ApiProperty({ description: 'Years of experience' })
  experienceYears?: number;

  @ApiProperty({ description: 'Staff bio' })
  bio?: string;

  @ApiProperty({ description: 'Profile image URL' })
  profileImage?: string;

  @ApiProperty({ description: 'Hourly rate' })
  hourlyRate?: number;

  @ApiProperty({ description: 'Commission percentage' })
  commissionPercentage?: number;

  @ApiProperty({ description: 'Whether staff can be booked' })
  isBookable: boolean;

  @ApiProperty({ description: 'Whether staff is public' })
  isPublic: boolean;

  @ApiProperty({ description: 'Whether staff is available' })
  isAvailable: boolean;

  @ApiProperty({ description: 'Verification status' })
  verificationStatus: 'pending' | 'approved' | 'rejected';

  @ApiProperty({ description: 'Whether staff is verified by admin' })
  isVerified: boolean;

  @ApiProperty({ description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ description: 'Provider name' })
  providerName?: string;

  @ApiProperty({ description: 'User ID' })
  userId?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}