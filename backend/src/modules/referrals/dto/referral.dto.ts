import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { ReferralRewardType } from '../../../entities/referral.entity';

export class CreateReferralDto {
  @ApiProperty({ 
    description: 'Referral code used',
    example: 'REF2025ABCD'
  })
  @IsString()
  referralCode: string;

  @ApiProperty({ 
    description: 'Email of person being referred',
    example: 'newuser@example.com'
  })
  @IsString()
  refereeEmail: string;
}

export class CreateReferralCampaignDto {
  @ApiProperty({ 
    description: 'Campaign name',
    example: 'Holiday Referral Bonus'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Campaign description',
    example: 'Refer friends and get extra rewards during holidays'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Referrer reward amount',
    example: 25.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  referrerRewardAmount: number;

  @ApiProperty({ 
    description: 'Referee reward amount',
    example: 15.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  refereeRewardAmount: number;

  @ApiProperty({ 
    description: 'Referrer reward type',
    enum: ReferralRewardType,
    example: ReferralRewardType.POINTS
  })
  @IsEnum(ReferralRewardType)
  referrerRewardType: ReferralRewardType;

  @ApiProperty({ 
    description: 'Referee reward type',
    enum: ReferralRewardType,
    example: ReferralRewardType.DISCOUNT
  })
  @IsEnum(ReferralRewardType)
  refereeRewardType: ReferralRewardType;

  @ApiProperty({ 
    description: 'Campaign start date',
    example: '2025-01-01T00:00:00.000Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'Campaign end date',
    example: '2025-01-31T23:59:59.000Z'
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ 
    description: 'Maximum referrals per user',
    example: 10,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxReferralsPerUser?: number;
}

export class UpdateReferralCampaignDto {
  @ApiPropertyOptional({ 
    description: 'Campaign name'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Campaign description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Referrer reward amount'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  referrerRewardAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Referee reward amount'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refereeRewardAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Referrer reward type',
    enum: ReferralRewardType
  })
  @IsOptional()
  @IsEnum(ReferralRewardType)
  referrerRewardType?: ReferralRewardType;

  @ApiPropertyOptional({ 
    description: 'Referee reward type',
    enum: ReferralRewardType
  })
  @IsOptional()
  @IsEnum(ReferralRewardType)
  refereeRewardType?: ReferralRewardType;

  @ApiPropertyOptional({ 
    description: 'Campaign start date'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Campaign end date'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum referrals per user'
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxReferralsPerUser?: number;

  @ApiPropertyOptional({ 
    description: 'Is campaign active'
  })
  @IsOptional()
  isActive?: boolean;
}

export class CompleteReferralDto {
  @ApiProperty({ 
    description: 'Referral ID to complete',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  referralId: string;

  @ApiProperty({ 
    description: 'Booking ID that completes the referral',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsString()
  bookingId: string;
}