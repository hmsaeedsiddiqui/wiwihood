import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service, ServiceStatus } from '../../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { Provider } from '../../entities/provider.entity';
import { Category } from '../../entities/category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new service - sets initial status as pending approval
   */
  async create(createServiceDto: CreateServiceDto, providerId: string, userId: string): Promise<Service> {
    try {
      const provider = await this.providerRepository.findOne({ where: { id: providerId } });
      if (!provider) {
        throw new NotFoundException('Provider not found');
      }

      const category = await this.categoryRepository.findOne({ where: { id: createServiceDto.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const service = this.serviceRepository.create({
        ...createServiceDto,
        providerId,
        // Set initial status for admin approval
        isApproved: false,
        isActive: false,
        approvalStatus: ServiceStatus.PENDING_APPROVAL,
        status: ServiceStatus.PENDING_APPROVAL,
      });

      return await this.serviceRepository.save(service);
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  /**
   * Find all services for homepage - only approved and active services
   */
  async findAll(filters: ServiceFilterDto): Promise<Service[]> {
    try {
      const queryBuilder = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.provider', 'provider')
        .leftJoinAndSelect('service.category', 'category')
        // Homepage only shows approved and active services
        .where('service.isActive = :isActive', { isActive: true })
        .andWhere('service.isApproved = :isApproved', { isApproved: true })
        .andWhere('service.approvalStatus = :approvalStatus', { approvalStatus: ServiceStatus.APPROVED });

      // Apply additional filters
      if (filters.categoryId) {
        queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
      }

      if (filters.providerId) {
        queryBuilder.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(LOWER(service.name) LIKE LOWER(:search) OR LOWER(service.shortDescription) LIKE LOWER(:search))',
          { search: `%${filters.search}%` }
        );
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      // Order by featured first, then by creation date
      queryBuilder.orderBy('service.isFeatured', 'DESC')
        .addOrderBy('service.createdAt', 'DESC');

      const services = await queryBuilder.getMany();
      return services;
    } catch (error) {
      console.error('Error finding services:', error);
      return [];
    }
  }

  /**
   * Find all services (raw) - for admin purposes
   */
  async findAllRaw(): Promise<Service[]> {
    try {
      return await this.serviceRepository.find({
        relations: ['provider', 'category'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error finding raw services:', error);
      return [];
    }
  }

  /**
   * Find service by ID
   */
  async findOne(id: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: ['provider', 'category']
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      return service;
    } catch (error) {
      console.error('Error finding service:', error);
      throw error;
    }
  }

  /**
   * Find services by provider
   */
  async findByProvider(providerId: string): Promise<Service[]> {
    try {
      return await this.serviceRepository.find({
        where: { providerId },
        relations: ['provider', 'category'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error finding services by provider:', error);
      return [];
    }
  }

  /**
   * Find services by category - only show approved and active for public
   */
  async findByCategory(categoryId: string, filters?: ServiceFilterDto): Promise<Service[]> {
    try {
      const queryBuilder = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.provider', 'provider')
        .leftJoinAndSelect('service.category', 'category')
        .where('service.categoryId = :categoryId', { categoryId })
        // Only show approved and active services for public
        .andWhere('service.isActive = :isActive', { isActive: true })
        .andWhere('service.isApproved = :isApproved', { isApproved: true })
        .andWhere('service.approvalStatus = :approvalStatus', { approvalStatus: ServiceStatus.APPROVED });

      // Apply additional filters if provided
      if (filters?.search) {
        queryBuilder.andWhere(
          '(LOWER(service.name) LIKE LOWER(:search) OR LOWER(service.shortDescription) LIKE LOWER(:search))',
          { search: `%${filters.search}%` }
        );
      }

      queryBuilder.orderBy('service.isFeatured', 'DESC')
        .addOrderBy('service.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error finding services by category:', error);
      return [];
    }
  }

  /**
   * Search services - only show approved and active for public
   */
  async searchServices(query: string, filters: ServiceFilterDto): Promise<Service[]> {
    try {
      const queryBuilder = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.provider', 'provider')
        .leftJoinAndSelect('service.category', 'category')
        // Only search in approved and active services
        .where('service.isActive = :isActive', { isActive: true })
        .andWhere('service.isApproved = :isApproved', { isApproved: true })
        .andWhere('service.approvalStatus = :approvalStatus', { approvalStatus: ServiceStatus.APPROVED })
        .andWhere(
          '(LOWER(service.name) LIKE LOWER(:query) OR LOWER(service.shortDescription) LIKE LOWER(:query) OR LOWER(service.description) LIKE LOWER(:query) OR LOWER(provider.businessName) LIKE LOWER(:query))',
          { query: `%${query}%` }
        );

      // Apply filters
      if (filters.categoryId) {
        queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      queryBuilder.orderBy('service.isFeatured', 'DESC')
        .addOrderBy('service.totalBookings', 'DESC')
        .addOrderBy('service.averageRating', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error searching services:', error);
      return [];
    }
  }

  /**
   * Get popular services - only approved and active
   */
  async getPopularServices(limit: number = 10): Promise<Service[]> {
    try {
      return await this.serviceRepository.find({
        where: {
          isActive: true,
          isApproved: true,
          approvalStatus: ServiceStatus.APPROVED
        },
        relations: ['provider', 'category'],
        order: {
          totalBookings: 'DESC',
          averageRating: 'DESC',
          createdAt: 'DESC'
        },
        take: limit
      });
    } catch (error) {
      console.error('Error getting popular services:', error);
      return [];
    }
  }

  /**
   * Update service (provider can update, but requires re-approval for major changes)
   */
  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: ['provider']
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Check if user owns this service (assuming userId corresponds to provider)
      // You might need to adjust this logic based on your auth system
      
      // Major changes that require re-approval
      const majorChangeFields = ['name', 'description', 'basePrice', 'categoryId'];
      const hasMajorChanges = majorChangeFields.some(field => 
        updateServiceDto[field] !== undefined && updateServiceDto[field] !== service[field]
      );

      // Update the service
      Object.assign(service, updateServiceDto);

      // If major changes, require re-approval
      if (hasMajorChanges) {
        service.isApproved = false;
        service.isActive = false;
        service.approvalStatus = ServiceStatus.PENDING_APPROVAL;
        service.approvalDate = null as any;
        service.adminComments = null as any;
      }

      return await this.serviceRepository.save(service);
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  /**
   * Toggle active status - only for approved services
   */
  async toggleActiveStatus(id: string, userId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Only approved services can be activated
      if (!service.isApproved && !service.isActive) {
        throw new BadRequestException('Service must be approved before it can be activated');
      }

      service.isActive = !service.isActive;
      return await this.serviceRepository.save(service);
    } catch (error) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  }

  /**
   * Remove/delete service
   */
  async remove(id: string, userId: string): Promise<void> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Check ownership if needed
      await this.serviceRepository.remove(service);
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  }

  /**
   * Admin Methods for Service Management
   */

  /**
   * Approve service by admin - sets isApproved=true, isActive=true, approvalStatus=APPROVED
   */
  async approveService(id: string, adminId: string, comments?: string, badge?: string, rating?: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: ['provider', 'category']
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Approve and activate the service
      service.isApproved = true;
      service.isActive = true;
      service.approvalStatus = ServiceStatus.APPROVED;
      service.status = ServiceStatus.APPROVED;
      service.approvedByAdminId = adminId;
      service.approvalDate = new Date();

      if (comments) {
        service.adminComments = comments;
      }

      if (badge) {
        service.adminAssignedBadge = badge;
      }

      if (rating && rating >= 1 && rating <= 5) {
        service.adminQualityRating = rating;
      }

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Service ${id} approved by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error approving service:', error);
      throw error;
    }
  }

  /**
   * Reject service by admin - sets isApproved=false, isActive=false, approvalStatus=REJECTED
   */
  async rejectService(id: string, adminId: string, comments?: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: ['provider', 'category']
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Reject and deactivate the service
      service.isApproved = false;
      service.isActive = false;
      service.approvalStatus = ServiceStatus.REJECTED;
      service.status = ServiceStatus.REJECTED;
      service.approvedByAdminId = adminId;
      service.approvalDate = new Date();

      if (comments) {
        service.adminComments = comments;
      }

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Service ${id} rejected by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error rejecting service:', error);
      throw error;
    }
  }

  /**
   * Set service back to pending approval
   */
  async setPendingApproval(id: string, adminId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Reset to pending approval
      service.isApproved = false;
      service.isActive = false;
      service.approvalStatus = ServiceStatus.PENDING_APPROVAL;
      service.status = ServiceStatus.PENDING_APPROVAL;
      service.approvedByAdminId = adminId;
      service.approvalDate = null as any;

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Service ${id} set to pending by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error setting service to pending:', error);
      throw error;
    }
  }

  /**
   * Admin activate service - only works for approved services
   */
  async adminActivateService(id: string, adminId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      if (!service.isApproved || service.approvalStatus !== ServiceStatus.APPROVED) {
        throw new BadRequestException('Service must be approved before it can be activated');
      }

      service.isActive = true;
      service.approvedByAdminId = adminId;

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Service ${id} activated by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error activating service:', error);
      throw error;
    }
  }

  /**
   * Admin deactivate service - hides from homepage but keeps approval status
   */
  async adminDeactivateService(id: string, adminId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      service.isActive = false;
      service.approvedByAdminId = adminId;

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Service ${id} deactivated by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error deactivating service:', error);
      throw error;
    }
  }

  /**
   * Admin delete service - permanently remove from database
   */
  async adminDeleteService(id: string, adminId: string): Promise<void> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      await this.serviceRepository.remove(service);
      console.log(`Service ${id} permanently deleted by admin ${adminId}`);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  /**
   * Assign badge to service
   */
  async assignBadge(id: string, badge: string, adminId: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      service.adminAssignedBadge = badge;
      service.approvedByAdminId = adminId;

      const updatedService = await this.serviceRepository.save(service);
      console.log(`Badge "${badge}" assigned to service ${id} by admin ${adminId}`);
      return updatedService;
    } catch (error) {
      console.error('Error assigning badge:', error);
      throw error;
    }
  }

  /**
   * Get services for homepage - only approved and active
   */
  async getHomepageServices(): Promise<Service[]> {
    try {
      return await this.serviceRepository.find({
        where: {
          isActive: true,
          isApproved: true,
          approvalStatus: ServiceStatus.APPROVED
        },
        relations: ['provider', 'category'],
        order: {
          isFeatured: 'DESC',
          totalBookings: 'DESC',
          averageRating: 'DESC',
          createdAt: 'DESC'
        }
      });
    } catch (error) {
      console.error('Error getting homepage services:', error);
      return [];
    }
  }
}
