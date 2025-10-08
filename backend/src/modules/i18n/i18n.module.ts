import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';
import i18nConfig from '../../config/i18n.config';

@Module({
  imports: [
    ConfigModule.forFeature(i18nConfig),
  ],
  providers: [I18nService],
  controllers: [I18nController],
  exports: [I18nService],
})
export class I18nModule {}