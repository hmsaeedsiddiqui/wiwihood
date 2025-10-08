import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import mapsConfig from '../../config/maps.config';

@Module({
  imports: [
    ConfigModule.forFeature(mapsConfig),
  ],
  providers: [MapsService],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}