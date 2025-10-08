import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Stripe customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Stripe price ID' })
  @IsString()
  priceId: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}