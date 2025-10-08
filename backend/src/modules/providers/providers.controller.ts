import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { ProvidersListResponseDto } from './dto/providers-list-response.dto';

import { ProviderStatus } from '../../entities/provider.entity';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new provider profile' })
  @ApiResponse({
    status: 201,
    description: 'Provider successfully created',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async create(
    @Request() req,
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<ProviderResponseDto> {
    return this.providersService.create(req.user.id, createProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'status', required: false, enum: ProviderStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Filter by location' })
  @ApiResponse({
    status: 200,
    description: 'Providers retrieved successfully',
    type: ProvidersListResponseDto,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: ProviderStatus,
    @Query('categoryId') categoryId?: string,
    @Query('location') location?: string,
  ): Promise<ProvidersListResponseDto> {
    return this.providersService.findAll(page, limit, search, status, categoryId, location);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider dashboard stats' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
  })
  async getDashboardStats(@Request() req) {
    return this.providersService.getDashboardStats(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user provider profile' })
  @ApiResponse({
    status: 200,
    description: 'Provider profile retrieved successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider profile not found',
  })
  async getCurrentProvider(@Request() req): Promise<ProviderResponseDto> {
    return this.providersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider by ID' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider retrieved successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProviderResponseDto> {
    return this.providersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current provider profile' })
  @ApiResponse({
    status: 200,
    description: 'Provider profile updated successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider profile not found',
  })
  async updateCurrentProvider(
    @Request() req,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.providersService.findByUserId(req.user.id);
    return this.providersService.update(provider.id, updateProviderDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider updated successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ProviderResponseDto> {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete provider by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.providersService.remove(id);
    return { message: 'Provider deleted successfully' };
  }

  @Get('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability retrieved successfully',
  })
  async getMyAvailability(@Request() req): Promise<any> {
    return this.providersService.getAvailability(req.user.sub);
  }

  @Post('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability updated successfully',
  })
  async updateMyAvailability(@Request() req, @Body() availabilityData: any): Promise<any> {
    return this.providersService.updateAvailability(req.user.sub, availabilityData);
  }
}
