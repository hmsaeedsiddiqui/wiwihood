import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export enum TimeBlockType {
  BLOCKED = 'blocked',
  BREAK = 'break',
  VACATION = 'vacation',
}

export class CreateTimeBlockDto {
  @ApiProperty({
    description: 'Date of the time block (YYYY-MM-DD)',
    example: '2025-10-08',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Start time (HH:MM)',
    example: '09:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'End time (HH:MM)',
    example: '10:00',
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Type of time block',
    enum: TimeBlockType,
    example: TimeBlockType.BLOCKED,
  })
  @IsEnum(TimeBlockType)
  type: TimeBlockType;

  @ApiProperty({
    description: 'Reason for the time block',
    example: 'Personal appointment',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Whether this time block is recurring',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @ApiProperty({
    description: 'End date for recurring time blocks (YYYY-MM-DD)',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}