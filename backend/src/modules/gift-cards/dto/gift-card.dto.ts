import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsEmail, 
  IsOptional, 
  IsDateString, 
  Min, 
  Max, 
  IsBoolean,
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { GiftCardStatus, TransactionType, PromotionType } from '../../../entities/gift-card.entity';

export class CreateGiftCardDto {
  @ApiProperty({ 
    description: 'Gift card amount',
    example: 100.00,
    minimum: 10,
    maximum: 1000
  })
  @IsNumber()
  @Min(10)
  @Max(1000)
  amount: number;

  @ApiProperty({ 
    description: 'Purchaser email address',
    example: 'customer@example.com'
  })
  @IsEmail()
  purchaserEmail: string;

  @ApiPropertyOptional({ 
    description: 'Purchaser name',
    example: 'John Customer'
  })
  @IsOptional()
  @IsString()
  purchaserName?: string;

  @ApiPropertyOptional({ 
    description: 'Purchaser phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  purchaserPhone?: string;

  @ApiProperty({ 
    description: 'Recipient email address',
    example: 'friend@example.com'
  })
  @IsEmail()
  recipientEmail: string;

  @ApiPropertyOptional({ 
    description: 'Recipient name',
    example: 'Jane Friend'
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ 
    description: 'Personal message for the gift card',
    example: 'Happy Birthday! Enjoy your spa day!'
  })
  @IsOptional()
  @IsString()
  personalMessage?: string;

  @ApiPropertyOptional({ 
    description: 'Is physical gift card',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isPhysical?: boolean;

  @ApiPropertyOptional({ 
    description: 'Provider ID for provider-specific gift cards'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ 
    description: 'Service ID for service-specific gift cards'
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum spend amount to use gift card',
    example: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumSpend?: number;

  @ApiPropertyOptional({ 
    description: 'Currency code',
    example: 'USD'
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ 
    description: 'Payment intent ID from payment gateway'
  })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

export class RedeemGiftCardDto {
  @ApiProperty({ 
    description: 'Gift card code',
    example: 'GC-DEMO001'
  })
  @IsString()
  code: string;

  @ApiProperty({ 
    description: 'Amount to redeem',
    example: 50.00
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ 
    description: 'Booking ID where gift card is being used'
  })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiPropertyOptional({ 
    description: 'Provider ID where gift card is being redeemed'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ 
    description: 'User ID performing the redemption'
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ 
    description: 'Email of person redeeming the gift card'
  })
  @IsOptional()
  @IsEmail()
  redeemedByEmail?: string;

  @ApiPropertyOptional({ 
    description: 'Location where redeemed'
  })
  @IsOptional()
  @IsString()
  redemptionLocation?: string;

  @ApiPropertyOptional({ 
    description: 'Notes about the redemption'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GiftCardBalanceDto {
  @ApiProperty({ 
    description: 'Gift card code',
    example: 'GC-DEMO001'
  })
  @IsString()
  code: string;
}

export class TransferGiftCardDto {
  @ApiProperty({ 
    description: 'New recipient email',
    example: 'newrecipient@example.com'
  })
  @IsEmail()
  recipientEmail: string;

  @ApiPropertyOptional({ 
    description: 'New recipient name',
    example: 'New Recipient'
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ 
    description: 'Transfer reason',
    example: 'Gift to friend'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CancelGiftCardDto {
  @ApiPropertyOptional({ 
    description: 'Cancellation reason',
    example: 'Requested by customer'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ExtendGiftCardExpiryDto {
  @ApiProperty({ 
    description: 'New expiry date',
    example: '2026-12-31T23:59:59.000Z'
  })
  @IsDateString()
  newExpiryDate: string;

  @ApiPropertyOptional({ 
    description: 'Reason for extension',
    example: 'Customer request'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetGiftCardsQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by status',
    enum: GiftCardStatus
  })
  @IsOptional()
  @IsEnum(GiftCardStatus)
  status?: GiftCardStatus;

  @ApiPropertyOptional({ 
    description: 'Search by email or code'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by provider ID'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ 
    description: 'Page number',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ 
    description: 'Items per page',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ 
    description: 'Start date for filtering'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date for filtering'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class GiftCardStatsQueryDto {
  @ApiPropertyOptional({ 
    description: 'Period for stats (today, week, month, year, all)',
    example: 'month'
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ 
    description: 'Provider ID for provider-specific stats'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;
}

export class CreatePromotionDto {
  @ApiProperty({ 
    description: 'Promotion name',
    example: 'Holiday Bonus'
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Promotion description',
    example: 'Get 10% extra value on gift cards above $100'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Promotion type',
    enum: PromotionType,
    example: PromotionType.BONUS
  })
  @IsEnum(PromotionType)
  promotionType: PromotionType;

  @ApiPropertyOptional({ 
    description: 'Bonus percentage',
    example: 10.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bonusPercentage?: number;

  @ApiPropertyOptional({ 
    description: 'Fixed bonus amount',
    example: 25.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonusAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Minimum purchase to qualify',
    example: 100.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @ApiProperty({ 
    description: 'Promotion start date',
    example: '2024-12-01T00:00:00.000Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'Promotion end date',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ 
    description: 'Total usage limit'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ 
    description: 'Per customer limit',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  perCustomerLimit?: number;

  @ApiPropertyOptional({ 
    description: 'Customer email pattern for targeting'
  })
  @IsOptional()
  @IsString()
  customerEmailPattern?: string;

  @ApiPropertyOptional({ 
    description: 'Provider ID for provider-specific promotions'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;
}

export class UpdatePromotionDto {
  @ApiPropertyOptional({ 
    description: 'Promotion name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Promotion description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Is promotion active'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Bonus percentage'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bonusPercentage?: number;

  @ApiPropertyOptional({ 
    description: 'Fixed bonus amount'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonusAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Minimum purchase to qualify'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @ApiPropertyOptional({ 
    description: 'Total usage limit'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ 
    description: 'Per customer limit'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  perCustomerLimit?: number;
}

export class BulkCreateGiftCardsDto {
  @ApiProperty({ 
    description: 'Number of gift cards to create',
    example: 10
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;

  @ApiProperty({ 
    description: 'Gift card amount',
    example: 100.00
  })
  @IsNumber()
  @Min(10)
  @Max(1000)
  amount: number;

  @ApiProperty({ 
    description: 'Purchaser email address'
  })
  @IsEmail()
  purchaserEmail: string;

  @ApiPropertyOptional({ 
    description: 'Purchaser name'
  })
  @IsOptional()
  @IsString()
  purchaserName?: string;

  @ApiPropertyOptional({ 
    description: 'Provider ID for provider-specific gift cards'
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiPropertyOptional({ 
    description: 'Expiry date for all cards'
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}