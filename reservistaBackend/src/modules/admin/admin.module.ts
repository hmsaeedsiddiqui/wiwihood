import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../../entities/user.entity';
import { Provider } from '../../entities/provider.entity';
import { Booking } from '../../entities/booking.entity';
import { Category } from '../../entities/category.entity';
import { SupportTicket } from '../../entities/support-ticket.entity';
import { SystemSetting } from '../../entities/system-setting.entity';
import { Analytics } from '../../entities/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Provider,
      Booking,
      Category,
      SupportTicket,
      SystemSetting,
      Analytics,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}