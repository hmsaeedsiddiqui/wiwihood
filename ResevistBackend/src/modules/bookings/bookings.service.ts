import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Service } from '../../entities/service.entity';
import { Provider } from '../../entities/provider.entity';
import { User } from '../../entities/user.entity';
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

    // Create booking
    const booking = this.bookingRepository.create({
      serviceId: createBookingDto.serviceId,
      providerId: createBookingDto.providerId,
      customerId,
      startDateTime,
      endDateTime,
      totalPrice: createBookingDto.totalPrice,
      durationMinutes: Math.floor((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)),
      status: (createBookingDto.status as BookingStatus) || BookingStatus.PENDING,
      customerNotes: createBookingDto.notes,
      bookingNumber,
    });

    const savedBooking = await this.bookingRepository.save(booking);

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
    return this.mapToResponseDto(await this.findOneWithRelations(updatedBooking.id));
  }

  async getAvailableTimeSlots(
    providerId: string, 
    serviceId: string, 
    date: string
  ): Promise<{ available: boolean; timeSlots: string[] }> {
    // Get provider's working hours (simplified - in reality this would come from provider settings)
    const workingHours = {
      start: 9, // 9 AM
      end: 17,  // 5 PM
      interval: 60 // 60 minutes
    };

    const targetDate = new Date(date);
    const timeSlots: string[] = [];

    // Generate all possible time slots
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const timeSlot = new Date(targetDate);
      timeSlot.setHours(hour, 0, 0, 0);
      timeSlots.push(timeSlot.toISOString());
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
      return !existingBookings.some(booking => 
        slotTime.getTime() >= booking.startDateTime.getTime() && 
        slotTime.getTime() < booking.endDateTime.getTime()
      );
    });

    return {
      available: availableSlots.length > 0,
      timeSlots: availableSlots
    };
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
}
