import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringAppointmentsService } from './recurring-appointments.service';
import { RecurringAppointmentsController } from './recurring-appointments.controller';
import { RecurringAppointment } from './entities/recurring-appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecurringAppointment])],
  controllers: [RecurringAppointmentsController],
  providers: [RecurringAppointmentsService],
  exports: [RecurringAppointmentsService],
})
export class RecurringAppointmentsModule {}