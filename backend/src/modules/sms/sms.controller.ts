import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { SendBulkSmsDto } from './dto/send-bulk-sms.dto';

@ApiTags('SMS Notifications')
@ApiBearerAuth()
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @ApiOperation({ summary: 'Send single SMS' })
  @ApiResponse({ status: 201, description: 'SMS sent successfully' })
  @Post('send')
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    return this.smsService.sendSms(sendSmsDto);
  }

  @ApiOperation({ summary: 'Send bulk SMS to multiple recipients' })
  @ApiResponse({ status: 201, description: 'Bulk SMS sent successfully' })
  @Post('send-bulk')
  async sendBulkSms(@Body() sendBulkSmsDto: SendBulkSmsDto) {
    return this.smsService.sendBulkSms(sendBulkSmsDto);
  }

  @ApiOperation({ summary: 'Send booking confirmation SMS' })
  @ApiResponse({ status: 201, description: 'Booking confirmation SMS sent' })
  @Post('booking-confirmation')
  async sendBookingConfirmation(
    @Body() body: { phone: string; bookingData: any }
  ) {
    return this.smsService.sendBookingConfirmation(body.phone, body.bookingData);
  }

  @ApiOperation({ summary: 'Send verification code SMS' })
  @ApiResponse({ status: 201, description: 'Verification code SMS sent' })
  @Post('verification-code')
  async sendVerificationCode(
    @Body() body: { phone: string; code: string }
  ) {
    return this.smsService.sendVerificationCode(body.phone, body.code);
  }

  @ApiOperation({ summary: 'Get SMS delivery status' })
  @ApiResponse({ status: 200, description: 'SMS status retrieved successfully' })
  @Get('status/:messageId')
  async getMessageStatus(@Param('messageId') messageId: string) {
    return this.smsService.getMessageStatus(messageId);
  }
}