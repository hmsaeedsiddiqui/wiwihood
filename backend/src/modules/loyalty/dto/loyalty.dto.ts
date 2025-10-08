import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { LoyaltyTier, PointTransactionType } from '../../../entities/loyalty.entity';

export class AddPointsDto {
  @ApiProperty({ 
    description: 'Points to add',
    example: 100,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ 
    description: 'Transaction description',
    example: 'Booking completion bonus'
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({ 
    description: 'Reference ID (booking, referral, etc.)',
    example: 'booking_123'
  })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({ 
    description: 'Reference type',
    example: 'booking'
  })
  @IsOptional()
  @IsString()
  referenceType?: string;
}

export class RedeemPointsDto {
  @ApiProperty({ 
    description: 'Points to redeem',
    example: 500,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ 
    description: 'Reward ID being redeemed'
  })
  @IsString()
  rewardId: string;

  @ApiPropertyOptional({ 
    description: 'Booking ID where points are being used'
  })
  @IsOptional()
  @IsString()
  bookingId?: string;
}

export class CreateLoyaltyRewardDto {
  @ApiProperty({ 
    description: 'Reward name',
    example: '10% Discount on Next Booking'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Reward description',
    example: 'Get 10% off your next service booking'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Points required to redeem',
    example: 500,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  pointsRequired: number;

  @ApiPropertyOptional({ 
    description: 'Reward type',
    example: 'discount',
    default: 'discount'
  })
  @IsOptional()
  @IsString()
  rewardType?: string;

  @ApiPropertyOptional({ 
    description: 'Reward value',
    example: 10.00,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardValue?: number;

  @ApiPropertyOptional({ 
    description: 'Discount percentage (0-100)',
    example: 10,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ 
    description: 'Discount amount',
    example: 25.00,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiProperty({ 
    description: 'Minimum tier required',
    example: 'bronze',
    enum: ['bronze', 'silver', 'gold', 'platinum']
  })
  @IsString()
  minimumTier: string;
}

export class UpdateLoyaltyRewardDto {
  @ApiPropertyOptional({ 
    description: 'Reward name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Reward description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Points required to redeem'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pointsRequired?: number;

  @ApiPropertyOptional({ 
    description: 'Discount percentage (0-100)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ 
    description: 'Discount amount'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Reward value (maps to rewardValue in entity)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardValue?: number;

  @ApiPropertyOptional({ 
    description: 'Reward type (discount, percentage, amount, etc.)'
  })
  @IsOptional()
  @IsString()
  rewardType?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum tier required',
    enum: LoyaltyTier
  })
  @IsOptional()
  @IsEnum(LoyaltyTier)
  minimumTier?: LoyaltyTier;

  @ApiPropertyOptional({ 
    description: 'Is reward active'
  })
  @IsOptional()
  isActive?: boolean;
}