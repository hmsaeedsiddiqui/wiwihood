import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Service, ServiceStatus, ServiceType, PricingType } from '../../entities/service.entity';
import { Category } from '../../entities/category.entity';
import { Provider } from '../../entities/provider.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';

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

  async create(createServiceDto: CreateServiceDto, providerId: string, userId?: string): Promise<Service> {
    const { categoryId, ...serviceData } = createServiceDto;

    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId }
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Verify provider exists
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
      relations: ['user']
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check if user has permission to create service for this provider
    if (userId && provider.user.id !== userId) {
      throw new ForbiddenException('You can only create services for your own provider profile');
    }

    // Check if service name already exists for this provider
    const existingService = await this.serviceRepository.findOne({
      where: {
        name: serviceData.name,
        providerId: providerId
      }
    });
    if (existingService) {
      throw new BadRequestException('Service with this name already exists for this provider');
    }

    // Handle image processing - convert public IDs to URLs
    let processedImages: string[] | undefined;
    let processedImagesPublicIds: string[] | undefined;
    
    console.log('Service creation - incoming serviceData.images:', serviceData.images);
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    
    if (serviceData.images && Array.isArray(serviceData.images)) {
      // Frontend sends public IDs in images field
      processedImagesPublicIds = serviceData.images;
      // Convert public IDs to full Cloudinary URLs
      processedImages = serviceData.images.map(publicId => 
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
      );
      console.log('Processed images for DB:', processedImages);
      console.log('Processed public IDs for DB:', processedImagesPublicIds);
    }

    const service = this.serviceRepository.create({
      ...serviceData,
      categoryId,
      providerId,
      images: processedImages,
      imagesPublicIds: processedImagesPublicIds,
      serviceType: serviceData.serviceType as ServiceType || ServiceType.APPOINTMENT,
      pricingType: serviceData.pricingType as PricingType || PricingType.FIXED,
      status: serviceData.status as ServiceStatus || ServiceStatus.PENDING_APPROVAL,
      isApproved: false, // New services require admin approval
      isActive: false, // Inactive until approved
    });

    return this.transformServiceForFrontend(await this.serviceRepository.save(service));
  }

  async findAll(filters?: ServiceFilterDto): Promise<Service[]> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'user');

    // Only show approved services for public queries (unless specifically filtering)
    if (!filters?.status && filters?.isApproved === undefined) {
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

    return services.map(service => this.transformServiceForFrontend(service));
  }
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
      relations: ['category', 'provider', 'provider.user']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.transformServiceForFrontend(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId?: string): Promise<Service> {
    const service = await this.findOne(id);

    // Check if user has permission to update this service
    if (userId && service.provider.user.id !== userId) {
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

    // Handle enum conversions
    if (updateData.serviceType) {
      updateData.serviceType = updateData.serviceType as ServiceType;
    }
    if (updateData.pricingType) {
      updateData.pricingType = updateData.pricingType as PricingType;
    }
    if (updateData.status) {
      updateData.status = updateData.status as ServiceStatus;
    }

    // Handle image processing - convert public IDs to URLs
    if (updateData.images && Array.isArray(updateData.images)) {
      // Frontend sends public IDs in images field
      const imagesPublicIds = updateData.images;
      // Convert public IDs to full Cloudinary URLs
      const imageUrls = updateData.images.map(publicId => 
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
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
    if (userId && service.provider.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.serviceRepository.remove(service);
  }

  async toggleActiveStatus(id: string, userId?: string): Promise<Service> {
    const service = await this.findOne(id);

    // Check if user has permission to toggle this service
    if (userId && service.provider.user.id !== userId) {
      throw new ForbiddenException('You can only toggle your own services');
    }

    service.isActive = !service.isActive;
    service.updatedAt = new Date();

    return this.transformServiceForFrontend(await this.serviceRepository.save(service));
  }

  async searchServices(query: string, filters?: ServiceFilterDto): Promise<Service[]> {
    const where: FindOptionsWhere<Service> = {
      isActive: true,
    };

    // Apply basic filters
    if (filters) {
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.providerId) where.providerId = filters.providerId;
      if (filters.status) where.status = filters.status as ServiceStatus;
    }

    // Search in name, description, and tags
    const services = await this.serviceRepository
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
      services.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters?.providerId) {
      services.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.minPrice !== undefined) {
      services.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice !== undefined) {
      services.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const results = await services
      .orderBy('service.createdAt', 'DESC')
      .getMany();
      
    return this.transformServicesForFrontend(results);
  }

  async getPopularServices(limit: number = 10): Promise<Service[]> {
    // This would typically be based on booking frequency, ratings, etc.
    // For now, we'll return active services ordered by creation date
    const services = await this.serviceRepository.find({
      where: { isActive: true },
      relations: ['category', 'provider', 'provider.user'],
      order: {
        createdAt: 'DESC'
      },
      take: limit
    });
    
    return this.transformServicesForFrontend(services);
  }
}
