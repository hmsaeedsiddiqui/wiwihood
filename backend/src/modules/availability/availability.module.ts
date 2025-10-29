import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { ProviderWorkingHours } from '../../entities/provider-working-hours.entity';
import { ProviderBlockedTime } from '../../entities/provider-blocked-time.entity';
import { ProviderTimeSlot } from '../../entities/provider-time-slot.entity';
import { ServiceAvailabilitySettings } from '../../entities/service-availability-settings.entity';
import { Provider } from '../../entities/provider.entity';
import { Service } from '../../entities/service.entity';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProviderWorkingHours,
      ProviderBlockedTime,
      ProviderTimeSlot,
      ServiceAvailabilitySettings,
      Provider,
      Service,
    ]),
    WebSocketModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}