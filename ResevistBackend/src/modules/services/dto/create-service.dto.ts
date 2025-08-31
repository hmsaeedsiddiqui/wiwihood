import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
  Max,
  IsIn,
  Length,
  IsPositive,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service name',
    example: 'Hair Cut and Style',
  })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Service description',
    example: 'Professional hair cutting and styling service',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Short service description for listings',
    example: 'Hair cut and styling',
  })
  @IsString()
  @Length(1, 500)
  shortDescription: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'uuid-string',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Service type',
    enum: ['appointment', 'package', 'consultation'],
    example: 'appointment',
    required: false,
  })
  @IsOptional()
  @IsIn(['appointment', 'package', 'consultation'])
  serviceType?: string;

  @ApiProperty({
    description: 'Pricing type',
    enum: ['fixed', 'hourly', 'variable'],
    example: 'fixed',
    required: false,
  })
  @IsOptional()
  @IsIn(['fixed', 'hourly', 'variable'])
  pricingType?: string;

  @ApiProperty({
    description: 'Service base price',
    example: 50.00,
  })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'EUR',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiProperty({
    description: 'Service duration in minutes',
    example: 60,
  })
  @IsNumber()
  @Min(1)
  @Max(1440) // Max 24 hours
  durationMinutes: number;

  @ApiProperty({
    description: 'Buffer time after service in minutes',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(480) // Max 8 hours
  bufferTimeMinutes?: number;

  @ApiProperty({
    description: 'Maximum advance booking days',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  maxAdvanceBookingDays?: number;

  @ApiProperty({
    description: 'Minimum advance booking hours',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(168) // Max 1 week
  minAdvanceBookingHours?: number;

  @ApiProperty({
    description: 'Maximum cancellation hours before service',
    example: 24,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(168) // Max 1 week
  cancellationPolicyHours?: number;

  @ApiProperty({
    description: 'Service requires deposit',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresDeposit?: boolean;

  @ApiProperty({
    description: 'Deposit amount',
    example: 10.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiProperty({
    description: 'Service image URLs',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Service tags for search',
    example: ['haircut', 'styling', 'professional'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Service preparation instructions',
    example: 'Please arrive with clean hair',
    required: false,
  })
  @IsOptional()
  @IsString()
  preparationInstructions?: string;

  @ApiProperty({
    description: 'Service is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Service status',
    enum: ['active', 'inactive', 'draft'],
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'draft'])
  status?: string;
}
