import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { ServiceAddonsService } from './service-addons.service';
import { CreateServiceAddonDto, UpdateServiceAddonDto, CreateAddonPackageDto, AddBookingAddonDto } from './dto/service-addon.dto';
import { ServiceAddon, BookingAddon, AddonPackage } from '../../entities/service-addon.entity';

@ApiTags('Service Add-ons')
@Controller('service-addons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceAddonsController {
  constructor(private readonly serviceAddonsService: ServiceAddonsService) {}

  // Provider endpoints
  @Post()
  @ApiOperation({ summary: 'Create service addon (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiResponse({
    status: 201,
    description: 'Addon created successfully',
    type: ServiceAddon,
  })
  async createAddon(
    @Body() createAddonDto: CreateServiceAddonDto,
    @Request() req: any,
  ): Promise<ServiceAddon> {
    return this.serviceAddonsService.createAddon(createAddonDto, req.user.providerId);
  }

  @Get('my-addons')
  @ApiOperation({ summary: 'Get provider addons (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiQuery({ name: 'includeInactive', required: false, description: 'Include inactive addons' })
  @ApiResponse({
    status: 200,
    description: 'Provider addons retrieved successfully',
    type: [ServiceAddon],
  })
  async getProviderAddons(
    @Request() req: any,
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<ServiceAddon[]> {
    return this.serviceAddonsService.getProviderAddons(req.user.providerId, includeInactive);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service addon (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiParam({ name: 'id', description: 'Addon ID' })
  @ApiResponse({
    status: 200,
    description: 'Addon updated successfully',
    type: ServiceAddon,
  })
  async updateAddon(
    @Param('id') id: string,
    @Body() updateAddonDto: UpdateServiceAddonDto,
    @Request() req: any,
  ): Promise<ServiceAddon> {
    return this.serviceAddonsService.updateAddon(id, updateAddonDto, req.user.providerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service addon (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiParam({ name: 'id', description: 'Addon ID' })
  @ApiResponse({
    status: 200,
    description: 'Addon deleted successfully',
  })
  async deleteAddon(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.serviceAddonsService.deleteAddon(id, req.user.providerId);
    return { message: 'Addon deleted successfully' };
  }

  // Customer endpoints
  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get compatible addons for a service' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({
    status: 200,
    description: 'Compatible addons retrieved successfully',
    type: [ServiceAddon],
  })
  async getServiceAddons(@Param('serviceId') serviceId: string): Promise<ServiceAddon[]> {
    return this.serviceAddonsService.getServiceCompatibleAddons(serviceId);
  }

  @Get('recommendations/:serviceId')
  @ApiOperation({ summary: 'Get addon recommendations for a service' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiQuery({ name: 'currentAddons', required: false, description: 'Currently selected addon IDs (comma-separated)' })
  @ApiResponse({
    status: 200,
    description: 'Addon recommendations retrieved successfully',
    type: [ServiceAddon],
  })
  async getAddonRecommendations(
    @Param('serviceId') serviceId: string,
    @Query('currentAddons') currentAddons?: string,
  ): Promise<ServiceAddon[]> {
    const currentAddonIds = currentAddons ? currentAddons.split(',') : [];
    return this.serviceAddonsService.getAddonRecommendations(serviceId, currentAddonIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get addon details' })
  @ApiParam({ name: 'id', description: 'Addon ID' })
  @ApiResponse({
    status: 200,
    description: 'Addon details retrieved successfully',
    type: ServiceAddon,
  })
  async getAddon(@Param('id') id: string): Promise<ServiceAddon> {
    return this.serviceAddonsService.getAddonById(id);
  }

  // Booking addon endpoints
  @Post('booking/:bookingId/addons')
  @ApiOperation({ summary: 'Add addon to booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({
    status: 201,
    description: 'Addon added to booking successfully',
    type: BookingAddon,
  })
  async addAddonToBooking(
    @Param('bookingId') bookingId: string,
    @Body() addAddonDto: AddBookingAddonDto,
  ): Promise<BookingAddon> {
    return this.serviceAddonsService.addAddonToBooking(bookingId, addAddonDto);
  }

  @Get('booking/:bookingId/addons')
  @ApiOperation({ summary: 'Get booking addons' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking addons retrieved successfully',
    type: [BookingAddon],
  })
  async getBookingAddons(@Param('bookingId') bookingId: string): Promise<BookingAddon[]> {
    return this.serviceAddonsService.getBookingAddons(bookingId);
  }

  @Delete('booking/:bookingId/addons/:addonId')
  @ApiOperation({ summary: 'Remove addon from booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiParam({ name: 'addonId', description: 'Addon ID' })
  @ApiResponse({
    status: 200,
    description: 'Addon removed from booking successfully',
  })
  async removeAddonFromBooking(
    @Param('bookingId') bookingId: string,
    @Param('addonId') addonId: string,
  ): Promise<{ message: string }> {
    await this.serviceAddonsService.removeAddonFromBooking(bookingId, addonId);
    return { message: 'Addon removed from booking successfully' };
  }

  @Get('booking/:bookingId/total')
  @ApiOperation({ summary: 'Get booking addons total cost' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking addons total retrieved successfully',
  })
  async getBookingAddonsTotal(@Param('bookingId') bookingId: string): Promise<{ total: number }> {
    const total = await this.serviceAddonsService.calculateBookingAddonsTotal(bookingId);
    return { total };
  }

  // Package endpoints
  @Post('packages')
  @ApiOperation({ summary: 'Create addon package (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiResponse({
    status: 201,
    description: 'Package created successfully',
    type: AddonPackage,
  })
  async createPackage(
    @Body() createPackageDto: CreateAddonPackageDto,
    @Request() req: any,
  ): Promise<AddonPackage> {
    return this.serviceAddonsService.createPackage(createPackageDto, req.user.providerId);
  }

  @Get('packages/my-packages')
  @ApiOperation({ summary: 'Get provider packages (Providers only)' })
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiResponse({
    status: 200,
    description: 'Provider packages retrieved successfully',
    type: [AddonPackage],
  })
  async getProviderPackages(@Request() req: any): Promise<AddonPackage[]> {
    return this.serviceAddonsService.getProviderPackages(req.user.providerId);
  }

  @Get('packages/provider/:providerId')
  @ApiOperation({ summary: 'Get available packages for a provider' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Available packages retrieved successfully',
    type: [AddonPackage],
  })
  async getAvailablePackages(@Param('providerId') providerId: string): Promise<AddonPackage[]> {
    return this.serviceAddonsService.getAvailablePackages(providerId);
  }
}