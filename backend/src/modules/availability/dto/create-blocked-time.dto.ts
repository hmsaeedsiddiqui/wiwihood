import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  IsDateString,
  Matches,
  Length,
} from 'class-validator';
import { BlockedTimeType } from '../../../entities/provider-blocked-time.entity';

export class CreateBlockedTimeDto {
  @ApiProperty({
    description: 'Date to block in YYYY-MM-DD format',
    example: '2024-12-25',
  })
  @IsDateString()
  blockDate: string;

  @ApiProperty({
    description: 'Start time in HH:MM format (null for all-day)',
    example: '10:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime?: string;

  @ApiProperty({
    description: 'End time in HH:MM format (null for all-day)',
    example: '15:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime?: string;

  @ApiProperty({
    description: 'Is this an all-day block',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @ApiProperty({
    description: 'Type of blocked time',
    enum: BlockedTimeType,
    example: BlockedTimeType.VACATION,
  })
  @IsIn(Object.values(BlockedTimeType))
  blockType: BlockedTimeType;

  @ApiProperty({
    description: 'Reason for blocking this time',
    example: 'Christmas Holiday',
  })
  @IsString()
  @Length(1, 500)
  reason: string;

  @ApiProperty({
    description: 'Is this a recurring block',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({
    description: 'Recurring pattern (weekly, monthly, etc.)',
    example: 'weekly',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly'])
  recurringPattern?: string;

  @ApiProperty({
    description: 'End date for recurring blocks in YYYY-MM-DD format',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  recurringEndDate?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Office will be closed for maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}