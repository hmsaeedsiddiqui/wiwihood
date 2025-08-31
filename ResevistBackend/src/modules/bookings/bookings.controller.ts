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
  BookingAvailabilityDto 
} from './dto/booking-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
    return this.bookingsService.create(createBookingDto, req.user.id);
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
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
  ): Promise<BookingsListResponseDto> {
    const customerId = req.user.role === 'customer' ? req.user.id : undefined;
    const providerId = req.user.role === 'provider' ? req.user.provider?.id : undefined;
    
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
}
