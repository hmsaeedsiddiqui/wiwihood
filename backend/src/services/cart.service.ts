import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getCart(userId: string) {
    return this.cartRepo.find({ where: { user: { id: userId } }, relations: ['service'] });
  }

  async addToCart(userId: string, serviceId: string, quantity: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!user || !service) throw new Error('User or Service not found');
    let item = await this.cartRepo.findOne({ where: { user: { id: userId }, service: { id: serviceId } } });
    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartRepo.create({ user, service, quantity });
    }
    return this.cartRepo.save(item);
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const item = await this.cartRepo.findOne({ where: { id: cartItemId, user: { id: userId } } });
    if (!item) throw new Error('Cart item not found');
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const item = await this.cartRepo.findOne({ where: { id: cartItemId, user: { id: userId } } });
    if (!item) throw new Error('Cart item not found');
    return this.cartRepo.remove(item);
  }

  async clearCart(userId: string) {
    const items = await this.cartRepo.find({ where: { user: { id: userId } } });
    return this.cartRepo.remove(items);
  }
}
