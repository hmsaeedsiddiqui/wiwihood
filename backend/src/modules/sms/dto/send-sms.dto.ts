import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SendSmsDto {
  @ApiProperty({ description: 'Recipient phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'SMS message content', example: 'Your appointment is confirmed!', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ 
    description: 'Template ID for predefined messages', 
    example: 'BOOKING_CONFIRMATION',
    enum: ['BOOKING_CONFIRMATION', 'BOOKING_REMINDER', 'BOOKING_CANCELLATION', 'BOOKING_RESCHEDULED', 'VERIFICATION_CODE', 'WELCOME'],
    required: false 
  })
  @IsString()
  @IsOptional()
  templateId?: 'BOOKING_CONFIRMATION' | 'BOOKING_REMINDER' | 'BOOKING_CANCELLATION' | 'BOOKING_RESCHEDULED' | 'VERIFICATION_CODE' | 'WELCOME';

  @ApiProperty({ description: 'Template data for dynamic content', required: false })
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}