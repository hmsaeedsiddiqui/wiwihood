import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardsController } from './gift-cards.controller';
import { GiftCardsService } from './gift-cards.service';
import { GiftCard, GiftCardUsage } from '../../entities/gift-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftCard, GiftCardUsage]),
  ],
  controllers: [GiftCardsController],
  providers: [GiftCardsService],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}