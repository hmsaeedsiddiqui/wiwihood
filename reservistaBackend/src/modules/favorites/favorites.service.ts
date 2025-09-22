import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { User } from '../../entities/user.entity';
import { Provider } from '../../entities/provider.entity';
import { Service } from '../../entities/service.entity';

@Injectable()
export class FavoritesService {
  private readonly TEST_USER_UUID = '123e4567-e89b-12d3-a456-426614174000';

  constructor(
    @InjectRepository(Favorite)
    private favoriteRepo: Repository<Favorite>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Provider)
    private providerRepo: Repository<Provider>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
  ) {}

  private getActualUserId(userId: string): string {
    return userId === 'test-user-id' ? this.TEST_USER_UUID : userId;
  }

  private async ensureTestUserExists(userId: string): Promise<User> {
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

  async getFavorites(userId: string) {
    await this.ensureTestUserExists(userId);
    const actualUserId = this.getActualUserId(userId);
    
    const favorites = await this.favoriteRepo.find({
      where: { user: { id: actualUserId } },
      relations: ['provider', 'provider.services'],
    });

    return favorites.map(fav => ({
      id: fav.id,
      providerId: fav.provider.id,
      providerName: fav.provider.businessName,
      providerDescription: fav.provider.description,
      providerLogo: fav.provider.logo,
      providerRating: fav.provider.averageRating || 4.5,
      providerReviews: fav.provider.totalReviews || 0,
      address: fav.provider.address,
      city: fav.provider.city,
      services: fav.provider.services?.slice(0, 3).map(service => ({
        id: service.id,
        name: service.name,
        price: service.basePrice,
      })) || [],
      createdAt: fav.createdAt,
    }));
  }

  async addToFavorites(userId: string, providerId: string) {
    const user = await this.ensureTestUserExists(userId);
    const actualUserId = this.getActualUserId(userId);
    
    const provider = await this.providerRepo.findOne({ where: { id: providerId } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check if already favorited
    const existing = await this.favoriteRepo.findOne({
      where: { user: { id: actualUserId }, provider: { id: providerId } }
    });

    if (existing) {
      return { message: 'Provider already in favorites', favorite: existing };
    }

    const favorite = this.favoriteRepo.create({
      user,
      provider,
    });

    await this.favoriteRepo.save(favorite);
    return { message: 'Added to favorites', favorite };
  }

  async removeFromFavorites(userId: string, providerId: string) {
    const actualUserId = this.getActualUserId(userId);
    
    const favorite = await this.favoriteRepo.findOne({
      where: { user: { id: actualUserId }, provider: { id: providerId } }
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepo.remove(favorite);
    return { message: 'Removed from favorites' };
  }

  async isFavorite(userId: string, providerId: string): Promise<boolean> {
    const actualUserId = this.getActualUserId(userId);
    
    const favorite = await this.favoriteRepo.findOne({
      where: { user: { id: actualUserId }, provider: { id: providerId } }
    });

    return !!favorite;
  }

  async clearFavorites(userId: string) {
    const actualUserId = this.getActualUserId(userId);
    
    const favorites = await this.favoriteRepo.find({
      where: { user: { id: actualUserId } }
    });

    await this.favoriteRepo.remove(favorites);
    return { message: 'All favorites cleared' };
  }

  // Service-based favorites for more granular control
  async getFavoriteServices(userId: string) {
    const actualUserId = this.getActualUserId(userId);
    
    // For now, return services from favorite providers
    const favorites = await this.favoriteRepo.find({
      where: { user: { id: actualUserId } },
      relations: ['provider', 'provider.services'],
    });

    const services = [];
    favorites.forEach(fav => {
      if (fav.provider.services) {
        fav.provider.services.forEach(service => {
          services.push({
            id: service.id,
            name: service.name,
            description: service.description,
            basePrice: service.basePrice,
            duration: service.durationMinutes,
            providerId: fav.provider.id,
            providerName: fav.provider.businessName,
            providerLogo: fav.provider.logo,
            image: service.images?.[0] || '/blog1.jpg',
          });
        });
      }
    });

    return services;
  }
}
