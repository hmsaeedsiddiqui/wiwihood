import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceAddonsController } from './service-addons.controller';
import { ServiceAddonsService } from './service-addons.service';
import { ServiceAddon, BookingAddon, AddonPackage } from '../../entities/service-addon.entity';
import { ServiceAddonCompatibility } from '../../entities/service-addon-compatibility.entity';
import { Service } from '../../entities/service.entity';
import { Category } from '../../entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceAddon, 
      BookingAddon, 
      AddonPackage, 
      ServiceAddonCompatibility,
      Service, 
      Category
    ]),
  ],
  controllers: [ServiceAddonsController],
  providers: [ServiceAddonsService],
  exports: [ServiceAddonsService],
})
export class ServiceAddonsModule {}