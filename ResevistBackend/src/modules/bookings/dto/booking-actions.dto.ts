import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { BookingStatus } from '../../../entities/booking.entity';

export class RescheduleBookingDto {
  @ApiProperty({
    description: 'New booking start date and time',
    example: '2024-12-26T10:00:00Z',
  })
  @IsDateString()
  newStartTime: string;

  @ApiProperty({
    description: 'New booking end date and time',
    example: '2024-12-26T11:00:00Z',
  })
  @IsDateString()
  newEndTime: string;

  @ApiProperty({
    description: 'Reason for rescheduling',
    example: 'Customer requested change',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CancelBookingDto {
  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'Customer unable to attend',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Refund amount (if applicable)',
    example: 40.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}

export class CheckInBookingDto {
  @ApiProperty({
    description: 'Provider notes for check-in',
    example: 'Customer arrived on time',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteBookingDto {
  @ApiProperty({
    description: 'Service completion notes',
    example: 'Service completed successfully',
    required: false,
  })
  @IsOptional()
  @IsString()
  completionNotes?: string;

  @ApiProperty({
    description: 'Actual service duration in minutes',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  actualDuration?: number;
}

export class BookingAvailabilityDto {
  @ApiProperty({
    description: 'Provider ID to check availability',
    example: 'uuid-string',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Service ID to check availability',
    example: 'uuid-string',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Date to check availability (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @IsDateString()
  date: string;
}

export class BookingFiltersDto {
  @ApiProperty({
    description: 'Filter by booking status',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Filter by provider ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @ApiProperty({
    description: 'Filter by service ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({
    description: 'Filter by start date (YYYY-MM-DD)',
    example: '2024-12-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter by end date (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
