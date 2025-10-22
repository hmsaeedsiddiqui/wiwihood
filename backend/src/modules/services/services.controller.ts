import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Res,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Service } from '../../entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider', 'admin')
  @Post('provider/:providerId')
  async create(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: any,
  ): Promise<Service> {
    return await this.servicesService.create(
      createServiceDto,
      providerId,
      req.user.id,
    );
  }

  @ApiOperation({ summary: 'Get all services with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
    type: [Service],
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Category ID filter' })
  @ApiQuery({ name: 'providerId', required: false, description: 'Provider ID filter' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Active status filter' })
  @ApiQuery({ name: 'status', required: false, description: 'Service status filter' })
  @Get()
  async findAll(@Query() filters: ServiceFilterDto, @Req() req: any, @Res() res: any): Promise<void> {
    console.log('🔍 [ServicesController] GET /services called with query:', req.query);
    console.log('🔍 [ServicesController] Parsed filters:', JSON.stringify(filters, null, 2));
    
    // Set cache control headers to prevent caching issues
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': undefined
    });
    
    try {
      // Direct repository query bypassing problematic service methods
      console.log('🔍 [ServicesController] Fetching services directly from repository...');
      
      // Query database directly with joins for provider business name
      const queryBuilder = this.serviceRepository
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.provider', 'provider')
        .leftJoinAndSelect('service.category', 'category')
        .where('service.isActive = :isActive', { isActive: true })
        .andWhere('service.isApproved = :isApproved', { isApproved: true })
        .orderBy('service.createdAt', 'DESC');

      // Apply additional filters if provided
      if (filters.categoryId) {
        queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
      }
      
      if (filters.providerId) {
        queryBuilder.andWhere('service.providerId = :providerId', { providerId: filters.providerId });
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

      const services = await queryBuilder.getMany();
      
      console.log('🔍 [ServicesController] Direct query returned', services.length, 'services');
      
      // Transform services to include computed fields
      const transformedServices = services.map(service => ({
        ...service,
        // Include provider business name from joined data
        providerBusinessName: service.provider?.businessName || service.providerBusinessName || 'Unknown Business',
        // Transform images to URLs if they're public IDs
        images: service.imagesPublicIds || service.images || [],
        featuredImage: service.featuredImage || (service.images && service.images[0] 
          ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${service.images[0]}`
          : null
        )
      }));
      
      let filteredServices = transformedServices;
      
      console.log('🔍 [ServicesController] Returning', filteredServices.length, 'transformed services');
      
      if (filteredServices.length > 0) {
        console.log('🔍 [ServicesController] Sample service:', {
          name: filteredServices[0].name,
          adminAssignedBadge: filteredServices[0].adminAssignedBadge,
          providerBusinessName: filteredServices[0].providerBusinessName,
          featuredImage: filteredServices[0].featuredImage
        });
      }
      
      res.json(filteredServices);
      
    } catch (error) {
      console.error('🔍 [ServicesController] Error fetching services:', error);
      res.status(500).json({ error: 'Failed to fetch services', details: error.message });
    }
  }

  @ApiOperation({ summary: 'Debug services - get raw count without filters' })
  @Get('debug')
  async debugServices(): Promise<{ count: number; sample: any }> {
    console.log('🔍 [DEBUG] Debug endpoint called');
    const allServices = await this.servicesService.findAllRaw();
    const sample = allServices.length > 0 ? {
      id: allServices[0].id,
      name: allServices[0].name,
      isActive: allServices[0].isActive,
      isApproved: allServices[0].isApproved,
      status: allServices[0].status,
      approvalStatus: allServices[0].approvalStatus
    } : null;
    return { count: allServices.length, sample };
  }

  @ApiOperation({ summary: 'Test direct repository access' })
  @Get('test-direct')
  async testDirect() {
    try {
      console.log('🔍 [TEST-DIRECT] Testing direct repository access...');
      
      // Test direct repository query
      const services = await this.serviceRepository
        .createQueryBuilder('service')
        .where('service.isActive = :isActive', { isActive: true })
        .andWhere('service.isApproved = :isApproved', { isApproved: true })
        .orderBy('service.createdAt', 'DESC')
        .getMany();
      
      console.log('🔍 [TEST-DIRECT] Found', services.length, 'services');
      
      return {
        count: services.length,
        services: services.map(s => ({
          id: s.id,
          name: s.name,
          adminAssignedBadge: s.adminAssignedBadge,
          providerBusinessName: s.providerBusinessName,
          isActive: s.isActive,
          isApproved: s.isApproved
        }))
      };
    } catch (error) {
      console.error('🔍 [TEST-DIRECT] Error:', error);
      return { error: error.message };
    }
  }

  @ApiOperation({ summary: 'Search services' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [Service],
  })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query() filters: ServiceFilterDto,
  ): Promise<Service[]> {
    return await this.servicesService.searchServices(query, filters);
  }

  @ApiOperation({ summary: 'Get popular services' })
  @ApiResponse({
    status: 200,
    description: 'Popular services retrieved successfully',
    type: [Service],
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of services to return' })
  @Get('popular')
  async getPopular(@Query('limit') limit?: number): Promise<Service[]> {
    return await this.servicesService.getPopularServices(limit);
  }

  @ApiOperation({ summary: 'Get services by provider' })
  @ApiResponse({
    status: 200,
    description: 'Provider services retrieved successfully',
    type: [Service],
  })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @Get('provider/:providerId')
  async findByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ): Promise<Service[]> {
    return await this.servicesService.findByProvider(providerId);
  }

  @ApiOperation({ summary: 'Get services by category' })
  @ApiResponse({
    status: 200,
    description: 'Category services retrieved successfully',
    type: [Service],
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'isApproved', required: false, description: 'Filter by approval status' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'approvalStatus', required: false, description: 'Filter by approval status' })
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query() filters?: ServiceFilterDto,
  ): Promise<Service[]> {
    return await this.servicesService.findByCategory(categoryId, filters);
  }

  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Service> {
    return await this.servicesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider', 'admin')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: any,
  ): Promise<Service> {
    return await this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  @ApiOperation({ summary: 'Toggle service active status' })
  @ApiResponse({
    status: 200,
    description: 'Service status toggled successfully',
    type: Service,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider', 'admin')
  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<Service> {
    return await this.servicesService.toggleActiveStatus(id, req.user.id);
  }

  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({
    status: 204,
    description: 'Service deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider', 'admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    await this.servicesService.remove(id, req.user.id);
  }
}
