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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto, BookingsListResponseDto } from './dto/booking-response.dto';
import { 
  RescheduleBookingDto, 
  CancelBookingDto, 
  CheckInBookingDto, 
  CompleteBookingDto,
  CheckAvailabilityDto,
  CheckTimeAvailabilityDto,
  CheckDateAvailabilityDto
} from './dto/booking-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully created',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or time slot unavailable',
  })
  @ApiResponse({
    status: 404,
    description: 'Service or provider not found',
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req,
  ): Promise<BookingResponseDto> {
    // Use fallback for testing when no auth
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Post('check-availability')
  @ApiOperation({ 
    summary: 'Check availability for a time slot or date',
    description: 'Check if a provider is available for a specific time slot (using startTime/endTime) or for a whole date (using date)'
  })
  @ApiResponse({
    status: 200,
    description: 'Availability checked successfully',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @ApiBody({
    description: 'Availability check data - use either startTime/endTime OR date',
    examples: {
      'Time-based check': {
        value: {
          providerId: "550e8400-e29b-41d4-a716-446655440011",
          startTime: "2025-10-07T10:00:00Z",
          endTime: "2025-10-07T11:00:00Z"
        }
      },
      'Date-based check': {
        value: {
          providerId: "550e8400-e29b-41d4-a716-446655440011",
          serviceId: "19f77203-2904-4e96-bcad-78d5ca984c7c",
          date: "2025-10-07"
        }
      }
    }
  })
  async checkAvailability(
    @Body() availabilityDto: CheckAvailabilityDto
  ): Promise<{ available: boolean; message?: string }> {
    // Handle both time-based and date-based availability checks
    if (availabilityDto.startTime && availabilityDto.endTime) {
      // Time-based check
      return this.bookingsService.checkAvailability(
        availabilityDto.providerId,
        availabilityDto.startTime,
        availabilityDto.endTime
      );
    } else if (availabilityDto.date) {
      // Date-based check - convert date to full day range
      const startOfDay = new Date(availabilityDto.date + 'T00:00:00Z').toISOString();
      const endOfDay = new Date(availabilityDto.date + 'T23:59:59Z').toISOString();
      return this.bookingsService.checkAvailability(
        availabilityDto.providerId,
        startOfDay,
        endOfDay
      );
    } else {
      return {
        available: false,
        message: 'Please provide either startTime/endTime or date for availability check'
      };
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all bookings with pagination (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider' })
  @ApiQuery({ name: 'customerId', required: false, type: String, description: 'Filter by customer' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: BookingsListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
    @Query('providerId') providerId?: string,
    @Query('customerId') customerId?: string,
  ): Promise<BookingsListResponseDto> {
    return this.bookingsService.findAll(page, limit, status, providerId, customerId);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    type: BookingsListResponseDto,
  })
  async findMyBookings(
    @Request() req,
    @Query('page') pageQuery?: string,
    @Query('limit') limitQuery?: string,
    @Query('status') status?: string,
  ): Promise<BookingsListResponseDto> {
    // Parse page and limit with better error handling
    const page = pageQuery ? parseInt(pageQuery, 10) || 1 : 1;
    const limit = limitQuery ? parseInt(limitQuery, 10) || 10 : 10;
    
    // Use fallback for testing when no auth - using a proper UUID format
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    const userRole = req.user?.role || 'customer';
    const customerId = userRole === 'customer' ? userId : undefined;
    const providerId = userRole === 'provider' ? req.user?.provider?.id : undefined;
    
    return this.bookingsService.findAll(page, limit, status, providerId, customerId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings for current user' })
  @ApiResponse({
    status: 200,
    description: 'Upcoming bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getUpcomingBookings(@Request() req): Promise<BookingResponseDto[]> {
    return this.bookingsService.getUpcomingBookings(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BookingResponseDto> {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({
    description: 'Update booking data',
    examples: {
      updateBooking: {
        summary: 'Update booking example',
        value: {
          serviceId: '19f77203-2904-4e96-bcad-78d5ca984c7c',
          providerId: '550e8400-e29b-41d4-a716-446655440011',
          startTime: '2025-10-07T09:00:00Z',
          endTime: '2025-10-07T10:00:00Z',
          totalPrice: 120.00,
          platformFee: 12.00,
          notes: 'Updated booking - please confirm availability',
          status: 'confirmed'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to update this booking',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.update(id, updateBookingDto, req.user.id, req.user.role);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to cancel this booking',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot cancel this booking',
  })
  async cancelBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.cancelBooking(id, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete booking (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    return this.bookingsService.remove(id, req.user.id, req.user.role);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking rescheduled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to reschedule this booking',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot reschedule this booking or time slot unavailable',
  })
  async rescheduleBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rescheduleDto: RescheduleBookingDto,
    @Request() req,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.rescheduleBooking(id, rescheduleDto, req.user.id, req.user.role);
  }

  @Patch(':id/checkin')
  @ApiOperation({ summary: 'Check in customer for booking (Provider only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer checked in successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only provider can check in customers',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot check in for this booking',
  })
  async checkInBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() checkInDto: CheckInBookingDto,
    @Request() req,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.checkInBooking(id, checkInDto, req.user.id, req.user.role);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete booking (Provider only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking completed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only provider can complete bookings',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot complete this booking',
  })
  async completeBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeDto: CompleteBookingDto,
    @Request() req,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.completeBooking(id, completeDto, req.user.id, req.user.role);
  }

  @Get('availability/:providerId/:serviceId')
  @ApiOperation({ summary: 'Get available time slots for booking' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiQuery({ name: 'date', description: 'Date (YYYY-MM-DD)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Available time slots retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        timeSlots: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async getAvailability(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailableTimeSlots(providerId, serviceId, date);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking statistics for current user' })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalBookings: { type: 'number' },
        completedBookings: { type: 'number' },
        cancelledBookings: { type: 'number' },
        upcomingBookings: { type: 'number' },
        completionRate: { type: 'number' }
      }
    }
  })
  async getStats(@Request() req) {
    return this.bookingsService.getBookingStats(req.user.id, req.user.role);
  }

  @Get('calendar/:date')
  @ApiOperation({ summary: 'Get calendar view for a specific date' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'providerId', required: false, description: 'Provider ID to filter bookings' })
  @ApiResponse({
    status: 200,
    description: 'Calendar view retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        dayOfWeek: { type: 'string' },
        bookings: { type: 'array', items: { $ref: '#/components/schemas/BookingResponseDto' } },
        availableSlots: { type: 'array', items: { type: 'string' } },
        totalBookings: { type: 'number' },
        bookedHours: { type: 'number' }
      }
    }
  })
  async getCalendarView(
    @Param('date') date: string,
    @Query('providerId') providerId?: string,
    @Request() req?: any
  ) {
    return this.bookingsService.getCalendarView(date, providerId, req.user);
  }
}
