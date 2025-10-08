import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Service ID to book',
    example: '19f77203-2904-4e96-bcad-78d5ca984c7c',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Provider ID',
    example: '550e8400-e29b-41d4-a716-446655440011',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Staff ID (optional for multi-staff providers)',
    example: '550e8400-e29b-41d4-a716-446655440012',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiProperty({
    description: 'Booking start date and time',
    example: '2025-10-25T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Booking end date and time',
    example: '2025-10-25T11:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Total booking price',
    example: 50.00,
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({
    description: 'Platform fee',
    example: 5.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFee?: number;

  @ApiProperty({
    description: 'Customer notes',
    example: 'Please call before arrival',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Customer name (for guest bookings)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({
    description: 'Promotion code to apply',
    example: 'WELCOME20',
    required: false,
  })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiProperty({
    description: 'Booking status',
    example: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
