import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { 
  ServiceAddon, 
  BookingAddon, 
  AddonPackage,
  AddonType 
} from '../../entities/service-addon.entity';
import { Service } from '../../entities/service.entity';
import { Category } from '../../entities/category.entity';
import { CreateServiceAddonDto, UpdateServiceAddonDto, CreateAddonPackageDto, AddBookingAddonDto } from './dto/service-addon.dto';

@Injectable()
export class ServiceAddonsService {
  constructor(
    @InjectRepository(ServiceAddon)
    private readonly serviceAddonRepository: Repository<ServiceAddon>,
    @InjectRepository(BookingAddon)
    private readonly bookingAddonRepository: Repository<BookingAddon>,
    @InjectRepository(AddonPackage)
    private readonly addonPackageRepository: Repository<AddonPackage>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createAddon(createAddonDto: CreateServiceAddonDto, providerId: string): Promise<ServiceAddon> {
    const { compatibleServiceIds, categoryIds, seasonalStartDate, seasonalEndDate, ...addonData } = createAddonDto;

    // Validate services belong to provider
    if (compatibleServiceIds && compatibleServiceIds.length > 0) {
      const services = await this.serviceRepository.find({
        where: { id: In(compatibleServiceIds), providerId },
      });
      
      if (services.length !== compatibleServiceIds.length) {
        throw new BadRequestException('Some services do not belong to this provider');
      }
    }

    // Validate categories exist
    let categories = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('Some categories do not exist');
      }
    }

    const addon = this.serviceAddonRepository.create({
      ...addonData,
      providerId,
      seasonalStartDate: seasonalStartDate ? new Date(seasonalStartDate) : undefined,
      seasonalEndDate: seasonalEndDate ? new Date(seasonalEndDate) : undefined,
      displayOrder: addonData.displayOrder || 0,
      additionalDuration: addonData.additionalDuration || 0,
      maxQuantity: addonData.maxQuantity || 1,
    });

    const savedAddon = await this.serviceAddonRepository.save(addon);

    // Associate with categories
    if (categories.length > 0) {
      savedAddon.categories = categories;
      await this.serviceAddonRepository.save(savedAddon);
    }

    // Note: Service compatibility will be handled through a separate mechanism
    // since the many-to-many relation is commented out in the entity
    return savedAddon;
  }

  async updateAddon(id: string, updateAddonDto: UpdateServiceAddonDto, providerId: string): Promise<ServiceAddon> {
    const addon = await this.serviceAddonRepository.findOne({
      where: { id, providerId },
      relations: ['categories'],
    });

    if (!addon) {
      throw new NotFoundException('Addon not found or does not belong to this provider');
    }

    const { compatibleServiceIds, categoryIds, seasonalStartDate, seasonalEndDate, ...addonData } = updateAddonDto;

    // Update basic properties
    Object.assign(addon, addonData);

    if (seasonalStartDate) {
      addon.seasonalStartDate = new Date(seasonalStartDate);
    }
    if (seasonalEndDate) {
      addon.seasonalEndDate = new Date(seasonalEndDate);
    }

    // Note: Service compatibility updates are not implemented
    // since the many-to-many relation is commented out

    // Update category associations
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.find({
          where: { id: In(categoryIds) },
        });
        
        if (categories.length !== categoryIds.length) {
          throw new BadRequestException('Some categories do not exist');
        }
        
        addon.categories = categories;
      } else {
        addon.categories = [];
      }
    }

    return await this.serviceAddonRepository.save(addon);
  }

  async getProviderAddons(providerId: string, includeInactive: boolean = false): Promise<ServiceAddon[]> {
    const where: any = { providerId };
    if (!includeInactive) {
      where.isActive = true;
    }

    return await this.serviceAddonRepository.find({
      where,
      relations: ['categories'],
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  async getServiceCompatibleAddons(serviceId: string): Promise<ServiceAddon[]> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Since the many-to-many relation is commented out, 
    // return all active addons from the same provider for now
    const addons = await this.serviceAddonRepository.find({
      where: { 
        providerId: service.providerId,
        isActive: true 
      },
      relations: ['categories'],
    });

    // Filter by seasonal availability
    const now = new Date();
    return addons.filter(addon => {
      if (addon.seasonalStartDate && now < addon.seasonalStartDate) return false;
      if (addon.seasonalEndDate && now > addon.seasonalEndDate) return false;
      return true;
    });
  }

  async getAddonById(id: string): Promise<ServiceAddon> {
    const addon = await this.serviceAddonRepository.findOne({
      where: { id },
      relations: ['categories', 'provider'],
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    return addon;
  }

  async deleteAddon(id: string, providerId: string): Promise<void> {
    const addon = await this.serviceAddonRepository.findOne({
      where: { id, providerId },
    });

    if (!addon) {
      throw new NotFoundException('Addon not found or does not belong to this provider');
    }

    // Soft delete by setting inactive
    addon.isActive = false;
    await this.serviceAddonRepository.save(addon);
  }

  // Booking addon methods
  async addAddonToBooking(bookingId: string, addAddonDto: AddBookingAddonDto): Promise<BookingAddon> {
    const addon = await this.getAddonById(addAddonDto.addonId);
    
    if (!addon.isActive) {
      throw new BadRequestException('Addon is not active');
    }

    const quantity = addAddonDto.quantity || 1;
    
    if (quantity > addon.maxQuantity) {
      throw new BadRequestException(`Maximum quantity for this addon is ${addon.maxQuantity}`);
    }

    const totalPrice = addon.price * quantity;

    const bookingAddon = this.bookingAddonRepository.create({
      bookingId,
      addonId: addAddonDto.addonId,
      quantity,
      priceAtBooking: addon.price,
      totalPrice,
      specialInstructions: addAddonDto.specialInstructions,
    });

    return await this.bookingAddonRepository.save(bookingAddon);
  }

  async getBookingAddons(bookingId: string): Promise<BookingAddon[]> {
    return await this.bookingAddonRepository.find({
      where: { bookingId },
      relations: ['addon'],
    });
  }

  async removeAddonFromBooking(bookingId: string, addonId: string): Promise<void> {
    const bookingAddon = await this.bookingAddonRepository.findOne({
      where: { bookingId, addonId },
    });

    if (!bookingAddon) {
      throw new NotFoundException('Booking addon not found');
    }

    await this.bookingAddonRepository.remove(bookingAddon);
  }

  async calculateBookingAddonsTotal(bookingId: string): Promise<number> {
    const addons = await this.getBookingAddons(bookingId);
    return addons.reduce((total, addon) => total + addon.totalPrice, 0);
  }

  // Package methods
  async createPackage(createPackageDto: CreateAddonPackageDto, providerId: string): Promise<AddonPackage> {
    const { addonIds, validFrom, validUntil, ...packageData } = createPackageDto;

    // Validate addons belong to provider
    const addons = await this.serviceAddonRepository.find({
      where: { id: In(addonIds), providerId, isActive: true },
    });

    if (addons.length !== addonIds.length) {
      throw new BadRequestException('Some addons do not belong to this provider or are inactive');
    }

    // Calculate original price and discount
    const originalPrice = addons.reduce((total, addon) => total + addon.price, 0);
    const discountPercentage = ((originalPrice - packageData.packagePrice) / originalPrice) * 100;

    const addonPackage = this.addonPackageRepository.create({
      ...packageData,
      providerId,
      originalPrice,
      discountPercentage,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
    });

    const savedPackage = await this.addonPackageRepository.save(addonPackage);
    savedPackage.includedAddons = addons;
    
    return await this.addonPackageRepository.save(savedPackage);
  }

  async getProviderPackages(providerId: string): Promise<AddonPackage[]> {
    return await this.addonPackageRepository.find({
      where: { providerId, isActive: true },
      relations: ['includedAddons'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAvailablePackages(providerId: string): Promise<AddonPackage[]> {
    const now = new Date();
    
    const packages = await this.addonPackageRepository.find({
      where: { providerId, isActive: true },
      relations: ['includedAddons'],
    });

    // Filter by validity dates
    return packages.filter(pkg => {
      if (pkg.validFrom && now < pkg.validFrom) return false;
      if (pkg.validUntil && now > pkg.validUntil) return false;
      return true;
    });
  }

  async getAddonRecommendations(serviceId: string, currentAddons: string[] = []): Promise<ServiceAddon[]> {
    const compatibleAddons = await this.getServiceCompatibleAddons(serviceId);
    
    // Filter out already selected addons and return top recommendations
    const recommendations = compatibleAddons
      .filter(addon => !currentAddons.includes(addon.id))
      .sort((a, b) => {
        // Sort by type priority and then by price
        const typePriority = { 
          [AddonType.UPGRADE]: 1, 
          [AddonType.PACKAGE]: 2, 
          [AddonType.INDIVIDUAL]: 3, 
          [AddonType.SEASONAL]: 4 
        };
        
        if (typePriority[a.type] !== typePriority[b.type]) {
          return typePriority[a.type] - typePriority[b.type];
        }
        
        return a.price - b.price;
      })
      .slice(0, 5); // Return top 5 recommendations

    return recommendations;
  }
}