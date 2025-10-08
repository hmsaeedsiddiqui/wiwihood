import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SmsRecipient {
  @ApiProperty({ description: 'Recipient phone number', example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Recipient name', example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}

export class SendBulkSmsDto {
  @ApiProperty({ description: 'List of SMS recipients', type: [SmsRecipient] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SmsRecipient)
  recipients: SmsRecipient[];

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

  @ApiProperty({ description: 'Template data for dynamic content (can be per-phone or default)', required: false })
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}