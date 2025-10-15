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
  IsUrl,
  IsDateString,
  IsDecimal,
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

  // Frontend Display Fields
  
  @ApiProperty({
    description: 'Service location/address (for display in cards)',
    example: 'AWR Properties, Al Mankhood',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  displayLocation?: string;

  @ApiProperty({
    description: 'Service provider business name (for display)',
    example: 'Lumi Nail Studio',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  providerBusinessName?: string;

  @ApiProperty({
    description: 'Service highlight/badge text',
    example: 'New on vividhood',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  highlightBadge?: string;

  @ApiProperty({
    description: 'Service feature image URL (main display image)',
    example: 'https://example.com/main-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiProperty({
    description: 'Available time slots for quick booking',
    example: ['10:00 AM', '2:00 PM', '5:00 PM'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableSlots?: string[];

  @ApiProperty({
    description: 'Service promotion text',
    example: '20% off first booking',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  promotionText?: string;

  @ApiProperty({
    description: 'Is this service featured/highlighted',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Service difficulty level',
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'intermediate',
    required: false,
  })
  @IsOptional()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  difficultyLevel?: string;

  @ApiProperty({
    description: 'Special requirements or notes',
    example: 'Please arrive 15 minutes early',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  specialRequirements?: string;

  @ApiProperty({
    description: 'Service includes (what is provided)',
    example: ['Hair wash', 'Blow dry', 'Styling'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];

  @ApiProperty({
    description: 'Service excludes (what is not provided)',
    example: ['Hair products for home use'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludes?: string[];

  @ApiProperty({
    description: 'Age restrictions',
    example: '18+',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  ageRestriction?: string;

  @ApiProperty({
    description: 'Gender preference for service',
    enum: ['any', 'male', 'female'],
    example: 'any',
    required: false,
  })
  @IsOptional()
  @IsIn(['any', 'male', 'female'])
  genderPreference?: string;

  // Deals and Promotions Fields
  
  @ApiProperty({
    description: 'Is this service part of a promotional deal',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPromotional?: boolean;

  @ApiProperty({
    description: 'Discount percentage for promotional deals',
    example: '25% OFF',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  discountPercentage?: string;

  @ApiProperty({
    description: 'Promotional code for the deal',
    example: 'FIRST25',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  promoCode?: string;

  @ApiProperty({
    description: 'Deal validity end date',
    example: '2024-10-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dealValidUntil?: string;

  @ApiProperty({
    description: 'Deal category/type',
    example: 'New Customer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  dealCategory?: string;

  @ApiProperty({
    description: 'Deal title (different from service name)',
    example: 'First Visit Special',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  dealTitle?: string;

  @ApiProperty({
    description: 'Deal specific description',
    example: '25% OFF on your first appointment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  dealDescription?: string;

  @ApiProperty({
    description: 'Original price before discount',
    example: 100.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  originalPrice?: number;

  @ApiProperty({
    description: 'Minimum booking amount for deal to apply',
    example: 50.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minBookingAmount?: number;

  @ApiProperty({
    description: 'Maximum number of times this deal can be used per customer',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({
    description: 'Deal terms and conditions',
    example: 'Valid for new customers only. Cannot be combined with other offers.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  dealTerms?: string;
}
