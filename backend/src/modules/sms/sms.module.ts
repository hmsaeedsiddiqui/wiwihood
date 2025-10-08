import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import smsConfig from '../../config/sms.config';

@Module({
  imports: [
    ConfigModule.forFeature(smsConfig),
  ],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule {}