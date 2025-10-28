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
import { AvailabilityService } from './availability.service';
import {
  CreateWorkingHoursDto,
  UpdateWorkingHoursDto,
  CreateBlockedTimeDto,
  UpdateBlockedTimeDto,
  GenerateTimeSlotsDto,
} from './dto/index';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { ProviderWorkingHours } from '../../entities/provider-working-hours.entity';
import { ProviderBlockedTime } from '../../entities/provider-blocked-time.entity';
import { ProviderTimeSlot } from '../../entities/provider-time-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../../entities/provider.entity';

@ApiTags('Provider Availability')
@Controller('providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  private async getProviderIdFromUser(userId: string): Promise<string> {
    const provider = await this.providerRepository.findOne({
      where: { userId },
    });
    
    if (!provider) {
      throw new Error('Provider not found for user');
    }
    
    return provider.id;
  }

  // =================== WORKING HOURS ENDPOINTS ===================

  @ApiOperation({ summary: 'Get provider working hours' })
  @ApiResponse({
    status: 200,
    description: 'Working hours retrieved successfully',
    type: [ProviderWorkingHours],
  })
  @Roles('provider', 'admin')
  @Get('me/availability/working-hours')
  async getWorkingHours(@Req() req: any): Promise<ProviderWorkingHours[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getWorkingHours(providerId);
  }

  @ApiOperation({ summary: 'Create or update working hours for all days' })
  @ApiResponse({
    status: 201,
    description: 'Working hours created/updated successfully',
    type: [ProviderWorkingHours],
  })
  @Roles('provider', 'admin')
  @Post('me/availability/working-hours')
  async createOrUpdateWorkingHours(
    @Body() createWorkingHoursDto: CreateWorkingHoursDto[],
    @Req() req: any,
  ): Promise<ProviderWorkingHours[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.createOrUpdateWorkingHours(
      providerId,
      createWorkingHoursDto,
    );
  }

  @ApiOperation({ summary: 'Update specific day working hours' })
  @ApiResponse({
    status: 200,
    description: 'Working hours updated successfully',
    type: ProviderWorkingHours,
  })
  @Roles('provider', 'admin')
  @Patch('me/availability/working-hours/:id')
  async updateWorkingHours(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkingHoursDto: UpdateWorkingHoursDto,
    @Req() req: any,
  ): Promise<ProviderWorkingHours> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.updateWorkingHours(
      id,
      updateWorkingHoursDto,
      providerId,
    );
  }

  @ApiOperation({ summary: 'Delete working hours for a specific day' })
  @ApiResponse({
    status: 204,
    description: 'Working hours deleted successfully',
  })
  @Roles('provider', 'admin')
  @Delete('me/availability/working-hours/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkingHours(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    await this.availabilityService.deleteWorkingHours(id, providerId);
  }

  // =================== BLOCKED TIMES ENDPOINTS ===================

  @ApiOperation({ summary: 'Get provider blocked times' })
  @ApiResponse({
    status: 200,
    description: 'Blocked times retrieved successfully',
    type: [ProviderBlockedTime],
  })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Start date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'End date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @Roles('provider', 'admin')
  @Get('me/availability/blocked-times')
  async getBlockedTimes(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('isActive') isActive?: boolean,
    @Req() req?: any,
  ): Promise<ProviderBlockedTime[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getBlockedTimes(
      providerId,
      fromDate,
      toDate,
      isActive,
    );
  }

  @ApiOperation({ summary: 'Create blocked time' })
  @ApiResponse({
    status: 201,
    description: 'Blocked time created successfully',
    type: ProviderBlockedTime,
  })
  @Roles('provider', 'admin')
  @Post('me/availability/blocked-times')
  async createBlockedTime(
    @Body() createBlockedTimeDto: CreateBlockedTimeDto,
    @Req() req: any,
  ): Promise<ProviderBlockedTime> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.createBlockedTime(
      providerId,
      createBlockedTimeDto,
    );
  }

  @ApiOperation({ summary: 'Update blocked time' })
  @ApiResponse({
    status: 200,
    description: 'Blocked time updated successfully',
    type: ProviderBlockedTime,
  })
  @Roles('provider', 'admin')
  @Patch('me/availability/blocked-times/:id')
  async updateBlockedTime(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlockedTimeDto: UpdateBlockedTimeDto,
    @Req() req: any,
  ): Promise<ProviderBlockedTime> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.updateBlockedTime(
      id,
      updateBlockedTimeDto,
      providerId,
    );
  }

  @ApiOperation({ summary: 'Delete blocked time' })
  @ApiResponse({
    status: 204,
    description: 'Blocked time deleted successfully',
  })
  @Roles('provider', 'admin')
  @Delete('me/availability/blocked-times/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlockedTime(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    await this.availabilityService.deleteBlockedTime(id, providerId);
  }

  // =================== TIME SLOTS ENDPOINTS ===================

  @ApiOperation({ summary: 'Get available time slots for a date range' })
  @ApiResponse({
    status: 200,
    description: 'Time slots retrieved successfully',
    type: [ProviderTimeSlot],
  })
  @ApiQuery({ name: 'fromDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'serviceId', required: false, description: 'Filter by service ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by slot status' })
  @Roles('provider', 'admin')
  @Get('me/availability/time-slots')
  async getTimeSlots(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('serviceId') serviceId?: string,
    @Query('status') status?: string,
    @Req() req?: any,
  ): Promise<ProviderTimeSlot[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getTimeSlots(
      providerId,
      fromDate,
      toDate,
      serviceId,
      status,
    );
  }

  @ApiOperation({ summary: 'Generate time slots for a date range' })
  @ApiResponse({
    status: 201,
    description: 'Time slots generated successfully',
    type: [ProviderTimeSlot],
  })
  @Roles('provider', 'admin')
  @Post('me/availability/generate-slots')
  async generateTimeSlots(
    @Body() generateTimeSlotsDto: GenerateTimeSlotsDto,
    @Req() req: any,
  ): Promise<ProviderTimeSlot[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.generateTimeSlots(
      providerId,
      generateTimeSlotsDto,
    );
  }

  @ApiOperation({ summary: 'Update time slot' })
  @ApiResponse({
    status: 200,
    description: 'Time slot updated successfully',
    type: ProviderTimeSlot,
  })
  @Roles('provider', 'admin')
  @Patch('me/availability/time-slots/:id')
  async updateTimeSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: any,
    @Req() req: any,
  ): Promise<ProviderTimeSlot> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.updateTimeSlot(
      id,
      updateData,
      providerId,
    );
  }

  @ApiOperation({ summary: 'Delete time slot' })
  @ApiResponse({
    status: 204,
    description: 'Time slot deleted successfully',
  })
  @Roles('provider', 'admin')
  @Delete('me/availability/time-slots/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTimeSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    await this.availabilityService.deleteTimeSlot(id, providerId);
  }

  // =================== BULK OPERATIONS ===================

  @ApiOperation({ summary: 'Bulk update time slots status' })
  @ApiResponse({
    status: 200,
    description: 'Time slots updated successfully',
  })
  @Roles('provider', 'admin')
  @Patch('me/availability/time-slots/bulk-update')
  async bulkUpdateTimeSlots(
    @Body() bulkUpdateData: {
      slotIds: string[];
      status?: string;
      customPrice?: number;
      notes?: string;
    },
    @Req() req: any,
  ): Promise<{ updated: number }> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.bulkUpdateTimeSlots(
      providerId,
      bulkUpdateData,
    );
  }

  @ApiOperation({ summary: 'Copy working hours from one day to others' })
  @ApiResponse({
    status: 200,
    description: 'Working hours copied successfully',
  })
  @Roles('provider', 'admin')
  @Post('me/availability/copy-working-hours')
  async copyWorkingHours(
    @Body() copyData: {
      fromDay: string;
      toDays: string[];
    },
    @Req() req: any,
  ): Promise<ProviderWorkingHours[]> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.copyWorkingHours(
      providerId,
      copyData.fromDay,
      copyData.toDays,
    );
  }

  // =================== PUBLIC ENDPOINTS FOR CUSTOMERS ===================

  @ApiOperation({ summary: 'Get provider availability for booking (public)' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability retrieved successfully',
  })
  @ApiQuery({ name: 'date', required: true, description: 'Date to check (YYYY-MM-DD)' })
  @ApiQuery({ name: 'serviceId', required: false, description: 'Service ID for specific availability' })
  @Get(':providerId/availability')
  async getProviderAvailability(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId?: string,
  ): Promise<{
    date: string;
    isAvailable: boolean;
    workingHours?: ProviderWorkingHours;
    availableSlots: ProviderTimeSlot[];
    totalSlots: number;
    bookedSlots: number;
  }> {
    return await this.availabilityService.getProviderAvailabilityForDate(
      providerId,
      date,
      serviceId,
    );
  }

  @ApiOperation({ summary: 'Get provider availability for multiple dates (public)' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability for date range retrieved successfully',
  })
  @ApiQuery({ name: 'fromDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'serviceId', required: false, description: 'Service ID for specific availability' })
  @Get(':providerId/availability/range')
  async getProviderAvailabilityRange(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('serviceId') serviceId?: string,
  ): Promise<any[]> {
    return await this.availabilityService.getProviderAvailabilityForRange(
      providerId,
      fromDate,
      toDate,
      serviceId,
    );
  }

  // =================== ANALYTICS ENDPOINTS ===================

  @ApiOperation({ summary: 'Get availability analytics' })
  @ApiResponse({
    status: 200,
    description: 'Availability analytics retrieved successfully',
  })
  @ApiQuery({ name: 'period', required: false, description: 'Period: week, month, year' })
  @Roles('provider', 'admin')
  @Get('me/availability/analytics')
  async getAvailabilityAnalytics(
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
    @Req() req?: any,
  ): Promise<any> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getAvailabilityAnalytics(
      providerId,
      period,
    );
  }

  // =================== SETTINGS ENDPOINTS ===================

  @ApiOperation({ summary: 'Get availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Availability settings retrieved successfully',
  })
  @Roles('provider', 'admin')
  @Get('me/availability/settings')
  async getAvailabilitySettings(@Req() req: any): Promise<any> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getAvailabilitySettings(providerId);
  }

  @ApiOperation({ summary: 'Update availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Availability settings updated successfully',
  })
  @Roles('provider', 'admin')
  @Patch('me/availability/settings')
  async updateAvailabilitySettings(
    @Body() settingsData: {
      defaultSlotDuration?: number;
      defaultBufferTime?: number;
      maxAdvanceBookingDays?: number;
      minAdvanceBookingHours?: number;
      autoGenerateSlots?: boolean;
      timezone?: string;
    },
    @Req() req: any,
  ): Promise<any> {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.updateAvailabilitySettings(
      providerId,
      settingsData,
    );
  }

  // =================== SERVICE-SPECIFIC AVAILABILITY ENDPOINTS ===================

  @ApiOperation({ summary: 'Get all services with their availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Services with availability settings retrieved successfully',
  })
  @Roles('provider', 'admin')
  @Get('me/services-availability')
  async getServicesWithAvailability(@Req() req: any) {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getProviderServicesWithAvailability(providerId);
  }

  @ApiOperation({ summary: 'Get service-specific availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Service availability settings retrieved successfully',
  })
  @Roles('provider', 'admin')
  @Get('me/services/:serviceId/availability')
  async getServiceAvailabilitySettings(
    @Param('serviceId') serviceId: string,
    @Req() req: any,
  ) {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.getServiceAvailabilitySettings(providerId, serviceId);
  }

  @ApiOperation({ summary: 'Create or update service-specific availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Service availability settings updated successfully',
  })
  @Roles('provider', 'admin')
  @Post('me/services/:serviceId/availability')
  async createOrUpdateServiceAvailabilitySettings(
    @Param('serviceId') serviceId: string,
    @Body() settingsData: any,
    @Req() req: any,
  ) {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.createOrUpdateServiceAvailabilitySettings(
      providerId,
      serviceId,
      settingsData,
    );
  }

  @ApiOperation({ summary: 'Generate time slots for a specific service' })
  @ApiResponse({
    status: 201,
    description: 'Service-specific time slots generated successfully',
  })
  @Roles('provider', 'admin')
  @Post('me/services/:serviceId/generate-slots')
  async generateServiceTimeSlots(
    @Param('serviceId') serviceId: string,
    @Body() generateData: { fromDate: string; toDate: string },
    @Req() req: any,
  ) {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    return await this.availabilityService.generateServiceSpecificTimeSlots(
      providerId,
      serviceId,
      generateData.fromDate,
      generateData.toDate,
    );
  }

  @ApiOperation({ summary: 'Get available time slots for a specific service' })
  @ApiResponse({
    status: 200,
    description: 'Service time slots retrieved successfully',
  })
  @Get('providers/:providerId/services/:serviceId/slots/:date')
  async getServiceTimeSlots(
    @Param('providerId') providerId: string,
    @Param('serviceId') serviceId: string,
    @Param('date') date: string,
  ) {
    return await this.availabilityService.getServiceAvailableTimeSlots(
      providerId,
      serviceId,
      date,
    );
  }

  @ApiOperation({ summary: 'Delete service-specific availability settings' })
  @ApiResponse({
    status: 204,
    description: 'Service availability settings deleted successfully',
  })
  @Roles('provider', 'admin')
  @Delete('me/services/:serviceId/availability')
  async deleteServiceAvailabilitySettings(
    @Param('serviceId') serviceId: string,
    @Req() req: any,
  ) {
    const providerId = await this.getProviderIdFromUser(req.user.sub);
    await this.availabilityService.deleteServiceAvailabilitySettings(providerId, serviceId);
  }
}