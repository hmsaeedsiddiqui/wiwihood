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
    example: 'uuid-string',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Provider ID',
    example: 'uuid-string',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Booking start date and time',
    example: '2024-12-25T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Booking end date and time',
    example: '2024-12-25T11:00:00Z',
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
    description: 'Booking status',
    example: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
