import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from '../../entities/favorite.entity';
import { User } from '../../entities/user.entity';
import { Provider } from '../../entities/provider.entity';
import { Service } from '../../entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, User, Provider, Service])
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
