import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from '../../controllers/cart.controller';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../entities/cart-item.entity';
import { Service } from '../../../../reservistaBackend/src/entities/service.entity';
import { User } from '../../../../reservistaBackend/src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Service, User])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
