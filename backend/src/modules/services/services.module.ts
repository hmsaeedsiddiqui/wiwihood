import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from '../../entities/service.entity';
import { Category } from '../../entities/category.entity';
import { Provider } from '../../entities/provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Category, Provider])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
