import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { Commission } from '../../entities';
import { Booking } from '../../entities/booking.entity';
import { Provider } from '../../entities/provider.entity';
import { Payout } from '../../entities/payout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commission,
      Booking,
      Provider,
      Payout,
    ]),
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}