import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';
import { DatabaseSetupService } from './database-setup.service';
import { LoyaltyAccount, PointTransaction, LoyaltyReward } from '../../entities/loyalty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoyaltyAccount, PointTransaction, LoyaltyReward]),
  ],
  controllers: [LoyaltyController],
  providers: [LoyaltyService, DatabaseSetupService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}