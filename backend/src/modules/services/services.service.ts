import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../entities/service.entity';
import { Category } from '../../entities/category.entity';
import { Provider } from '../../entities/provider.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';

// You'll need to find these enums in your codebase and add the correct import paths
// import { ServiceType } from './enums/service-type.enum';
// import { PricingType } from './enums/pricing-type.enum';

// Temporary enum definitions - replace with actual imports
enum ServiceType {
  APPOINTMENT = 'appointment',
  PRODUCT = 'product',
  PACKAGE = 'package'
}

enum PricingType {
  FIXED = 'fixed',
  VARIABLE = 'variable',
  HOURLY = 'hourly'
}

export enum ServiceStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft'
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  /**
   * Transform service data for frontend consumption
   * For frontend editing, we return public IDs in images field
   */
  private transformServiceForFrontend(service: Service): Service {
    // Create a new service object that preserves getters
    const transformedService = Object.assign(Object.create(Object.getPrototypeOf(service)), service);
    transformedService.images = service.imagesPublicIds || service.images || [];
    return transformedService;
  }

  /**
   * Transform multiple services for frontend consumption
   */
  private transformServicesForFrontend(services: Service[]): Service[] {
    return services.map(service => this.transformServiceForFrontend(service));
  }

  /**
   * Process images - convert between public IDs and URLs
   */
  private async processImages(images: any[], existingPublicIds: string[] = []): Promise<{ imageUrls: string[], imagesPublicIds: string[] }> {
    let imageUrls: string[] = [];
    let imagesPublicIds: string[] = [];

    if (images && Array.isArray(images)) {
      // Check if images are public IDs or URLs
      images.forEach(image => {
        if (typeof image === 'string') {
          if (image.startsWith('http')) {
            // It's already a URL, extract public ID
            const publicId = this.extractPublicIdFromUrl(image);
            if (publicId) {
              imageUrls.push(image);
              imagesPublicIds.push(publicId);
            }
          } else {
            // It's a public ID, convert to URL
            imagesPublicIds.push(image);
            imageUrls.push(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${image}`);
          }
        }
      });
    }

    return { imageUrls, imagesPublicIds };
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  }

  async create(createServiceDto: CreateServiceDto, providerId: string, userId?: string): Promise<Service> {
    try {
      console.log('=== [DEBUG] Incoming createServiceDto:', JSON.stringify(createServiceDto, null, 2));
      console.log('=== [DEBUG] providerId:', providerId, 'userId:', userId);
      const { categoryId, ...serviceData } = createServiceDto;

      // Verify category exists
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      console.log('=== [DEBUG] category:', category);
      if (!category) throw new NotFoundException('Category not found');

      // Verify provider exists
      const provider = await this.providerRepository.findOne({ where: { id: providerId }, relations: ['user'] });
      console.log('=== [DEBUG] provider:', provider);
      if (!provider) throw new NotFoundException('Provider not found');

      // Check if user has permission to create service for this provider
      if (userId && provider.user.id !== userId) throw new ForbiddenException('You can only create services for your own provider profile');

      // Check if service name already exists for this provider
      const existingService = await this.serviceRepository.findOne({
        where: { name: serviceData.name, providerId }
      });
      console.log('=== [DEBUG] existingService:', existingService);
      if (existingService) throw new BadRequestException('Service with this name already exists for this provider');

      // Process images (URLs or public IDs) and cap to 5
      let imagesPublicIds: string[] = [];
      let imageUrls: string[] = [];
      if (Array.isArray(serviceData.images) && serviceData.images.length > 0) {
        // dedupe and cap
        const deduped = Array.from(new Set(serviceData.images.filter(Boolean))).slice(0, 5);
        const processed = await this.processImages(deduped);
        imageUrls = processed.imageUrls.slice(0, 5);
        imagesPublicIds = processed.imagesPublicIds.slice(0, 5);
      }

      // Decide featured image: prefer explicit valid URL, else first processed image URL
      let featuredImage: string | undefined = undefined;
      if (serviceData.featuredImage && typeof serviceData.featuredImage === 'string' && serviceData.featuredImage.startsWith('http')) {
        featuredImage = serviceData.featuredImage;
      } else if (imageUrls.length > 0) {
        featuredImage = imageUrls[0];
      }

      // Only include properties that exist on your Service entity
      const serviceData_clean: Partial<Service> = {
        name: serviceData.name,
        description: serviceData.description,
        shortDescription: serviceData.shortDescription,
        basePrice: serviceData.basePrice,
        durationMinutes: serviceData.durationMinutes,
        categoryId,
        providerId,
        isApproved: false,
        isActive: false,
        // Optional structured fields
        serviceType: (serviceData.serviceType as any) || (ServiceType.APPOINTMENT as any),
        pricingType: (serviceData.pricingType as any) || (PricingType.FIXED as any),
        bufferTimeMinutes: serviceData.bufferTimeMinutes ?? 0,
        maxAdvanceBookingDays: serviceData.maxAdvanceBookingDays ?? 30,
        minAdvanceBookingHours: serviceData.minAdvanceBookingHours ?? 2,
        cancellationPolicyHours: serviceData.cancellationPolicyHours ?? 24,
        requiresDeposit: serviceData.requiresDeposit ?? false,
        depositAmount: serviceData.depositAmount,
        tags: serviceData.tags,
        preparationInstructions: serviceData.preparationInstructions,
        // Frontend display and promotional fields (optional)
        displayLocation: serviceData.displayLocation,
        providerBusinessName: serviceData.providerBusinessName,
        highlightBadge: serviceData.highlightBadge, // provider-provided; admin badge uses adminAssignedBadge
        availableSlots: serviceData.availableSlots,
        promotionText: serviceData.promotionText,
        isFeatured: serviceData.isFeatured ?? false,
        difficultyLevel: serviceData.difficultyLevel,
        specialRequirements: serviceData.specialRequirements,
        includes: serviceData.includes,
        excludes: serviceData.excludes,
        ageRestriction: serviceData.ageRestriction,
        genderPreference: serviceData.genderPreference,
        isPromotional: serviceData.isPromotional ?? false,
        discountPercentage: serviceData.discountPercentage,
        promoCode: serviceData.promoCode,
        dealValidUntil: serviceData.dealValidUntil,
        dealCategory: serviceData.dealCategory,
        dealTitle: serviceData.dealTitle,
        dealDescription: serviceData.dealDescription,
        originalPrice: serviceData.originalPrice,
        minBookingAmount: serviceData.minBookingAmount,
        usageLimit: serviceData.usageLimit,
        dealTerms: serviceData.dealTerms,
        // Images
        images: imageUrls.length ? imageUrls : undefined,
        imagesPublicIds: imagesPublicIds.length ? imagesPublicIds : undefined,
        featuredImage,
      };
      console.log('=== [DEBUG] serviceData_clean:', serviceData_clean);

      const service = this.serviceRepository.create(serviceData_clean);
      const savedService = await this.serviceRepository.save(service);
      console.log('=== [DEBUG] savedService:', savedService);

      return this.transformServiceForFrontend(savedService);
    } catch (err) {
      console.error('=== [ERROR] createService failed:', err);
      throw err;
    }
  }

  async findAll(filters?: ServiceFilterDto): Promise<Service[]> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'user');

    // Only show approved services for public queries (unless specifically filtering for status)
    if (!filters?.status) {
      queryBuilder.andWhere('service.isApproved = :isApproved', { isApproved: true });
      queryBuilder.andWhere('service.isActive = :isActive', { isActive: true });
    }

    // Apply filters
    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
      }
      if (filters.providerId) {
        queryBuilder.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
      }
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('service.isActive = :isActive', { isActive: filters.isActive });
      }
      if (filters.status) {
        queryBuilder.andWhere('service.status = :status', { status: filters.status });
      }
      if (filters.search) {
        queryBuilder.andWhere(
          '(service.name ILIKE :search OR service.description ILIKE :search OR service.shortDescription ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }
      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
      }
    }

    const services = await queryBuilder
      .orderBy('service.createdAt', 'DESC')
      .getMany();

    return this.transformServicesForFrontend(services);
  }

  async findByProvider(providerId: string): Promise<Service[]> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId }
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const services = await this.serviceRepository.find({
      where: { providerId },
      relations: ['category', 'provider'],
      order: {
        createdAt: 'DESC'
      }
    });
    
    return this.transformServicesForFrontend(services);
  }

  async findByCategory(categoryId: string, filters?: any): Promise<Service[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId }
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Build where conditions
    const whereConditions: any = { categoryId };
    
    // Apply filters if provided
    if (filters?.isApproved !== undefined) {
      whereConditions.isApproved = filters.isApproved === 'true' || filters.isApproved === true;
    } else {
      // Default to approved services only
      whereConditions.isApproved = true;
    }
    
    if (filters?.isActive !== undefined) {
      whereConditions.isActive = filters.isActive === 'true' || filters.isActive === true;
    } else {
      // Default to active services only
      whereConditions.isActive = true;
    }
    
    if (filters?.approvalStatus) {
      whereConditions.approvalStatus = filters.approvalStatus;
    } else {
      // Default to approved status only
      whereConditions.approvalStatus = 'APPROVED';
    }

    const services = await this.serviceRepository.find({
      where: whereConditions,
      relations: ['category', 'provider', 'provider.user'],
      order: {
        createdAt: 'DESC'
      }
    });
    
    return this.transformServicesForFrontend(services);
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category', 'provider', 'provider.user'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return this.transformServiceForFrontend(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId?: string): Promise<Service> {
    const service = await this.findOne(id);

    // Check if user has permission to update this service
    if (userId && service.provider?.user?.id !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    const { categoryId, ...updateData } = updateServiceDto;

    // Update category if provided
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      service.categoryId = categoryId;
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== service.name) {
      const existingService = await this.serviceRepository.findOne({
        where: {
          name: updateData.name,
          providerId: service.providerId,
        }
      });
      if (existingService && existingService.id !== id) {
        throw new BadRequestException('Service with this name already exists for this provider');
      }
    }

    // Handle image updates
    if (updateData.images && Array.isArray(updateData.images)) {
      const { imageUrls, imagesPublicIds } = await this.processImages(
        updateData.images,
        service.imagesPublicIds || []
      );

      // Update both fields on the service entity
      service.imagesPublicIds = imagesPublicIds;
      service.images = imageUrls;

      // Remove images from updateData to avoid overwriting our processed data
      delete updateData.images;
    }

    Object.assign(service, updateData);
    service.updatedAt = new Date();

    return this.transformServiceForFrontend(await this.serviceRepository.save(service));
  }

  async remove(id: string, userId?: string): Promise<void> {
    const service = await this.findOne(id);

    // Check if user has permission to delete this service
    if (userId && service.provider?.user?.id !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.serviceRepository.remove(service);
  }

  async toggleActiveStatus(id: string, userId?: string): Promise<Service> {
    const service = await this.findOne(id);

    // Check if user has permission to toggle this service
    if (userId && service.provider?.user?.id !== userId) {
      throw new ForbiddenException('You can only toggle your own services');
    }

    // Only allow activation if service is approved; deactivation always allowed
    if (!service.isApproved && !service.isActive) {
      throw new ForbiddenException('Cannot activate unapproved service');
    }

    service.isActive = !service.isActive;
    service.updatedAt = new Date();

    return this.transformServiceForFrontend(await this.serviceRepository.save(service));
  }

  async searchServices(query: string, filters?: ServiceFilterDto): Promise<Service[]> {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'user')
      .where('service.isActive = :isActive', { isActive: true })
      .andWhere(
        '(LOWER(service.name) LIKE LOWER(:query) OR LOWER(service.description) LIKE LOWER(:query) OR service.tags::text LIKE LOWER(:query))',
        { query: `%${query}%` }
      );

    // Apply filters
    if (filters?.categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters?.providerId) {
      queryBuilder.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.minPrice !== undefined) {
      queryBuilder.andWhere('service.basePrice >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice !== undefined) {
      queryBuilder.andWhere('service.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const results = await queryBuilder
      .orderBy('service.createdAt', 'DESC')
      .getMany();

    return this.transformServicesForFrontend(results);
  }

  async getPopularServices(limit: number = 10): Promise<Service[]> {
    const popularServices = await this.serviceRepository.find({
      where: { isActive: true, isApproved: true },
      relations: ['category', 'provider', 'provider.user'],
      order: {
        createdAt: 'DESC'
      },
      take: limit
    });

    return this.transformServicesForFrontend(popularServices);
  }
}
