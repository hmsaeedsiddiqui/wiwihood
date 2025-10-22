import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ServiceStatus } from '../../../entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
          queryBuilder.andWhere('service.approvalStatus = :status', { status: ServiceStatus.PENDING_APPROVAL });
          break;
        case 'approved':
          queryBuilder.andWhere('service.approvalStatus = :status', { status: ServiceStatus.APPROVED });
          break;
        case 'rejected':
          queryBuilder.andWhere('service.approvalStatus = :status', { status: ServiceStatus.REJECTED });
          break;
        case 'active':
          // Active means approved AND active (visible on homepage)
          queryBuilder.andWhere('service.isActive = true AND service.isApproved = true AND service.approvalStatus = :approvedStatus', 
            { approvedStatus: ServiceStatus.APPROVED });
          break;
        case 'inactive':
          // Inactive means either not active OR not approved (hidden from homepage)
          queryBuilder.andWhere('(service.isActive = false OR service.isApproved = false OR service.approvalStatus != :approvedStatus)', 
            { approvedStatus: ServiceStatus.APPROVED });
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
    console.log('[AdminServiceService] Fetching service statistics');
    
    try {
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
      
      // Active services are those that are both approved and active (visible on homepage)
      const active = await this.serviceRepository.count({ 
        where: { 
          isActive: true, 
          isApproved: true,
          approvalStatus: ServiceStatus.APPROVED 
        } 
      });

      const stats = {
        total,
        pending,
        approved,
        rejected,
        active,
        inactive: total - active
      };

      console.log('[AdminServiceService] Service statistics:', stats);
      return stats;
    } catch (error) {
      console.error('[AdminServiceService] Error fetching service statistics:', error);
      // Return safe defaults on error
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        active: 0,
        inactive: 0
      };
    }
  }

  // Approve or reject a service
  async approveService(serviceId: string, approvalData: AdminApproveServiceDto, adminId: string) {
    console.log(`[AdminServiceService] Approving/Rejecting service ${serviceId}`, { approvalData, adminId });
    
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

    // Update service approval status and related fields
    service.isApproved = isApprovedFlag;
    service.approvalStatus = isApprovedFlag ? ServiceStatus.APPROVED : ServiceStatus.REJECTED;
    service.status = isApprovedFlag ? ServiceStatus.APPROVED : ServiceStatus.REJECTED;
    service.adminComments = approvalData.adminComments || service.adminComments || '';
    service.approvedByAdminId = adminId;
    service.approvalDate = new Date();

    // If approved, activate the service and assign badge/rating if provided
    if (isApprovedFlag) {
      service.isActive = true; // Approved services are automatically activated
      
      if (approvalData.adminAssignedBadge) {
        service.adminAssignedBadge = approvalData.adminAssignedBadge;
      }
      
      if (approvalData.adminQualityRating && approvalData.adminQualityRating >= 1 && approvalData.adminQualityRating <= 5) {
        service.adminQualityRating = approvalData.adminQualityRating;
      }
    } else {
      // If rejected, deactivate the service (won't appear on homepage)
      service.isActive = false;
      // Clear badge and rating for rejected services
      service.adminAssignedBadge = null;
      service.adminQualityRating = null;
    }

    // Save to database with error handling
    try {
      const updatedService = await this.serviceRepository.save(service);
      console.log(`[AdminServiceService] Service ${serviceId} ${isApprovedFlag ? 'approved and activated' : 'rejected and deactivated'}`);
      
      return {
        success: true,
        message: `Service ${isApprovedFlag ? 'approved and activated' : 'rejected'} successfully`,
        service: updatedService
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error saving service ${serviceId}:`, error);
      throw new BadRequestException('Failed to update service status in database');
    }
  }

  // Assign badge to service
  async assignBadgeToService(serviceId: string, badgeData: AdminAssignBadgeDto, adminId: string) {
    console.log(`[AdminServiceService] Assigning badge "${badgeData.badge}" to service ${serviceId} by admin ${adminId}`);
    
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'category']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const previousBadge = service.adminAssignedBadge;
    service.adminAssignedBadge = badgeData.badge;
    
    // Only update quality rating if provided and valid
    if (badgeData.qualityRating && badgeData.qualityRating >= 1 && badgeData.qualityRating <= 5) {
      service.adminQualityRating = badgeData.qualityRating;
    }
    
    service.approvedByAdminId = adminId;

    try {
      const updatedService = await this.serviceRepository.save(service);
      
      const badgeMessage = previousBadge 
        ? `Badge changed from "${previousBadge}" to "${badgeData.badge}"`
        : `Badge "${badgeData.badge}" assigned`;
        
      console.log(`[AdminServiceService] ${badgeMessage} for service ${serviceId}`);

      return {
        success: true,
        message: `${badgeMessage} successfully`,
        service: updatedService
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error assigning badge to service ${serviceId}:`, error);
      throw new BadRequestException('Failed to assign badge in database');
    }
  }

  // Toggle service active status (admin only)
  async toggleServiceStatus(serviceId: string, adminId: string) {
    console.log(`[AdminServiceService] Toggling status for service ${serviceId} by admin ${adminId}`);
    
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'category']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Only allow activation if service is approved
    if (!service.isApproved && !service.isActive) {
      throw new BadRequestException('Cannot activate unapproved service. Service must be approved first.');
    }

    // Only allow activation if service approval status is APPROVED
    if (!service.isActive && service.approvalStatus !== ServiceStatus.APPROVED) {
      throw new BadRequestException('Cannot activate service that is not approved. Please approve the service first.');
    }

    const wasActive = service.isActive;
    service.isActive = !service.isActive;
    service.approvedByAdminId = adminId;

    try {
      const updatedService = await this.serviceRepository.save(service);
      
      const statusMessage = updatedService.isActive ? 'activated' : 'deactivated';
      const visibilityMessage = updatedService.isActive 
        ? 'Service is now visible on homepage' 
        : 'Service is now hidden from homepage';
        
      console.log(`[AdminServiceService] Service ${serviceId} ${statusMessage}. ${visibilityMessage}`);

      return {
        success: true,
        message: `Service ${statusMessage} successfully. ${visibilityMessage}.`,
        service: updatedService
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error toggling service status ${serviceId}:`, error);
      throw new BadRequestException('Failed to update service status in database');
    }
  }

  // Set service approval back to pending (admin only)
  async setServicePending(serviceId: string, adminId: string) {
    console.log(`[AdminServiceService] Setting service ${serviceId} to pending by admin ${adminId}`);
    
    const service = await this.serviceRepository.findOne({ 
      where: { id: serviceId },
      relations: ['provider', 'category']
    });
    
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Move to pending: not approved and inactive (hidden from homepage)
    service.isApproved = false;
    service.isActive = false;
    service.approvalStatus = ServiceStatus.PENDING_APPROVAL;
    service.status = ServiceStatus.PENDING_APPROVAL;
    service.approvalDate = null as any;
    service.approvedByAdminId = adminId;
    // Clear admin comments when moving back to pending
    service.adminComments = '';

    try {
      const updatedService = await this.serviceRepository.save(service);
      console.log(`[AdminServiceService] Service ${serviceId} moved to pending status and deactivated`);

      return {
        success: true,
        message: 'Service moved to pending status successfully. Service is now hidden from homepage until re-approved.',
        service: updatedService
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error setting service ${serviceId} to pending:`, error);
      throw new BadRequestException('Failed to update service status in database');
    }
  }

  // Delete service (admin only) - permanently remove from database
  async deleteService(serviceId: string, adminId: string) {
    console.log(`[AdminServiceService] Deleting service ${serviceId} by admin ${adminId}`);
    
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'category']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const serviceName = service.name;
    const providerName = service.provider?.businessName || 'Unknown Provider';

    try {
      // Permanently delete from database
      await this.serviceRepository.remove(service);
      console.log(`[AdminServiceService] Service "${serviceName}" from ${providerName} permanently deleted by admin ${adminId}`);

      return {
        success: true,
        message: `Service "${serviceName}" permanently deleted from database`
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error deleting service ${serviceId}:`, error);
      throw new BadRequestException('Failed to delete service from database');
    }
  }

  // Bulk actions for multiple services
  async bulkServiceAction(bulkData: AdminBulkActionDto, adminId: string) {
    const { serviceIds, action } = bulkData;
    console.log(`[AdminServiceService] Performing bulk action "${action}" on ${serviceIds.length} services by admin ${adminId}`);

    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('No service IDs provided');
    }

    const services = await this.serviceRepository.find({
      where: { id: In(serviceIds) },
      relations: ['provider', 'category']
    });

    if (services.length !== serviceIds.length) {
      const foundIds = services.map(s => s.id);
      const missingIds = serviceIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Some services not found: ${missingIds.join(', ')}`);
    }

    let updateData: Partial<Service> = {
      approvedByAdminId: adminId
    };
    let actionMessage = '';

    try {
      switch (action) {
        case 'approve':
          updateData = {
            ...updateData,
            isApproved: true,
            isActive: true, // Approved services are automatically activated
            approvalStatus: ServiceStatus.APPROVED,
            status: ServiceStatus.APPROVED,
            approvalDate: new Date()
          };
          actionMessage = 'approved and activated';
          break;
          
        case 'reject':
          updateData = {
            ...updateData,
            isApproved: false,
            isActive: false, // Rejected services are deactivated (hidden from homepage)
            approvalStatus: ServiceStatus.REJECTED,
            status: ServiceStatus.REJECTED,
            approvalDate: new Date(),
            adminAssignedBadge: null, // Clear badges for rejected services
            adminQualityRating: null
          };
          actionMessage = 'rejected and deactivated';
          break;
          
        case 'activate':
          // Only activate approved services
          const approvedServices = services.filter(s => s.isApproved && s.approvalStatus === ServiceStatus.APPROVED);
          if (approvedServices.length === 0) {
            throw new BadRequestException('No approved services to activate. Services must be approved before activation.');
          }
          
          const unapprovedCount = services.length - approvedServices.length;
          await this.serviceRepository.update(
            approvedServices.map(s => s.id),
            { isActive: true, approvedByAdminId: adminId }
          );
          
          let activateMessage = `${approvedServices.length} approved services activated successfully`;
          if (unapprovedCount > 0) {
            activateMessage += `. ${unapprovedCount} unapproved services skipped.`;
          }
          
          console.log(`[AdminServiceService] Bulk activate: ${activateMessage}`);
          return {
            success: true,
            message: activateMessage + ' Activated services are now visible on homepage.'
          };
          
        case 'deactivate':
          updateData = {
            ...updateData,
            isActive: false // Deactivated services are hidden from homepage
          };
          actionMessage = 'deactivated (hidden from homepage)';
          break;
          
        case 'delete':
          // Permanently delete from database
          const serviceNames = services.map(s => s.name).join(', ');
          await this.serviceRepository.remove(services);
          console.log(`[AdminServiceService] Bulk delete: ${services.length} services permanently deleted: ${serviceNames}`);
          return {
            success: true,
            message: `${services.length} services permanently deleted from database`
          };
          
        default:
          throw new BadRequestException(`Invalid bulk action: ${action}`);
      }

      // Perform the bulk update for non-delete actions
      await this.serviceRepository.update(serviceIds, updateData);
      
      console.log(`[AdminServiceService] Bulk ${action}: ${services.length} services ${actionMessage}`);
      
      // Add homepage visibility message for relevant actions
      let visibilityNote = '';
      if (action === 'approve') {
        visibilityNote = ' Services are now visible on homepage.';
      } else if (action === 'reject' || action === 'deactivate') {
        visibilityNote = ' Services are now hidden from homepage.';
      }

      return {
        success: true,
        message: `${services.length} services ${actionMessage} successfully.${visibilityNote}`
      };
    } catch (error) {
      console.error(`[AdminServiceService] Error performing bulk action "${action}":`, error);
      throw new BadRequestException(`Failed to perform bulk ${action} operation`);
    }
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