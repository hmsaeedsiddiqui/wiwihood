import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsUrl,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
} from 'class-validator';
import { ProviderType, ProviderStatus } from '../../../entities/provider.entity';

export class CreateProviderDto {
  @ApiProperty({
    description: 'Business/provider name',
    example: 'John\'s Plumbing Services',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  businessName: string;

  @ApiProperty({
    description: 'Provider type',
    enum: ProviderType,
    example: ProviderType.INDIVIDUAL,
  })
  @IsEnum(ProviderType)
  providerType: ProviderType;

  @ApiProperty({
    description: 'Business description',
    example: 'Professional plumbing services with 10+ years experience',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Main Street, Suite 100',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Business city',
    example: 'New York',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Business state/region',
    example: 'New York',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({
    description: 'Business country',
    example: 'United States',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({
    description: 'Business postal code',
    example: '10001',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({
    description: 'Business timezone',
    example: 'America/New_York',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiProperty({
    description: 'Business latitude for mapping',
    example: 40.7128,
    required: false,
  })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({
    description: 'Business longitude for mapping',
    example: -74.0060,
    required: false,
  })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'Business website URL',
    example: 'https://johnsplumbing.com',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @ApiProperty({
    description: 'Business license number',
    example: 'PL123456',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  licenseNumber?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: '12-3456789',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  taxId?: string;

  @ApiProperty({
    description: 'Business logo URL or Cloudinary public ID',
    example: 'https://example.com/logo.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @ApiProperty({
    description: 'Business logo Cloudinary public ID',
    example: 'providers/123/logo/abc123',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  logoPublicId?: string;

  @ApiProperty({
    description: 'Business cover image URL or Cloudinary public ID',
    example: 'https://example.com/cover.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @ApiProperty({
    description: 'Business cover image Cloudinary public ID',
    example: 'providers/123/cover/xyz789',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  coverImagePublicId?: string;

  @ApiProperty({
    description: 'Provider accepts online payments',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  acceptsOnlinePayments?: boolean;

  @ApiProperty({
    description: 'Provider accepts cash payments',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  acceptsCashPayments?: boolean;

  @ApiProperty({
    description: 'Provider requires deposit',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresDeposit?: boolean;

  @ApiProperty({
    description: 'Deposit percentage (0-100)',
    example: 25,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  depositPercentage?: number;

  @ApiProperty({
    description: 'Cancellation policy hours',
    example: 24,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationPolicyHours?: number;
}
