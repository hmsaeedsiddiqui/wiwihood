import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { GoogleCalendarToken } from '../../entities/google-calendar-token.entity';
import { Booking } from '../../entities/booking.entity';
import { RecurringBooking } from '../../entities/recurring-booking.entity';
import { CalendarService } from './calendar.service';
import { GoogleCalendarService } from './google-calendar.service';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent, GoogleCalendarToken, Booking, RecurringBooking])],
  providers: [CalendarService, GoogleCalendarService],
  controllers: [CalendarController],
  exports: [CalendarService, GoogleCalendarService],
})
export class CalendarModule {}
