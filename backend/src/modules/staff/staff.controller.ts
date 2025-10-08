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
  Request,
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
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import {
  CreateStaffDto,
  UpdateStaffDto,
  StaffResponseDto,
} from './dto/staff.dto';
import { StaffStatus } from '../../entities/staff.entity';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({
    status: 201,
    description: 'Staff member successfully created',
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email already exists',
  })
  async create(
    @Request() req,
    @Body() createStaffDto: CreateStaffDto,
  ): Promise<StaffResponseDto> {
    // If user is a provider, set their provider ID
    if (req.user.role === 'provider' && !createStaffDto.providerId) {
      createStaffDto.providerId = req.user.provider?.id;
    }
    
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members with optional filters' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' })
  @ApiQuery({ name: 'status', required: false, enum: StaffStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'isBookable', required: false, type: Boolean, description: 'Filter by bookable status' })
  @ApiResponse({
    status: 200,
    description: 'Staff members retrieved successfully',
    type: [StaffResponseDto],
  })
  async findAll(
    @Query('providerId') providerId?: string,
    @Query('status') status?: StaffStatus,
    @Query('isBookable') isBookable?: string,
  ): Promise<StaffResponseDto[]> {
    const isBookableBool = isBookable === 'true' ? true : isBookable === 'false' ? false : undefined;
    return this.staffService.findAll(providerId, status, isBookableBool);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get staff members for a specific provider' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider staff retrieved successfully',
    type: [StaffResponseDto],
  })
  async findByProvider(@Param('providerId', ParseUUIDPipe) providerId: string): Promise<StaffResponseDto[]> {
    return this.staffService.findByProvider(providerId);
  }

  @Get('provider/:providerId/available')
  @ApiOperation({ summary: 'Get available staff for bookings' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Available staff retrieved successfully',
    type: [StaffResponseDto],
  })
  async findAvailableStaff(@Param('providerId', ParseUUIDPipe) providerId: string): Promise<StaffResponseDto[]> {
    return this.staffService.findAvailableStaff(providerId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current provider staff members' })
  @ApiResponse({
    status: 200,
    description: 'Provider staff retrieved successfully',
    type: [StaffResponseDto],
  })
  async getMyStaff(@Request() req): Promise<StaffResponseDto[]> {
    const providerId = req.user.provider?.id;
    return this.staffService.findAll(providerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member by ID' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff member retrieved successfully',
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Staff member not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StaffResponseDto> {
    return this.staffService.findOne(id);
  }

  @Get(':id/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff member bookings' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date filter' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date filter' })
  @ApiResponse({
    status: 200,
    description: 'Staff bookings retrieved successfully',
  })
  async getStaffBookings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.staffService.getStaffBookings(id, start, end);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get staff availability for a specific date' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date to check availability (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Staff availability retrieved successfully',
  })
  async getStaffAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('date') date: string,
  ): Promise<any> {
    const checkDate = new Date(date);
    return this.staffService.getStaffAvailability(id, checkDate);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff member by ID' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff member updated successfully',
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Staff member not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff member by ID' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff member deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Staff member not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.staffService.remove(id);
    return { message: 'Staff member deleted successfully' };
  }
}