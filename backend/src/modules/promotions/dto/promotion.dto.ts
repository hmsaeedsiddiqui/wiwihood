import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsUUID, Min, Max } from 'class-validator';
import { PromotionType, PromotionStatus } from '../../../entities/promotion.entity';

export class CreatePromotionDto {
  @ApiProperty({ 
    description: 'Promotion name', 
    example: 'New Customer Welcome Offer' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Promotion description', 
    example: 'Get 20% off your first booking with us! Valid for new customers only.',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Promotion code for users to enter', 
    example: 'WELCOME20' 
  })
  @IsString()
  code: string;

  @ApiProperty({ 
    description: 'Promotion type', 
    enum: PromotionType,
    example: PromotionType.PERCENTAGE,
    examples: {
      percentage: { value: 'percentage', description: 'Percentage-based discount (e.g., 20% off)' },
      fixed_amount: { value: 'fixed_amount', description: 'Fixed amount discount (e.g., $15 off)' },
      buy_one_get_one: { value: 'buy_one_get_one', description: 'Buy one get one offer' },
      free_service: { value: 'free_service', description: 'Free service or treatment' }
    }
  })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({ 
    description: 'Discount value (percentage or fixed amount)', 
    example: 20,
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ 
    description: 'Maximum discount amount (for percentage discounts)', 
    example: 50,
    minimum: 0,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ 
    description: 'Minimum order amount to apply promotion', 
    example: 30,
    minimum: 0,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ 
    description: 'Maximum usage limit for this promotion', 
    example: 100,
    minimum: 1,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ 
    description: 'Promotion start date', 
    example: '2025-10-06T00:00:00Z' 
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'Promotion end date', 
    example: '2025-11-06T23:59:59Z' 
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ 
    description: 'Provider ID (optional for global promotions)', 
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;
}

export class UpdatePromotionDto {
  @ApiProperty({ description: 'Promotion name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Promotion description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Promotion status', enum: PromotionStatus, required: false })
  @IsOptional()
  @IsEnum(PromotionStatus)
  status?: PromotionStatus;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiProperty({ description: 'Maximum discount amount (for percentage discounts)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Minimum order amount to apply promotion', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ description: 'Maximum usage limit for this promotion', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ description: 'Promotion start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Promotion end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class ValidatePromotionDto {
  @ApiProperty({ 
    description: 'Promotion code to validate', 
    example: 'WELCOME20' 
  })
  @IsString()
  code: string;

  @ApiProperty({ 
    description: 'Order amount to check against minimum requirement', 
    example: 85.50,
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  orderAmount: number;

  @ApiProperty({ 
    description: 'Provider ID for provider-specific promotions', 
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;
}

export class PromotionResponseDto {
  @ApiProperty({ description: 'Promotion ID' })
  id: string;

  @ApiProperty({ description: 'Promotion name' })
  name: string;

  @ApiProperty({ description: 'Promotion description' })
  description?: string;

  @ApiProperty({ description: 'Promotion code' })
  code: string;

  @ApiProperty({ description: 'Promotion type', enum: PromotionType })
  type: PromotionType;

  @ApiProperty({ description: 'Discount value' })
  discountValue: number;

  @ApiProperty({ description: 'Maximum discount amount' })
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Minimum order amount' })
  minOrderAmount?: number;

  @ApiProperty({ description: 'Usage limit' })
  usageLimit?: number;

  @ApiProperty({ description: 'Used count' })
  usedCount: number;

  @ApiProperty({ description: 'Promotion status', enum: PromotionStatus })
  status: PromotionStatus;

  @ApiProperty({ description: 'Start date' })
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  endDate: Date;

  @ApiProperty({ description: 'Provider ID' })
  providerId?: string;

  @ApiProperty({ description: 'Provider name' })
  providerName?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}