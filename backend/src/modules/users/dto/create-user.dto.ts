import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: 'customer',
  })
  @IsIn(['customer', 'provider', 'admin'])
  role: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended', 'pending_verification'])
  status?: string;

  @ApiProperty({
    description: 'User profile picture URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePicture?: string;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'Phone verification status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;
}
