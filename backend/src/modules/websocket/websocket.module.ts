import { Module } from '@nestjs/common';
import { AvailabilityGateway } from './websocket.gateway';

@Module({
  providers: [AvailabilityGateway],
  exports: [AvailabilityGateway],
})
export class WebSocketModule {}