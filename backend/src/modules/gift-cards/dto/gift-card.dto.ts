import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsOptional, IsDateString, Min, Max } from 'class-validator';

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

  @ApiPropertyOptional({ 
    description: 'Recipient name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ 
    description: 'Recipient email',
    example: 'john@example.com'
  })
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @ApiPropertyOptional({ 
    description: 'Personal message for the gift card',
    example: 'Happy Birthday! Enjoy your spa day!'
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ 
    description: 'Expiration date (ISO string)',
    example: '2025-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class RedeemGiftCardDto {
  @ApiProperty({ 
    description: 'Gift card code',
    example: 'GC2025ABCD1234'
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
  @IsString()
  bookingId?: string;

  @ApiPropertyOptional({ 
    description: 'Description of the usage'
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class GiftCardBalanceDto {
  @ApiProperty({ 
    description: 'Gift card code',
    example: 'GC2025ABCD1234'
  })
  @IsString()
  code: string;
}