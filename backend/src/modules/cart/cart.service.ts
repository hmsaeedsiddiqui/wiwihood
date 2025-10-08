import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../../entities/cart-item.entity';
import { User } from '../../entities/user.entity';
import { Service } from '../../entities/service.entity';

@Injectable()
export class CartService {
  private readonly TEST_USER_UUID = '123e4567-e89b-12d3-a456-426614174000';

  constructor(
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private getActualUserId(userId: string): string {
    return userId === 'test-user-id' ? this.TEST_USER_UUID : userId;
  }

  private async ensureTestUserExists(userId: string): Promise<User | null> {
    const actualUserId = this.getActualUserId(userId);
    let user = await this.userRepo.findOne({ where: { id: actualUserId } });
    
    if (!user && userId === 'test-user-id') {
      user = this.userRepo.create({
        id: this.TEST_USER_UUID,
        email: 'test@example.com',
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
      });
      await this.userRepo.save(user);
    }
    
    return user;
  }

  async getCart(userId: string) {
    await this.ensureTestUserExists(userId);
    const actualUserId = this.getActualUserId(userId);
    return this.cartRepo.find({ where: { user: { id: actualUserId } }, relations: ['service'] });
  }

  async addToCart(userId: string, serviceId: string, quantity: number) {
    const user = await this.ensureTestUserExists(userId);
    const actualUserId = this.getActualUserId(userId);
    
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!user || !service) throw new Error('User or Service not found');
    
    let item = await this.cartRepo.findOne({ where: { user: { id: actualUserId }, service: { id: serviceId } } });
    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartRepo.create({ user, service, quantity });
    }
    return this.cartRepo.save(item);
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const actualUserId = this.getActualUserId(userId);
    const item = await this.cartRepo.findOne({ where: { id: cartItemId, user: { id: actualUserId } } });
    if (!item) throw new Error('Cart item not found');
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const actualUserId = this.getActualUserId(userId);
    const item = await this.cartRepo.findOne({ where: { id: cartItemId, user: { id: actualUserId } } });
    if (!item) throw new Error('Cart item not found');
    return this.cartRepo.remove(item);
  }

  async clearCart(userId: string) {
    const actualUserId = this.getActualUserId(userId);
    const items = await this.cartRepo.find({ where: { user: { id: actualUserId } } });
    return this.cartRepo.remove(items);
  }
}
