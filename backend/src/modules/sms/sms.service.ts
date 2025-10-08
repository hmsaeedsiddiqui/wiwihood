import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const twilio = require('twilio');
import { SendSmsDto } from './dto/send-sms.dto';
import { SendBulkSmsDto } from './dto/send-bulk-sms.dto';

export interface SmsTemplate {
  BOOKING_CONFIRMATION: string;
  BOOKING_REMINDER: string;
  BOOKING_CANCELLATION: string;
  BOOKING_RESCHEDULED: string;
  VERIFICATION_CODE: string;
  WELCOME: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly twilioClient: any;
  private readonly fromNumber: string;
  private readonly smsEnabled: boolean;

  private readonly templates: SmsTemplate = {
    BOOKING_CONFIRMATION: 'Hi {customerName}! Your appointment with {providerName} is confirmed for {date} at {time}. Address: {address}',
    BOOKING_REMINDER: 'Reminder: You have an appointment with {providerName} tomorrow at {time}. Address: {address}',
    BOOKING_CANCELLATION: 'Your appointment with {providerName} on {date} at {time} has been cancelled.',
    BOOKING_RESCHEDULED: 'Your appointment with {providerName} has been rescheduled to {newDate} at {newTime}.',
    VERIFICATION_CODE: 'Your verification code is: {code}. This code expires in 10 minutes.',
    WELCOME: 'Welcome to Reservista! Thanks for joining our beauty and wellness marketplace.',
  };

  constructor(private configService: ConfigService) {
    const twilioConfig = this.configService.get('sms.twilio');
    this.fromNumber = twilioConfig.phoneNumber;
    this.smsEnabled = this.configService.get('sms.enabled');
    
    if (this.smsEnabled && twilioConfig.accountSid && twilioConfig.authToken && 
        twilioConfig.accountSid.startsWith('AC')) {
      this.twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);
    } else {
      this.logger.warn('SMS service is disabled or Twilio credentials are invalid');
    }
  }

  // Send single SMS
  async sendSms(sendSmsDto: SendSmsDto) {
    try {
      if (!this.smsEnabled) {
        this.logger.warn('SMS service is disabled');
        return { success: false, message: 'SMS service is disabled' };
      }

      const { to, message, templateId, templateData } = sendSmsDto;
      
      let finalMessage = message;
      if (templateId && this.templates[templateId]) {
        finalMessage = this.populateTemplate(this.templates[templateId], templateData);
      }

      const result = await this.twilioClient.messages.create({
        body: finalMessage,
        from: this.fromNumber,
        to: this.formatPhoneNumber(to),
      });

      this.logger.log(`SMS sent successfully to ${to}, SID: ${result.sid}`);
      return {
        success: true,
        messageId: result.sid,
        status: result.status,
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${sendSmsDto.to}`, error);
      throw error;
    }
  }

  // Send bulk SMS
  async sendBulkSms(sendBulkSmsDto: SendBulkSmsDto) {
    try {
      if (!this.smsEnabled) {
        this.logger.warn('SMS service is disabled');
        return { success: false, message: 'SMS service is disabled' };
      }

      const { recipients, message, templateId, templateData } = sendBulkSmsDto;
      const results = [];

      for (const recipient of recipients) {
        try {
          let finalMessage = message;
          if (templateId && this.templates[templateId]) {
            const data = templateData?.[recipient.phone] || templateData?.default || {};
            finalMessage = this.populateTemplate(this.templates[templateId], data);
          }

          const result = await this.twilioClient.messages.create({
            body: finalMessage,
            from: this.fromNumber,
            to: this.formatPhoneNumber(recipient.phone),
          });

          results.push({
            phone: recipient.phone,
            success: true,
            messageId: result.sid,
            status: result.status,
          });

          this.logger.log(`SMS sent successfully to ${recipient.phone}, SID: ${result.sid}`);
        } catch (error) {
          results.push({
            phone: recipient.phone,
            success: false,
            error: error.message,
          });
          this.logger.error(`Failed to send SMS to ${recipient.phone}`, error);
        }
      }

      return {
        success: true,
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        results,
      };
    } catch (error) {
      this.logger.error('Failed to send bulk SMS', error);
      throw error;
    }
  }

  // Send booking confirmation SMS
  async sendBookingConfirmation(phone: string, bookingData: any) {
    return this.sendSms({
      to: phone,
      templateId: 'BOOKING_CONFIRMATION',
      templateData: bookingData,
    });
  }

  // Send booking reminder SMS
  async sendBookingReminder(phone: string, bookingData: any) {
    return this.sendSms({
      to: phone,
      templateId: 'BOOKING_REMINDER',
      templateData: bookingData,
    });
  }

  // Send verification code SMS
  async sendVerificationCode(phone: string, code: string) {
    return this.sendSms({
      to: phone,
      templateId: 'VERIFICATION_CODE',
      templateData: { code },
    });
  }

  // Get SMS delivery status
  async getMessageStatus(messageId: string) {
    try {
      if (!this.smsEnabled) {
        throw new Error('SMS service is disabled');
      }

      const message = await this.twilioClient.messages(messageId).fetch();
      return {
        messageId: message.sid,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        price: message.price,
        priceUnit: message.priceUnit,
      };
    } catch (error) {
      this.logger.error(`Failed to get message status for ${messageId}`, error);
      throw error;
    }
  }

  // Format phone number to E.164 format
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (!phone.startsWith('+')) {
      const defaultCountryCode = this.configService.get('sms.defaultCountryCode') || '+1';
      return `${defaultCountryCode}${cleaned}`;
    }
    
    return `+${cleaned}`;
  }

  // Populate SMS template with data
  private populateTemplate(template: string, data: Record<string, any> = {}): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }
}