import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ServiceStatus } from '../../../entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../../entities/service.entity';
import { AdminApproveServiceDto, AdminServiceFiltersDto, AdminAssignBadgeDto, AdminBulkActionDto } from '../dto/admin-service.dto';

export enum ServiceApprovalStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Injectable()
export class AdminServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  // Get all services with admin controls
  async getAllServices(filters: AdminServiceFiltersDto) {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('service.category', 'category');

    // Apply filters (normalize status to lowercase for robustness)
    if (filters.status) {
      const status = String(filters.status).toLowerCase();
      switch (status) {
        case 'pending_approval':
          queryBuilder.andWhere('service.approvalStatus = :status', { status: 'pending_approval' });
          break;
        case 'approved':
          queryBuilder.andWhere('service.approvalStatus = :status', { status: 'approved' });
          break;
        case 'rejected':
          queryBuilder.andWhere('service.approvalStatus = :status', { status: 'rejected' });
          break;
        case 'active':
          queryBuilder.andWhere('service.isActive = true AND service.isApproved = true');
          break;
        case 'inactive':
          queryBuilder.andWhere('service.isActive = false OR service.isApproved = false');
          break;
      }
    }

    if (filters.categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters.providerId) {
      queryBuilder.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(LOWER(service.name) LIKE LOWER(:search) OR LOWER(service.shortDescription) LIKE LOWER(:search) OR LOWER(provider.businessName) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.hasImages !== undefined) {
      if (filters.hasImages) {
        queryBuilder.andWhere('service.images IS NOT NULL AND JSON_LENGTH(service.images) > 0');
      } else {
        queryBuilder.andWhere('service.images IS NULL OR JSON_LENGTH(service.images) = 0');
      }
    }

    if (filters.priceMin !== undefined) {
      queryBuilder.andWhere('service.basePrice >= :priceMin', { priceMin: filters.priceMin });
    }

    if (filters.priceMax !== undefined) {
      queryBuilder.andWhere('service.basePrice <= :priceMax', { priceMax: filters.priceMax });
    }

    // Sorting
    const sortField = filters.sortBy || 'submittedForApproval';
    const sortOrder = filters.sortOrder || 'DESC';
    
    if (sortField === 'submittedForApproval') {
      queryBuilder.orderBy('service.createdAt', sortOrder);
    } else if (sortField === 'approvalDate') {
      queryBuilder.orderBy('service.approvalDate', sortOrder);
    } else if (sortField === 'name') {
      queryBuilder.orderBy('service.name', sortOrder);
    } else if (sortField === 'price') {
      queryBuilder.orderBy('service.basePrice', sortOrder);
    } else if (sortField === 'provider') {
      queryBuilder.orderBy('provider.businessName', sortOrder);
    }

    // Pagination
    if (filters.page && filters.limit) {
      const skip = (filters.page - 1) * filters.limit;
      queryBuilder.skip(skip).take(filters.limit);
    }

    const [services, total] = await queryBuilder.getManyAndCount();

    // Get statistics
    const stats = await this.getServiceStatistics();

    return {
      services,
      total,
      stats,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 1
    };
  }

  // Get service statistics for admin dashboard
  async getServiceStatistics() {
    const total = await this.serviceRepository.count();
    const pending = await this.serviceRepository.count({ 
      where: { approvalStatus: ServiceStatus.PENDING_APPROVAL } 
    });
    const approved = await this.serviceRepository.count({ 
      where: { approvalStatus: ServiceStatus.APPROVED } 
    });
    const rejected = await this.serviceRepository.count({ 
      where: { approvalStatus: ServiceStatus.REJECTED } 
    });
    const active = await this.serviceRepository.count({ 
      where: { isActive: true, isApproved: true } 
    });

    return {
      total,
      pending,
      approved,
      rejected,
      active,
      inactive: total - active
    };
  }

  // Approve or reject a service
  async approveService(serviceId: string, approvalData: AdminApproveServiceDto, adminId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'category']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Determine approval flag supporting both isApproved and approved
    const isApprovedFlag = (approvalData as any).isApproved ?? (approvalData as any).approved;
    if (typeof isApprovedFlag !== 'boolean') {
      throw new BadRequestException('isApproved must be a boolean value');
    }
    service.isApproved = isApprovedFlag;
    service.approvalStatus = isApprovedFlag ? ServiceStatus.APPROVED : ServiceStatus.REJECTED;
    service.adminComments = approvalData.adminComments || '';
    service.approvedByAdminId = adminId;
    service.approvalDate = new Date();

    // If approved, also activate the service and assign badge/rating if provided
    if (isApprovedFlag) {
      service.isActive = true;
      
      if (approvalData.adminAssignedBadge) {
        service.adminAssignedBadge = approvalData.adminAssignedBadge;
      }
      
      if (approvalData.adminQualityRating) {
        service.adminQualityRating = approvalData.adminQualityRating;
      }
    } else {
      // If rejected, deactivate the service
      service.isActive = false;
    }

    await this.serviceRepository.save(service);

    return {
      success: true,
      message: `Service ${isApprovedFlag ? 'approved and activated' : 'rejected'} successfully`,
      service
    };
  }

  // Assign badge to service
  async assignBadgeToService(serviceId: string, badgeData: AdminAssignBadgeDto, adminId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.adminAssignedBadge = badgeData.badge;
    service.adminQualityRating = badgeData.qualityRating || service.adminQualityRating;
    service.approvedByAdminId = adminId;

    await this.serviceRepository.save(service);

    return {
      success: true,
      message: 'Badge assigned successfully',
      service
    };
  }

  // Toggle service active status (admin only)
  async toggleServiceStatus(serviceId: string, adminId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Only allow activation if service is approved
    if (!service.isApproved && !service.isActive) {
      throw new BadRequestException('Cannot activate unapproved service');
    }

    service.isActive = !service.isActive;
    service.approvedByAdminId = adminId;

    await this.serviceRepository.save(service);

    return {
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      service
    };
  }

  // Set service approval back to pending (admin only)
  async setServicePending(serviceId: string, adminId: string) {
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Move to pending: not approved and inactive
    service.isApproved = false;
    service.isActive = false;
    service.approvalStatus = ServiceStatus.PENDING_APPROVAL;
    service.approvalDate = null as any;
    service.approvedByAdminId = adminId;

    await this.serviceRepository.save(service);

    return {
      success: true,
      message: 'Service moved to pending status successfully',
      service
    };
  }

  // Delete service (admin only)
  async deleteService(serviceId: string, adminId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.remove(service);

    return {
      success: true,
      message: 'Service deleted successfully'
    };
  }

  // Bulk actions for multiple services
  async bulkServiceAction(bulkData: AdminBulkActionDto, adminId: string) {
    const { serviceIds, action } = bulkData;

    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('No service IDs provided');
    }

    const services = await this.serviceRepository.findByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      throw new BadRequestException('Some services not found');
    }

    let updateData: Partial<Service> = {
      approvedByAdminId: adminId
    };

    switch (action) {
      case 'approve':
        updateData = {
          ...updateData,
          isApproved: true,
          isActive: true,
          approvalStatus: ServiceStatus.APPROVED,
          approvalDate: new Date()
        };
        break;
      case 'reject':
        updateData = {
          ...updateData,
          isApproved: false,
          isActive: false,
          approvalStatus: ServiceStatus.REJECTED,
          approvalDate: new Date()
        };
        break;
      case 'activate':
        // Only activate approved services
        const approvedServices = services.filter(s => s.isApproved);
        if (approvedServices.length === 0) {
          throw new BadRequestException('No approved services to activate');
        }
        await this.serviceRepository.update(
          approvedServices.map(s => s.id),
          { isActive: true, approvedByAdminId: adminId }
        );
        return {
          success: true,
          message: `${approvedServices.length} services activated successfully`
        };
      case 'deactivate':
        updateData = {
          ...updateData,
          isActive: false
        };
        break;
      case 'delete':
        await this.serviceRepository.remove(services);
        return {
          success: true,
          message: `${services.length} services deleted successfully`
        };
      default:
        throw new BadRequestException('Invalid bulk action');
    }

    await this.serviceRepository.update(serviceIds, updateData);

    return {
      success: true,
      message: `${services.length} services updated successfully`
    };
  }

  // Get service by ID with full details for admin review
  async getServiceById(serviceId: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'category']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}