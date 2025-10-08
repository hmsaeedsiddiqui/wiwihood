import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsPage } from '../../entities/cms-page.entity';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPage])],
  providers: [CmsService],
  controllers: [CmsController],
})
export class CmsModule {}
