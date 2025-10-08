import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RecurringBookingsController } from './recurring-bookings.controller';
import { RecurringBookingsService } from './recurring-bookings.service';
import { RecurringBooking, RecurringBookingException } from '../../entities/recurring-booking.entity';
import { Booking } from '../../entities/booking.entity';
import { Service } from '../../entities/service.entity';
import { Provider } from '../../entities/provider.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecurringBooking,
      RecurringBookingException, // Re-enabled now that table exists
      Booking,
      Service,
      Provider,
      User,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [RecurringBookingsController],
  providers: [RecurringBookingsService],
  exports: [RecurringBookingsService],
})
export class RecurringBookingsModule {}