import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, Min, Max, Length } from 'class-validator';

export enum PaymentMethodType {
  CARD = 'card',
  BANK = 'bank',
  DIGITAL_WALLET = 'digital_wallet',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method type',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD
  })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Stripe payment method ID from frontend',
    example: 'pm_1234567890abcdef',
    required: false
  })
  @IsOptional()
  @IsString()
  stripePaymentMethodId?: string;

  @ApiProperty({
    description: 'Last 4 digits of card/account',
    example: '4242',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  lastFourDigits?: string;

  @ApiProperty({
    description: 'Card brand (visa, mastercard, etc.)',
    example: 'visa',
    required: false
  })
  @IsOptional()
  @IsString()
  cardBrand?: string;

  @ApiProperty({
    description: 'Card expiry month',
    example: 12,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth?: number;

  @ApiProperty({
    description: 'Card expiry year',
    example: 2025,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(new Date().getFullYear())
  expiryYear?: number;

  @ApiProperty({
    description: 'Billing name on payment method',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  billingName?: string;

  @ApiProperty({
    description: 'Billing email',
    example: 'john.doe@example.com',
    required: false
  })
  @IsOptional()
  @IsString()
  billingEmail?: string;

  @ApiProperty({
    description: 'Billing address',
    example: '123 Main St, Apt 4B',
    required: false
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({
    description: 'Billing city',
    example: 'New York',
    required: false
  })
  @IsOptional()
  @IsString()
  billingCity?: string;

  @ApiProperty({
    description: 'Billing state/province',
    example: 'NY',
    required: false
  })
  @IsOptional()
  @IsString()
  billingState?: string;

  @ApiProperty({
    description: 'Billing postal code',
    example: '10001',
    required: false
  })
  @IsOptional()
  @IsString()
  billingPostalCode?: string;

  @ApiProperty({
    description: 'Billing country (ISO code)',
    example: 'US',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  billingCountry?: string;

  @ApiProperty({
    description: 'Whether this should be the default payment method',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    description: 'User-friendly nickname for the payment method',
    example: 'My Visa Card',
    required: false
  })
  @IsOptional()
  @IsString()
  nickname?: string;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Billing name on payment method',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  billingName?: string;

  @ApiProperty({
    description: 'Billing email',
    example: 'john.doe@example.com',
    required: false
  })
  @IsOptional()
  @IsString()
  billingEmail?: string;

  @ApiProperty({
    description: 'Billing address',
    example: '123 Main St, Apt 4B',
    required: false
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({
    description: 'Billing city',
    example: 'New York',
    required: false
  })
  @IsOptional()
  @IsString()
  billingCity?: string;

  @ApiProperty({
    description: 'Billing state/province',
    example: 'NY',
    required: false
  })
  @IsOptional()
  @IsString()
  billingState?: string;

  @ApiProperty({
    description: 'Billing postal code',
    example: '10001',
    required: false
  })
  @IsOptional()
  @IsString()
  billingPostalCode?: string;

  @ApiProperty({
    description: 'Billing country (ISO code)',
    example: 'US',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  billingCountry?: string;

  @ApiProperty({
    description: 'Whether this should be the default payment method',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    description: 'User-friendly nickname for the payment method',
    example: 'My Visa Card',
    required: false
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: 'Whether this payment method is active',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PaymentMethodResponseDto {
  @ApiProperty({ description: 'Payment method ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Payment method type', enum: PaymentMethodType, example: PaymentMethodType.CARD })
  type: PaymentMethodType;

  @ApiProperty({ description: 'Last 4 digits of card/account', example: '4242' })
  lastFourDigits?: string;

  @ApiProperty({ description: 'Card brand', example: 'visa' })
  cardBrand?: string;

  @ApiProperty({ description: 'Card expiry month', example: 12 })
  expiryMonth?: number;

  @ApiProperty({ description: 'Card expiry year', example: 2025 })
  expiryYear?: number;

  @ApiProperty({ description: 'Billing name', example: 'John Doe' })
  billingName?: string;

  @ApiProperty({ description: 'Billing email', example: 'john.doe@example.com' })
  billingEmail?: string;

  @ApiProperty({ description: 'Billing address', example: '123 Main St, Apt 4B' })
  billingAddress?: string;

  @ApiProperty({ description: 'Billing city', example: 'New York' })
  billingCity?: string;

  @ApiProperty({ description: 'Billing state/province', example: 'NY' })
  billingState?: string;

  @ApiProperty({ description: 'Billing postal code', example: '10001' })
  billingPostalCode?: string;

  @ApiProperty({ description: 'Billing country (ISO code)', example: 'US' })
  billingCountry?: string;

  @ApiProperty({ description: 'Whether this is the default payment method', example: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Whether this payment method is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'User-friendly nickname', example: 'My Visa Card' })
  nickname?: string;

  @ApiProperty({ description: 'Masked card/account number for display', example: '**** **** **** 4242' })
  maskedNumber: string;

  @ApiProperty({ description: 'Display name for the payment method', example: 'VISA ending in 4242' })
  displayName: string;

  @ApiProperty({ description: 'Whether the payment method is expired', example: false })
  isExpired: boolean;

  @ApiProperty({ description: 'When the payment method was added' })
  createdAt: Date;

  @ApiProperty({ description: 'When the payment method was last updated' })
  updatedAt: Date;
}