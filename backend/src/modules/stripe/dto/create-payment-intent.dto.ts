import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsObject, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Payment amount in dollars', example: 29.99 })
  @IsNumber()
  @Min(0.5)
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'usd', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Stripe customer ID', required: false })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}