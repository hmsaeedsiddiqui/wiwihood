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

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

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
  async findAll(@Query() filters: ServiceFilterDto): Promise<Service[]> {
    return await this.servicesService.findAll(filters);
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
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<Service[]> {
    return await this.servicesService.findByCategory(categoryId);
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
