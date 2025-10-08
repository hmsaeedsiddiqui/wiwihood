import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsBoolean, IsObject, IsUUID, Min } from 'class-validator';
import { RecurrenceFrequency } from '../../../entities/recurring-booking.entity';

export class CreateRecurringBookingDto {
  @ApiProperty({ 
    description: 'Provider ID - The service provider for the recurring booking',
    example: '550e8400-e29b-41d4-a716-446655440011',
    format: 'uuid',
    type: String
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({ 
    description: 'Service ID - The specific service to be booked',
    example: '19f77203-2904-4e96-bcad-78d5ca984c7c',
    format: 'uuid',
    type: String
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ 
    description: 'Recurrence frequency - How often the booking repeats',
    enum: RecurrenceFrequency,
    example: RecurrenceFrequency.WEEKLY,
    enumName: 'RecurrenceFrequency'
  })
  @IsEnum(RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @ApiProperty({ 
    description: 'Start time in HH:mm format (24-hour)',
    example: '10:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  @IsString()
  startTime: string;

  @ApiProperty({ 
    description: 'Duration of each booking in minutes',
    example: 60,
    minimum: 15,
    maximum: 480,
    type: Number
  })
  @IsNumber()
  @Min(15)
  durationMinutes: number;

  @ApiProperty({ 
    description: 'Date of the first booking in YYYY-MM-DD format',
    example: '2025-01-15',
    format: 'date'
  })
  @IsDateString()
  nextBookingDate: string;

  @ApiPropertyOptional({ 
    description: 'End date for recurrence. If not provided, bookings continue indefinitely',
    example: '2025-12-31',
    format: 'date',
    nullable: true
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum number of bookings to create. If not specified, unlimited bookings (subject to endDate)',
    example: 52,
    minimum: 1,
    maximum: 999,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxBookings?: number;

  @ApiPropertyOptional({ 
    description: 'Special instructions or notes for all recurring bookings',
    example: 'Please use side entrance and ring bell twice',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ 
    description: 'Whether to automatically confirm all generated bookings',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  autoConfirm?: boolean;

  @ApiPropertyOptional({ 
    description: 'Notification preferences for recurring bookings',
    example: {
      email: true,
      sms: false,
      reminderDaysBefore: [1, 7]
    },
    type: 'object',
    properties: {
      email: { type: 'boolean', description: 'Send email notifications' },
      sms: { type: 'boolean', description: 'Send SMS notifications' },
      reminderDaysBefore: { 
        type: 'array', 
        items: { type: 'number' },
        description: 'Days before booking to send reminders'
      }
    }
  })
  @IsOptional()
  @IsObject()
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    reminderDaysBefore: number[];
  };
}

export class UpdateRecurringBookingDto {
  @ApiPropertyOptional({ 
    description: 'Recurrence frequency',
    enum: RecurrenceFrequency,
    example: 'monthly'
  })
  @IsOptional()
  @IsEnum(RecurrenceFrequency)
  frequency?: RecurrenceFrequency;

  @ApiPropertyOptional({ 
    description: 'Start time (HH:mm format)',
    example: '11:00'
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ 
    description: 'Duration in minutes',
    example: 90
  })
  @IsOptional()
  @IsNumber()
  @Min(15)
  durationMinutes?: number;

  @ApiPropertyOptional({ 
    description: 'Next booking date',
    example: '2025-10-15'
  })
  @IsOptional()
  @IsDateString()
  nextBookingDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date for recurrence',
    example: '2026-01-15'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum number of bookings',
    example: 15
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxBookings?: number;

  @ApiPropertyOptional({ 
    description: 'Special instructions for all bookings',
    example: 'Please call upon arrival and use the side entrance'
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ 
    description: 'Auto-confirm bookings',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  autoConfirm?: boolean;

  @ApiPropertyOptional({ 
    description: 'Notification preferences',
    example: {
      email: true,
      sms: true,
      reminderDaysBefore: [1, 3, 7]
    }
  })
  @IsOptional()
  @IsObject()
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    reminderDaysBefore: number[];
  };
}

export class CreateRecurringExceptionDto {
  @ApiProperty({ 
    description: 'Date of the exception',
    example: '2025-07-04'
  })
  @IsDateString()
  exceptionDate: string;

  @ApiProperty({ 
    description: 'Type of exception',
    enum: ['skip', 'reschedule', 'cancel'],
    example: 'skip'
  })
  @IsEnum(['skip', 'reschedule', 'cancel'])
  exceptionType: 'skip' | 'reschedule' | 'cancel';

  @ApiPropertyOptional({ 
    description: 'New date if rescheduled',
    example: '2025-07-05'
  })
  @IsOptional()
  @IsDateString()
  newDate?: string;

  @ApiPropertyOptional({ 
    description: 'New time if rescheduled (HH:mm format)',
    example: '14:00'
  })
  @IsOptional()
  @IsString()
  newTime?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for exception'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}