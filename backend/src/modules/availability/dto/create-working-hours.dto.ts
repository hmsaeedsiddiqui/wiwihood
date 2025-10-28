import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  IsNotEmpty,
  Matches,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { DayOfWeek } from '../../../entities/provider-working-hours.entity';

export class CreateWorkingHoursDto {
  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsIn(Object.values(DayOfWeek))
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: 'Is this day active/working',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Start time in HH:MM format',
    example: '09:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:MM format',
    example: '17:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    description: 'Break start time in HH:MM format',
    example: '12:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Break start time must be in HH:MM format',
  })
  breakStartTime?: string;

  @ApiProperty({
    description: 'Break end time in HH:MM format',
    example: '13:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Break end time must be in HH:MM format',
  })
  breakEndTime?: string;

  @ApiProperty({
    description: 'Maximum bookings allowed for this day',
    example: 8,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  maxBookingsPerDay?: number;

  @ApiProperty({
    description: 'Timezone for working hours',
    example: 'Europe/Berlin',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    description: 'Notes for this working day',
    example: 'Reduced hours due to maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}