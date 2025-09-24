import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../entities/booking.entity';
import { Service } from '../../entities/service.entity';
import { Provider } from '../../entities/provider.entity';
import { User } from '../../entities/user.entity';
import { ProviderWorkingHours } from '../../entities/provider-working-hours.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Service, Provider, User, ProviderWorkingHours]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
