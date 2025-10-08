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
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecurringBookingsService } from './recurring-bookings.service';
import { CreateRecurringBookingDto, UpdateRecurringBookingDto, CreateRecurringExceptionDto } from './dto/recurring-booking.dto';
import { RecurringBooking, RecurringBookingException } from '../../entities/recurring-booking.entity';
import { Booking } from '../../entities/booking.entity';

@ApiTags('Recurring Bookings')
@Controller('recurring-bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RecurringBookingsController {
  constructor(private readonly recurringBookingsService: RecurringBookingsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create recurring booking',
    description: `Create a new recurring booking pattern. This will automatically generate future bookings based on the specified frequency.

**Available Frequencies:**
- \`weekly\` - Every week
- \`biweekly\` - Every 2 weeks  
- \`monthly\` - Every month
- \`quarterly\` - Every 3 months`
  })
  @ApiBody({
    description: 'Recurring booking details',
    examples: {
      weeklyBooking: {
        summary: 'Weekly Hair Appointment',
        value: {
          providerId: '550e8400-e29b-41d4-a716-446655440011',
          serviceId: '19f77203-2904-4e96-bcad-78d5ca984c7c',
          frequency: 'weekly',
          startTime: '10:30',
          durationMinutes: 60,
          nextBookingDate: '2025-10-15',
          endDate: '2025-12-31',
          maxBookings: 12,
          specialInstructions: 'Please use side entrance and ring bell twice',
          autoConfirm: true,
          notificationPreferences: {
            email: true,
            sms: false,
            reminderDaysBefore: [1, 7]
          }
        }
      },
      monthlyBooking: {
        summary: 'Monthly Spa Treatment',
        value: {
          providerId: '550e8400-e29b-41d4-a716-446655440011',
          serviceId: '19f77203-2904-4e96-bcad-78d5ca984c7c',
          frequency: 'monthly',
          startTime: '14:00',
          durationMinutes: 90,
          nextBookingDate: '2025-11-01',
          endDate: '2026-10-31',
          maxBookings: 12,
          specialInstructions: 'Prefer quiet treatment room',
          autoConfirm: false,
          notificationPreferences: {
            email: true,
            sms: true,
            reminderDaysBefore: [3, 7]
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Recurring booking created successfully',
    type: RecurringBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid frequency or date' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 404,
    description: 'Provider or service not found'
  })
  async createRecurringBooking(
    @Body() createDto: CreateRecurringBookingDto,
    @Request() req: any,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.createRecurringBooking(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user recurring bookings' })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: ['active', 'paused', 'completed', 'cancelled'],
    example: 'active',
  })
  @ApiQuery({
    name: 'frequency',
    required: false,
    description: 'Filter by frequency',
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
    example: 'weekly',
  })
  @ApiQuery({
    name: 'providerId',
    required: false,
    description: 'Filter by provider ID',
    type: String,
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter by service ID',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    enum: ['createdAt', 'nextBookingDate', 'frequency'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring bookings retrieved successfully',
    type: [RecurringBooking],
  })
  async getUserRecurringBookings(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('frequency') frequency?: string,
    @Query('providerId') providerId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<RecurringBooking[]> {
    return this.recurringBookingsService.getUserRecurringBookings(
      req.user.id,
      {
        status,
        frequency,
        providerId,
        serviceId,
        limit: limit || 50,
        offset: offset || 0,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'DESC',
      }
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recurring booking details' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({
    name: 'includeBookings',
    required: false,
    description: 'Include related bookings',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'includeExceptions',
    required: false,
    description: 'Include exceptions',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'includeProvider',
    required: false,
    description: 'Include provider details',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'includeService',
    required: false,
    description: 'Include service details',
    type: Boolean,
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring booking details retrieved successfully',
    type: RecurringBooking,
  })
  async getRecurringBooking(
    @Param('id') id: string,
    @Request() req: any,
    @Query('includeBookings') includeBookings?: boolean,
    @Query('includeExceptions') includeExceptions?: boolean,
    @Query('includeProvider') includeProvider?: boolean,
    @Query('includeService') includeService?: boolean,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.getRecurringBookingById(
      id, 
      req.user.id,
      {
        includeBookings: includeBookings ?? true,
        includeExceptions: includeExceptions ?? false,
        includeProvider: includeProvider ?? true,
        includeService: includeService ?? true,
      }
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiBody({
    description: 'Update recurring booking data',
    examples: {
      'Update frequency and time': {
        summary: 'Change frequency and time',
        value: {
          frequency: 'monthly',
          startTime: '11:00',
          durationMinutes: 90,
          specialInstructions: 'Updated instructions - Please call upon arrival'
        }
      },
      'Update scheduling': {
        summary: 'Update dates and booking limits',
        value: {
          nextBookingDate: '2025-10-15',
          endDate: '2026-01-15',
          maxBookings: 15,
          autoConfirm: false
        }
      },
      'Update notifications': {
        summary: 'Change notification preferences',
        value: {
          notificationPreferences: {
            email: true,
            sms: true,
            reminderDaysBefore: [1, 3, 7]
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring booking updated successfully',
    type: RecurringBooking,
  })
  async updateRecurringBooking(
    @Param('id') id: string,
    @Body() updateDto: UpdateRecurringBookingDto,
    @Request() req: any,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.updateRecurringBooking(id, updateDto, req.user.id);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({
    name: 'reason',
    required: false,
    description: 'Reason for pausing',
    type: String,
    example: 'Temporary vacation',
  })
  @ApiQuery({
    name: 'pauseUntil',
    required: false,
    description: 'Auto-resume date (ISO format)',
    type: String,
    example: '2025-12-01',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring booking paused successfully',
    type: RecurringBooking,
  })
  async pauseRecurringBooking(
    @Param('id') id: string,
    @Request() req: any,
    @Query('reason') reason?: string,
    @Query('pauseUntil') pauseUntil?: string,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.pauseRecurringBooking(
      id, 
      req.user.id, 
      { reason, pauseUntil: pauseUntil ? new Date(pauseUntil) : undefined }
    );
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({
    name: 'resumeDate',
    required: false,
    description: 'Date to resume from (ISO format, defaults to next scheduled date)',
    type: String,
    example: '2025-12-15',
  })
  @ApiQuery({
    name: 'adjustSchedule',
    required: false,
    description: 'Adjust schedule to account for paused time',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring booking resumed successfully',
    type: RecurringBooking,
  })
  async resumeRecurringBooking(
    @Param('id') id: string,
    @Request() req: any,
    @Query('resumeDate') resumeDate?: string,
    @Query('adjustSchedule') adjustSchedule?: boolean,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.resumeRecurringBooking(
      id, 
      req.user.id,
      {
        resumeDate: resumeDate ? new Date(resumeDate) : undefined,
        adjustSchedule: adjustSchedule ?? false,
      }
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring booking cancelled successfully',
    type: RecurringBooking,
  })
  async cancelRecurringBooking(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<RecurringBooking> {
    return this.recurringBookingsService.cancelRecurringBooking(id, req.user.id);
  }

  @Post(':id/exceptions')
  @ApiOperation({ summary: 'Create exception for recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Recurring booking ID' })
  @ApiResponse({
    status: 201,
    description: 'Exception created successfully',
    type: RecurringBookingException,
  })
  async createException(
    @Param('id') id: string,
    @Body() createExceptionDto: CreateRecurringExceptionDto,
    @Request() req: any,
  ): Promise<RecurringBookingException> {
    return this.recurringBookingsService.createException(id, createExceptionDto, req.user.id);
  }

  @Get(':id/exceptions')
  @ApiOperation({ summary: 'Get recurring booking exceptions' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({
    name: 'exceptionType',
    required: false,
    description: 'Filter by exception type',
    enum: ['skip', 'reschedule', 'cancel'],
    example: 'reschedule',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter exceptions from this date (ISO format)',
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter exceptions until this date (ISO format)',
    type: String,
    example: '2025-12-31',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 20,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order by exception date',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @ApiResponse({
    status: 200,
    description: 'Exceptions retrieved successfully',
    type: [RecurringBookingException],
  })
  async getExceptions(
    @Param('id') id: string,
    @Request() req: any,
    @Query('exceptionType') exceptionType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<RecurringBookingException[]> {
    return this.recurringBookingsService.getRecurringBookingExceptions(
      id, 
      req.user.id,
      {
        exceptionType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit || 50,
        sortOrder: sortOrder || 'ASC',
      }
    );
  }

  @Get(':id/upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings for recurring booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of upcoming bookings to return',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'daysAhead',
    required: false,
    description: 'Number of days ahead to look for bookings',
    type: Number,
    example: 30,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by booking status',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    example: 'confirmed',
  })
  @ApiQuery({
    name: 'includeProvider',
    required: false,
    description: 'Include provider details',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'includeService',
    required: false,
    description: 'Include service details',
    type: Boolean,
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming bookings retrieved successfully',
    type: [Booking],
  })
  async getUpcomingBookings(
    @Param('id') id: string,
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('daysAhead') daysAhead?: number,
    @Query('status') status?: string,
    @Query('includeProvider') includeProvider?: boolean,
    @Query('includeService') includeService?: boolean,
  ): Promise<Booking[]> {
    const options: any = {
      limit: limit || 10,
      offset: offset || 0,
      status,
      includeProvider: includeProvider ?? true,
      includeService: includeService ?? true,
    };
    
    // Convert daysAhead to endDate
    if (daysAhead) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);
      options.endDate = endDate;
    }
    
    return this.recurringBookingsService.getUpcomingBookings(
      id, 
      req.user.id, 
      options
    );
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get recurring booking statistics' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'id', 
    description: 'Recurring booking ID (UUID format)',
    example: '057409af-1343-48a8-a0d0-14eac3d94196'
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Statistics period',
    enum: ['all', 'last30days', 'last90days', 'thisYear', 'lastYear'],
    example: 'all',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Custom start date for statistics (ISO format)',
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Custom end date for statistics (ISO format)',
    type: String,
    example: '2025-12-31',
  })
  @ApiQuery({
    name: 'includeProjections',
    required: false,
    description: 'Include future booking projections',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'includeRevenue',
    required: false,
    description: 'Include revenue calculations',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    description: 'Group statistics by period',
    enum: ['day', 'week', 'month', 'quarter'],
    example: 'month',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getRecurringBookingStats(
    @Param('id') id: string,
    @Request() req: any,
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('includeProjections') includeProjections?: boolean,
    @Query('includeRevenue') includeRevenue?: boolean,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.recurringBookingsService.getRecurringBookingStats(
      id, 
      req.user.id,
      {
        period: (period as 'week' | 'month' | 'year' | 'all') || 'all',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        includeProjections: includeProjections ?? true,
        includeRevenue: includeRevenue ?? false,
        groupBy: groupBy as 'day' | 'week' | 'month',
      }
    );
  }
}