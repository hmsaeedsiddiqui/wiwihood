import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateTimeSlotsDto {
  @ApiProperty({
    description: 'Start date for slot generation in YYYY-MM-DD format',
    example: '2024-11-01',
  })
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'End date for slot generation in YYYY-MM-DD format',
    example: '2024-11-30',
  })
  @IsDateString()
  toDate: string;

  @ApiProperty({
    description: 'Duration of each slot in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(480)
  slotDurationMinutes?: number;

  @ApiProperty({
    description: 'Buffer time between slots in minutes',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  bufferTimeMinutes?: number;

  @ApiProperty({
    description: 'Service ID to generate slots for (optional)',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({
    description: 'Maximum bookings per slot',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxBookings?: number;

  @ApiProperty({
    description: 'Days of week to generate slots for',
    example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  daysOfWeek?: string[];

  @ApiProperty({
    description: 'Override working hours for specific generation',
    required: false,
  })
  @IsOptional()
  overrideWorkingHours?: {
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
  };

  @ApiProperty({
    description: 'Whether to skip existing slots',
    example: true,
    required: false,
  })
  @IsOptional()
  skipExistingSlots?: boolean;

  @ApiProperty({
    description: 'Custom price for generated slots',
    required: false,
  })
  @IsOptional()
  customPrice?: number;
}