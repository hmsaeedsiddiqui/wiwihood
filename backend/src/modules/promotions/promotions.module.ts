import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion, PromotionUsage } from '../../entities';
import { Provider } from '../../entities/provider.entity';
import { Service } from '../../entities/service.entity';
import { Booking } from '../../entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promotion, 
      PromotionUsage, 
      Provider, 
      Service, 
      Booking
    ])
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}