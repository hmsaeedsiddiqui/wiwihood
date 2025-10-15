import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminServiceController } from './controllers/admin-service.controller';
import { AdminServiceService } from './services/admin-service.service';
import { User } from '../../entities/user.entity';
import { Provider } from '../../entities/provider.entity';
import { Booking } from '../../entities/booking.entity';
import { Category } from '../../entities/category.entity';
import { Service } from '../../entities/service.entity';
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
      Service,
      SupportTicket,
      SystemSetting,
      Analytics,
    ]),
  ],
  controllers: [AdminController, AdminServiceController],
  providers: [AdminService, AdminServiceService],
  exports: [AdminService, AdminServiceService],
})
export class AdminModule {}