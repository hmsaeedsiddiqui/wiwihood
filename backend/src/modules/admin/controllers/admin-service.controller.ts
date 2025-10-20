import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  Request,
  BadRequestException 
} from '@nestjs/common';
import { AdminServiceService } from '../services/admin-service.service';
import { 
  AdminServiceFiltersDto, 
  AdminApproveServiceDto, 
  AdminAssignBadgeDto, 
  AdminBulkActionDto 
} from '../dto/admin-service.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExecutionContext, UnauthorizedException, UseInterceptors, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interceptor to log incoming headers and guard errors
class LogHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('--- Incoming Request Headers ---');
    console.log(req.headers);
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof UnauthorizedException) {
          console.error('JwtAuthGuard UnauthorizedException:', err.message);
        }
        throw err;
      })
    );
  }
}

@ApiTags('Admin Services')
@ApiBearerAuth()
@Controller('admin/services')
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(LogHeadersInterceptor)
export class AdminServiceController {
  constructor(private readonly adminServiceService: AdminServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services with admin filters and pagination' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  async getAllServices(@Query() filters: AdminServiceFiltersDto) {
    console.log('[ADMIN API] GET /admin/services', filters);
    return this.adminServiceService.getAllServices(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get service statistics for admin dashboard' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getServiceStatistics() {
    console.log('[ADMIN API] GET /admin/services/stats');
    return this.adminServiceService.getServiceStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID with full details for admin review' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getServiceById(@Param('id') serviceId: string) {
    console.log('[ADMIN API] GET /admin/services/:id', serviceId);
    return this.adminServiceService.getServiceById(serviceId);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve or reject a service' })
  @ApiResponse({ status: 200, description: 'Service approval updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async approveService(
    @Param('id') serviceId: string,
    @Body() approvalData: AdminApproveServiceDto,
    @Request() req: any
  ) {
    const adminId = req.user.id;
    console.log('[ADMIN API] POST /admin/services/:id/approve', { serviceId, approvalData, adminId });
    try {
      return await this.adminServiceService.approveService(serviceId, approvalData, adminId);
    } catch (err) {
      console.error('[ADMIN API] ERROR in approveService:', err);
      throw err;
    }
  }

  @Put(':id/badge')
  @ApiOperation({ summary: 'Assign badge to service' })
  @ApiResponse({ status: 200, description: 'Badge assigned successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async assignBadge(
    @Param('id') serviceId: string,
    @Body() badgeData: AdminAssignBadgeDto,
    @Request() req: any
  ) {
    const adminId = req.user.id;
    console.log('[ADMIN API] PUT /admin/services/:id/badge', { serviceId, badgeData, adminId });
    try {
      return await this.adminServiceService.assignBadgeToService(serviceId, badgeData, adminId);
    } catch (err) {
      console.error('[ADMIN API] ERROR in assignBadge:', err);
      throw err;
    }
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle service active status' })
  @ApiResponse({ status: 200, description: 'Service status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Cannot activate unapproved service' })
  async toggleServiceStatus(
    @Param('id') serviceId: string,
    @Request() req: any
  ) {
    const adminId = req.user.id;
    console.log('[ADMIN API] PUT /admin/services/:id/toggle-status', { serviceId, adminId });
    try {
      return await this.adminServiceService.toggleServiceStatus(serviceId, adminId);
    } catch (err) {
      console.error('[ADMIN API] ERROR in toggleServiceStatus:', err);
      throw err;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service (admin only)' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async deleteService(
    @Param('id') serviceId: string,
    @Request() req: any
  ) {
    const adminId = req.user.id;
    console.log('[ADMIN API] DELETE /admin/services/:id', { serviceId, adminId });
    try {
      return await this.adminServiceService.deleteService(serviceId, adminId);
    } catch (err) {
      console.error('[ADMIN API] ERROR in deleteService:', err);
      throw err;
    }
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Perform bulk actions on multiple services' })
  @ApiResponse({ status: 200, description: 'Bulk action completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid bulk action or no services provided' })
  async bulkServiceAction(
    @Body() bulkData: AdminBulkActionDto,
    @Request() req: any
  ) {
    const adminId = req.user.id;
    console.log('[ADMIN API] POST /admin/services/bulk-action', { bulkData, adminId });
    if (!bulkData.serviceIds || bulkData.serviceIds.length === 0) {
      console.error('[ADMIN API] ERROR: No service IDs provided for bulk action');
      throw new BadRequestException('No service IDs provided for bulk action');
    }
    try {
      return await this.adminServiceService.bulkServiceAction(bulkData, adminId);
    } catch (err) {
      console.error('[ADMIN API] ERROR in bulkServiceAction:', err);
      throw err;
    }
  }

  @Get('badges/available')
  @ApiOperation({ summary: 'Get list of available badges for assignment' })
  @ApiResponse({ status: 200, description: 'Available badges retrieved successfully' })
  async getAvailableBadges() {
    return {
      badges: [
        { value: 'New on vividhood', label: 'New on vividhood', description: 'For new services on the platform' },
        { value: 'Popular', label: 'Popular', description: 'Highly booked services' },
        { value: 'Hot Deal', label: 'Hot Deal', description: 'Services with special discounts' },
        { value: 'Best Seller', label: 'Best Seller', description: 'Top performing services' },
        { value: 'Limited Time', label: 'Limited Time', description: 'Time-sensitive offers' },
        { value: 'Premium', label: 'Premium', description: 'High-end luxury services' },
        { value: 'Top Rated', label: 'Top Rated', description: 'Services with excellent reviews' },
        { value: 'Special Offer', label: 'Special Offer', description: 'Services with promotional pricing' }
      ]
    };
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Get count of pending services for admin notifications' })
  @ApiResponse({ status: 200, description: 'Pending count retrieved successfully' })
  async getPendingServicesCount() {
    const stats = await this.adminServiceService.getServiceStatistics();
    return {
      pendingCount: stats.pending
    };
  }

  @Post('export')
  @ApiOperation({ summary: 'Export services data (CSV/Excel)' })
  @ApiResponse({ status: 200, description: 'Export data prepared successfully' })
  async exportServicesData(@Body() filters: AdminServiceFiltersDto) {
    // Remove pagination for export
    const exportFilters = { ...filters, page: undefined, limit: undefined };
    const { services } = await this.adminServiceService.getAllServices(exportFilters);
    
    // Prepare export data
    const exportData = services.map(service => ({
      id: service.id,
      name: service.name,
      provider: service.provider?.businessName || 'Unknown',
      category: service.category?.name || 'Unknown',
      price: service.basePrice,
      duration: service.durationMinutes,
      status: service.approvalStatus,
      isActive: service.isActive,
      badge: service.adminAssignedBadge || 'None',
      qualityRating: service.adminQualityRating || 0,
      submittedAt: service.createdAt,
      approvedAt: service.approvalDate,
      adminComments: service.adminComments || ''
    }));

    return {
      success: true,
      data: exportData,
      totalRecords: exportData.length,
      exportedAt: new Date().toISOString()
    };
  }
}