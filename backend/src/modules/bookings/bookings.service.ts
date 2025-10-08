import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Service } from '../../entities/service.entity';
import { Provider } from '../../entities/provider.entity';
import { User } from '../../entities/user.entity';
import { ProviderWorkingHours, DayOfWeek } from '../../entities/provider-working-hours.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto, BookingsListResponseDto } from './dto/booking-response.dto';
import { 
  RescheduleBookingDto, 
  CancelBookingDto, 
  CheckInBookingDto, 
  CompleteBookingDto,
  CheckAvailabilityDto
} from './dto/booking-actions.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProviderWorkingHours)
    private providerWorkingHoursRepository: Repository<ProviderWorkingHours>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createBookingDto: CreateBookingDto, customerId: string): Promise<BookingResponseDto> {
    // Verify service exists
    const service = await this.serviceRepository.findOne({
      where: { id: createBookingDto.serviceId },
      relations: ['provider'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify provider exists
    const provider = await this.providerRepository.findOne({
      where: { id: createBookingDto.providerId },
      relations: ['user'],
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check for booking conflicts
    const startDateTime = new Date(createBookingDto.startTime);
    const endDateTime = new Date(createBookingDto.endTime);

    const conflictingBookings = await this.bookingRepository.find({
      where: [
        {
          providerId: createBookingDto.providerId,
          startDateTime: Between(startDateTime, endDateTime),
          status: BookingStatus.CONFIRMED,
        },
        {
          providerId: createBookingDto.providerId,
          endDateTime: Between(startDateTime, endDateTime),
          status: BookingStatus.CONFIRMED,
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      throw new BadRequestException('Time slot is not available');
    }

    // Generate unique booking number
    const bookingNumber = await this.generateBookingNumber();

    // Get the actual service price from database (don't trust frontend)
    const actualTotalPrice = service ? service.basePrice : createBookingDto.totalPrice;

    // Create booking
    const booking = this.bookingRepository.create({
      serviceId: createBookingDto.serviceId,
      providerId: createBookingDto.providerId,
      customerId,
      startDateTime,
      endDateTime,
      totalPrice: actualTotalPrice, // Use actual service price instead of frontend data
      durationMinutes: Math.floor((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)),
      status: (createBookingDto.status as BookingStatus) || BookingStatus.PENDING,
      customerNotes: createBookingDto.notes,
      bookingNumber,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Send notification to provider about new booking
    await this.sendNewBookingNotification(savedBooking, provider, service);

    return this.mapToResponseDto(await this.findOneWithRelations(savedBooking.id));
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    providerId?: string,
    customerId?: string,
  ): Promise<BookingsListResponseDto> {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'providerUser');

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (providerId) {
      query.andWhere('booking.providerId = :providerId', { providerId });
    }

    if (customerId) {
      query.andWhere('booking.customerId = :customerId', { customerId });
    }

    query
      .orderBy('booking.startDateTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [bookings, total] = await query.getManyAndCount();

    return {
      bookings: bookings.map(booking => this.mapToResponseDto(booking)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return this.mapToResponseDto(booking);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string, userRole: string): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole !== 'admin' && booking.customerId !== userId && booking.provider.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this booking');
    }

    // If updating time, check for conflicts
    if (updateBookingDto.startTime || updateBookingDto.endTime) {
      const startDateTime = updateBookingDto.startTime ? new Date(updateBookingDto.startTime) : booking.startDateTime;
      const endDateTime = updateBookingDto.endTime ? new Date(updateBookingDto.endTime) : booking.endDateTime;

      const conflictingBookings = await this.bookingRepository.find({
        where: [
          {
            providerId: booking.providerId,
            startDateTime: Between(startDateTime, endDateTime),
            status: BookingStatus.CONFIRMED,
          },
        ],
      });

      const conflictsExist = conflictingBookings.filter(b => b.id !== id).length > 0;
      if (conflictsExist) {
        throw new BadRequestException('Time slot is not available');
      }
    }

    Object.assign(booking, updateBookingDto);
    const updatedBooking = await this.bookingRepository.save(booking);

    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole !== 'admin' && booking.customerId !== userId && booking.provider.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this booking');
    }

    await this.bookingRepository.remove(booking);
  }

  async cancelBooking(id: string, userId: string, userRole: string): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole !== 'admin' && booking.customerId !== userId && booking.provider.userId !== userId) {
      throw new ForbiddenException('Not authorized to cancel this booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    booking.status = BookingStatus.CANCELLED;
    const updatedBooking = await this.bookingRepository.save(booking);

    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  async getUpcomingBookings(userId: string, userRole: string): Promise<BookingResponseDto[]> {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'providerUser')
      .where('booking.startDateTime > :now', { now: new Date() })
      .andWhere('booking.status IN (:...statuses)', { statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] });

    if (userRole === 'customer') {
      query.andWhere('booking.customerId = :userId', { userId });
    } else if (userRole === 'provider') {
      query.andWhere('provider.userId = :userId', { userId });
    }

    query.orderBy('booking.startDateTime', 'ASC');

    const bookings = await query.getMany();
    return bookings.map(booking => this.mapToResponseDto(booking));
  }

  private async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK${dateStr}${randomStr}`;
  }

  private async findOneWithRelations(id: string): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['customer', 'service', 'provider', 'provider.user'],
    });
  }

  private mapToResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      customer: {
        id: booking.customer.id,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },
      service: {
        id: booking.service.id,
        name: booking.service.name,
        duration: booking.service.durationMinutes,
        price: booking.service.basePrice,
      },
      provider: {
        id: booking.provider.id,
        businessName: booking.provider.businessName,
        user: {
          firstName: booking.provider.user.firstName,
          lastName: booking.provider.user.lastName,
        },
      },
      startTime: booking.startDateTime,
      endTime: booking.endDateTime,
      totalPrice: booking.totalPrice,
      platformFee: 0, // This would be calculated based on business rules
      status: booking.status,
      notes: booking.customerNotes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  async rescheduleBooking(
    id: string, 
    rescheduleDto: RescheduleBookingDto, 
    userId: string, 
    userRole: string
  ): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole !== 'admin' && booking.customerId !== userId && booking.provider.userId !== userId) {
      throw new ForbiddenException('Not authorized to reschedule this booking');
    }

    if (!booking.canBeRescheduled) {
      throw new BadRequestException('Booking cannot be rescheduled');
    }

    const newStartTime = new Date(rescheduleDto.newStartTime);
    const newEndTime = new Date(rescheduleDto.newEndTime);

    // Check for conflicts
    const conflictingBookings = await this.bookingRepository.find({
      where: [
        {
          providerId: booking.providerId,
          startDateTime: Between(newStartTime, newEndTime),
          status: BookingStatus.CONFIRMED,
        },
      ],
    });

    const conflictsExist = conflictingBookings.filter(b => b.id !== id).length > 0;
    if (conflictsExist) {
      throw new BadRequestException('New time slot is not available');
    }

    booking.startDateTime = newStartTime;
    booking.endDateTime = newEndTime;
    booking.status = BookingStatus.RESCHEDULED;
    booking.providerNotes = rescheduleDto.reason;

    const updatedBooking = await this.bookingRepository.save(booking);
    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  async checkInBooking(
    id: string, 
    checkInDto: CheckInBookingDto, 
    userId: string, 
    userRole: string
  ): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only providers can check in customers
    if (userRole !== 'admin' && booking.provider.userId !== userId) {
      throw new ForbiddenException('Only the provider can check in customers');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be checked in');
    }

    booking.status = BookingStatus.IN_PROGRESS;
    booking.checkedInAt = new Date();
    if (checkInDto.notes) {
      booking.providerNotes = checkInDto.notes;
    }

    const updatedBooking = await this.bookingRepository.save(booking);
    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  async completeBooking(
    id: string, 
    completeDto: CompleteBookingDto, 
    userId: string, 
    userRole: string
  ): Promise<BookingResponseDto> {
    const booking = await this.findOneWithRelations(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only providers can complete bookings
    if (userRole !== 'admin' && booking.provider.userId !== userId) {
      throw new ForbiddenException('Only the provider can complete bookings');
    }

    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress bookings can be completed');
    }

    booking.status = BookingStatus.COMPLETED;
    booking.completedAt = new Date();
    if (completeDto.completionNotes) {
      booking.providerNotes = completeDto.completionNotes;
    }

    const updatedBooking = await this.bookingRepository.save(booking);
    
    // Trigger review request notification (async)
    this.triggerReviewRequest(booking).catch(error => {
      console.error('Failed to send review request:', error);
    });

    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  private async triggerReviewRequest(booking: Booking): Promise<void> {
    try {
      // Here you would typically:
      // 1. Send email notification to customer
      // 2. Create in-app notification
      // 3. Schedule follow-up reminders
      
      console.log(`Review request triggered for booking ${booking.id}`);
      console.log(`Customer: ${booking.customer.firstName} ${booking.customer.lastName}`);
      console.log(`Provider: ${booking.provider.businessName}`);
      console.log(`Service: ${booking.service.name}`);
      
      // In a real implementation, you would integrate with:
      // - Email service (SendGrid, AWS SES, etc.)
      // - Push notification service
      // - In-app notification system
      
      // Example structure for notification payload:
      const reviewRequestData = {
        bookingId: booking.id,
        customerId: booking.customerId,
        customerEmail: booking.customer.email,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        providerName: booking.provider.businessName,
        serviceName: booking.service.name,
        completedAt: booking.completedAt,
        reviewUrl: `${process.env.FRONTEND_URL || 'http://localhost:7000'}/booking/${booking.id}/review`,
      };
      
      // This would be sent to your notification service
      console.log('Review request data:', reviewRequestData);
      
    } catch (error) {
      console.error('Error in triggerReviewRequest:', error);
    }
  }

  async getAvailableTimeSlots(
    providerId: string, 
    serviceId: string, 
    date: string
  ): Promise<{ available: boolean; timeSlots: string[] }> {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);

    // Get provider's working hours for the specific day
    const workingHours = await this.providerWorkingHoursRepository.findOne({
      where: {
        providerId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (!workingHours) {
      // No working hours set for this day
      return {
        available: false,
        timeSlots: []
      };
    }

    // Get service duration to determine slot intervals
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId }
    });
    
    const slotDuration = service?.durationMinutes || 60; // Default to 60 minutes
    const timeSlots: string[] = [];

    // Parse working hours
    const [startHour, startMinute] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

    let currentTime = new Date(targetDate);
    currentTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(targetDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Generate time slots based on service duration
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + slotDuration * 60000);
      
      // Only add slot if it doesn't exceed working hours
      if (slotEndTime <= endTime) {
        // Skip break time if exists
        if (workingHours.breakStartTime && workingHours.breakEndTime) {
          const [breakStartHour, breakStartMinute] = workingHours.breakStartTime.split(':').map(Number);
          const [breakEndHour, breakEndMinute] = workingHours.breakEndTime.split(':').map(Number);
          
          const breakStart = new Date(targetDate);
          breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
          
          const breakEnd = new Date(targetDate);
          breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
          
          // Skip if slot overlaps with break time
          if (!(currentTime >= breakEnd || slotEndTime <= breakStart)) {
            currentTime = new Date(breakEnd);
            continue;
          }
        }
        
        timeSlots.push(currentTime.toISOString());
      }
      
      // Move to next slot
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    // Get existing bookings for the date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await this.bookingRepository.find({
      where: {
        providerId,
        startDateTime: Between(startOfDay, endOfDay),
        status: BookingStatus.CONFIRMED,
      },
    });

    // Filter out booked time slots
    const availableSlots = timeSlots.filter(slot => {
      const slotTime = new Date(slot);
      const slotEndTime = new Date(slotTime.getTime() + slotDuration * 60000);
      
      return !existingBookings.some(booking => 
        // Check if slot overlaps with existing booking
        slotTime < booking.endDateTime && slotEndTime > booking.startDateTime
      );
    });

    return {
      available: availableSlots.length > 0,
      timeSlots: availableSlots
    };
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    return days[date.getDay()];
  }

  async getBookingStats(userId: string, userRole: string): Promise<any> {
    const query = this.bookingRepository.createQueryBuilder('booking');

    if (userRole === 'customer') {
      query.where('booking.customerId = :userId', { userId });
    } else if (userRole === 'provider') {
      query.leftJoin('booking.provider', 'provider')
           .where('provider.userId = :userId', { userId });
    }

    const totalBookings = await query.getCount();
    
    const completedBookings = await query
      .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getCount();

    const cancelledBookings = await query
      .andWhere('booking.status = :status', { status: BookingStatus.CANCELLED })
      .getCount();

    const upcomingBookings = await query
      .andWhere('booking.startDateTime > :now', { now: new Date() })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] 
      })
      .getCount();

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    };
  }

  async checkAvailability(
    providerId: string,
    startTime: string,
    endTime: string
  ): Promise<{ available: boolean; message?: string }> {
    try {
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);

      // Check if the provider exists
      const provider = await this.providerRepository.findOne({
        where: { id: providerId }
      });

      if (!provider) {
        return { available: false, message: 'Provider not found' };
      }

      // Check for overlapping bookings
      const overlappingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.providerId = :providerId', { providerId })
        .andWhere('booking.status NOT IN (:...statuses)', { 
          statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] 
        })
        .andWhere(
          '(booking.startDateTime < :endTime AND booking.endDateTime > :startTime)',
          { startTime: startDateTime, endTime: endDateTime }
        )
        .getCount();

      if (overlappingBookings > 0) {
        return { available: false, message: 'Time slot is already booked' };
      }

      // Check if the time slot is in the past
      if (startDateTime < new Date()) {
        return { available: false, message: 'Cannot book in the past' };
      }

      return { available: true };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, message: 'Error checking availability' };
    }
  }

  async getCalendarView(date: string, providerId?: string, user?: any) {
    try {
      // Parse the date and create start/end of day
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

      // Get day of week
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = dayNames[targetDate.getDay()];

      // Build query for bookings
      let bookingsQuery = this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.service', 'service')
        .leftJoinAndSelect('booking.provider', 'provider')
        .leftJoinAndSelect('booking.customer', 'customer')
        .where('booking.startDateTime >= :startOfDay', { startOfDay })
        .andWhere('booking.startDateTime <= :endOfDay', { endOfDay })
        .andWhere('booking.status NOT IN (:...statuses)', { 
          statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] 
        });

      // Filter by provider if specified
      if (providerId) {
        bookingsQuery = bookingsQuery.andWhere('booking.providerId = :providerId', { providerId });
      } else if (user && user.role === 'provider') {
        // If user is a provider, show only their bookings
        const provider = await this.providerRepository.findOne({
          where: { userId: user.id }
        });
        if (provider) {
          bookingsQuery = bookingsQuery.andWhere('booking.providerId = :providerId', { providerId: provider.id });
        }
      }

      const bookings = await bookingsQuery
        .orderBy('booking.startDateTime', 'ASC')
        .getMany();

      // Calculate statistics
      const totalBookings = bookings.length;
      const bookedHours = bookings.reduce((total, booking) => {
        const duration = (new Date(booking.endDateTime).getTime() - new Date(booking.startDateTime).getTime()) / (1000 * 60 * 60);
        return total + duration;
      }, 0);

      // Generate available time slots (basic implementation)
      const availableSlots = [];
      const workingHours = { start: '09:00', end: '18:00' }; // Default working hours
      
      // Generate slots every hour (you can make this more sophisticated)
      for (let hour = 9; hour < 18; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const slotDateTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour);
        
        // Check if this slot is available (not booked)
        const isBooked = bookings.some(booking => {
          const bookingStart = new Date(booking.startDateTime);
          const bookingEnd = new Date(booking.endDateTime);
          return slotDateTime >= bookingStart && slotDateTime < bookingEnd;
        });
        
        if (!isBooked && slotDateTime > new Date()) {
          availableSlots.push(timeSlot);
        }
      }

      // Transform bookings to response format
      const bookingResponses = bookings.map(booking => ({
        id: booking.id,
        startTime: booking.startDateTime,
        endTime: booking.endDateTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        customerNotes: booking.customerNotes,
        providerNotes: booking.providerNotes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: booking.service.id,
          name: booking.service.name,
          durationMinutes: booking.service.durationMinutes,
          basePrice: booking.service.basePrice
        },
        provider: {
          id: booking.provider.id,
          businessName: booking.provider.businessName,
          phone: booking.provider.phone
        },
        customer: {
          id: booking.customer.id,
          firstName: booking.customer.firstName,
          lastName: booking.customer.lastName,
          email: booking.customer.email,
          phone: booking.customer.phone
        }
      }));

      return {
        date,
        dayOfWeek,
        bookings: bookingResponses,
        availableSlots,
        totalBookings,
        bookedHours: Math.round(bookedHours * 100) / 100 // Round to 2 decimal places
      };

    } catch (error) {
      console.error('Error getting calendar view:', error);
      throw new BadRequestException('Error retrieving calendar view');
    }
  }

  // Send notification to provider when new booking is created
  private async sendNewBookingNotification(booking: Booking, provider: Provider, service: Service): Promise<void> {
    try {
      // Get customer details
      const customer = await this.userRepository.findOne({
        where: { id: booking.customerId }
      });

      if (!customer) {
        console.error('Customer not found for notification');
        return;
      }

      // Create notification for provider
      await this.notificationsService.create({
        userId: provider.userId, // Send notification to provider's user ID
        title: 'New Appointment Booking',
        message: `${customer.firstName} ${customer.lastName} has booked your ${service.name} service for ${booking.startDateTime.toLocaleDateString()} at ${booking.startDateTime.toLocaleTimeString()}.`,
        type: 'booking_new',
        data: {
          bookingId: booking.id,
          customerId: booking.customerId,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          serviceName: service.name,
          startTime: booking.startDateTime,
          endTime: booking.endDateTime,
          totalPrice: booking.totalPrice,
          status: booking.status
        },
        isRead: false
      });

      console.log(`✅ Notification sent to provider ${provider.businessName} for new booking ${booking.id}`);
      
    } catch (error) {
      console.error('Error sending new booking notification:', error);
      // Don't throw error to prevent booking creation from failing
    }
  }
}
