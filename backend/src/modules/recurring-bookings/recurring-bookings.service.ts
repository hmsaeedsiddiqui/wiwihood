import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { 
  RecurringBooking, 
  RecurringBookingException, 
  RecurrenceFrequency,
  RecurrenceStatus 
} from '../../entities/recurring-booking.entity';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Service } from '../../entities/service.entity';
import { CreateRecurringBookingDto, UpdateRecurringBookingDto, CreateRecurringExceptionDto } from './dto/recurring-booking.dto';

@Injectable()
export class RecurringBookingsService {
  constructor(
    @InjectRepository(RecurringBooking)
    private readonly recurringBookingRepository: Repository<RecurringBooking>,
    @InjectRepository(RecurringBookingException)
    private readonly recurringExceptionRepository: Repository<RecurringBookingException>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createRecurringBooking(createDto: CreateRecurringBookingDto, customerId: string): Promise<RecurringBooking> {
    const recurringBooking = this.recurringBookingRepository.create({
      ...createDto,
      customerId,
      nextBookingDate: new Date(createDto.nextBookingDate),
      endDate: createDto.endDate ? new Date(createDto.endDate) : undefined,
      status: RecurrenceStatus.ACTIVE,
      currentBookingCount: 0,
      autoConfirm: createDto.autoConfirm ?? true,
    });

    const saved = await this.recurringBookingRepository.save(recurringBooking);

    // Create the first booking immediately
    await this.createNextBooking(saved);

    return saved;
  }

  async updateRecurringBooking(id: string, updateDto: UpdateRecurringBookingDto, customerId: string): Promise<RecurringBooking> {
    const recurringBooking = await this.recurringBookingRepository.findOne({
      where: { id, customerId },
    });

    if (!recurringBooking) {
      throw new NotFoundException('Recurring booking not found');
    }

    if (updateDto.nextBookingDate) {
      updateDto.nextBookingDate = new Date(updateDto.nextBookingDate) as any;
    }
    if (updateDto.endDate) {
      updateDto.endDate = new Date(updateDto.endDate) as any;
    }

    Object.assign(recurringBooking, updateDto);
    return await this.recurringBookingRepository.save(recurringBooking);
  }

  async getUserRecurringBookings(
    customerId: string,
    options?: {
      status?: string;
      frequency?: string;
      providerId?: string;
      serviceId?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<RecurringBooking[]> {
    try {
      const query = this.recurringBookingRepository.createQueryBuilder('rb')
        // Temporarily remove all joins to fix the joinColumns error
        // .leftJoinAndSelect('rb.provider', 'provider')
        // .leftJoinAndSelect('rb.service', 'service')
        .where('rb.customerId = :customerId', { customerId });

      if (options?.status) {
        query.andWhere('rb.status = :status', { status: options.status });
      }

      if (options?.frequency) {
        query.andWhere('rb.frequency = :frequency', { frequency: options.frequency });
      }

      if (options?.providerId) {
        query.andWhere('rb.providerId = :providerId', { providerId: options.providerId });
      }

      if (options?.serviceId) {
        query.andWhere('rb.serviceId = :serviceId', { serviceId: options.serviceId });
      }

      // Add sorting
      const sortBy = options?.sortBy || 'createdAt';
      const sortOrder = options?.sortOrder || 'DESC';
      query.orderBy(`rb.${sortBy}`, sortOrder);

      // Add pagination
      if (options?.limit) {
        query.take(options.limit);
      }
      if (options?.offset) {
        query.skip(options.offset);
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error getting user recurring bookings:', error);
      throw error;
    }
  }

  async getRecurringBookingById(
    id: string, 
    customerId: string,
    options?: {
      includeBookings?: boolean;
      includeExceptions?: boolean;
      includeProvider?: boolean;
      includeService?: boolean;
    }
  ): Promise<RecurringBooking> {
    try {
      // Simple query without joins to avoid relation errors
      const recurringBooking = await this.recurringBookingRepository.findOne({
        where: { id, customerId }
      });

      if (!recurringBooking) {
        throw new NotFoundException('Recurring booking not found');
      }

      return recurringBooking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error getting recurring booking by ID:', error);
      throw error;
    }
  }

  async pauseRecurringBooking(
    id: string, 
    customerId: string,
    options?: {
      reason?: string;
      pauseUntil?: Date;
    }
  ): Promise<RecurringBooking> {
    try {
      const recurringBooking = await this.getRecurringBookingById(id, customerId);
      
      if (recurringBooking.status !== RecurrenceStatus.ACTIVE) {
        throw new BadRequestException('Can only pause active recurring bookings');
      }

      recurringBooking.status = RecurrenceStatus.PAUSED;
      
      // Store pause metadata if provided
      if (options?.reason || options?.pauseUntil) {
        recurringBooking.notificationPreferences = {
          ...recurringBooking.notificationPreferences,
          pauseReason: options.reason,
          pauseUntil: options.pauseUntil?.toISOString(),
        } as any;
      }

      return await this.recurringBookingRepository.save(recurringBooking);
    } catch (error) {
      console.error('Error pausing recurring booking:', error);
      throw error;
    }
  }

  async resumeRecurringBooking(
    id: string, 
    customerId: string,
    options?: {
      resumeDate?: Date;
      adjustSchedule?: boolean;
    }
  ): Promise<RecurringBooking> {
    try {
      const recurringBooking = await this.getRecurringBookingById(id, customerId);
      
      if (recurringBooking.status !== RecurrenceStatus.PAUSED) {
        throw new BadRequestException('Can only resume paused recurring bookings');
      }

      recurringBooking.status = RecurrenceStatus.ACTIVE;
      
      // Adjust schedule if requested
      if (options?.resumeDate) {
        recurringBooking.nextBookingDate = options.resumeDate;
      } else if (options?.adjustSchedule) {
        // Calculate next appropriate date based on frequency
        await this.calculateNextBookingDate(recurringBooking);
      }

      // Clear pause metadata
      if (recurringBooking.notificationPreferences) {
        const prefs = recurringBooking.notificationPreferences as any;
        delete prefs.pauseReason;
        delete prefs.pauseUntil;
      }

      return await this.recurringBookingRepository.save(recurringBooking);
    } catch (error) {
      console.error('Error resuming recurring booking:', error);
      throw error;
    }
  }

  async cancelRecurringBooking(id: string, customerId: string): Promise<RecurringBooking> {
    const recurringBooking = await this.getRecurringBookingById(id, customerId);
    
    recurringBooking.status = RecurrenceStatus.CANCELLED;
    return await this.recurringBookingRepository.save(recurringBooking);
  }

  async createException(id: string, createExceptionDto: CreateRecurringExceptionDto, customerId: string): Promise<RecurringBookingException> {
    const recurringBooking = await this.getRecurringBookingById(id, customerId);

    const exception = this.recurringExceptionRepository.create({
      ...createExceptionDto,
      recurringBookingId: id,
      exceptionDate: new Date(createExceptionDto.exceptionDate),
      newDate: createExceptionDto.newDate ? new Date(createExceptionDto.newDate) : undefined,
    });

    return await this.recurringExceptionRepository.save(exception);
  }

  async getRecurringBookingExceptions(
    id: string, 
    customerId: string,
    options?: {
      exceptionType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<RecurringBookingException[]> {
    try {
      const recurringBooking = await this.getRecurringBookingById(id, customerId);

      const query = this.recurringExceptionRepository.createQueryBuilder('ex')
        .where('ex.recurringBookingId = :id', { id });

      if (options?.exceptionType) {
        query.andWhere('ex.exceptionType = :exceptionType', { exceptionType: options.exceptionType });
      }

      if (options?.startDate) {
        query.andWhere('ex.exceptionDate >= :startDate', { startDate: options.startDate });
      }

      if (options?.endDate) {
        query.andWhere('ex.exceptionDate <= :endDate', { endDate: options.endDate });
      }

      query.orderBy('ex.exceptionDate', options?.sortOrder || 'ASC');

      if (options?.limit) {
        query.take(options.limit);
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error getting recurring booking exceptions:', error);
      throw error;
    }
  }

  private async createNextBooking(recurringBooking: RecurringBooking): Promise<Booking | null> {
    // Check if we've reached the maximum bookings
    if (recurringBooking.maxBookings && recurringBooking.currentBookingCount >= recurringBooking.maxBookings) {
      recurringBooking.status = RecurrenceStatus.COMPLETED;
      await this.recurringBookingRepository.save(recurringBooking);
      return null;
    }

    // Check if we've passed the end date
    if (recurringBooking.endDate && new Date() > recurringBooking.endDate) {
      recurringBooking.status = RecurrenceStatus.COMPLETED;
      await this.recurringBookingRepository.save(recurringBooking);
      return null;
    }

    // TODO: Skip exception checking for now until tables are created
    // For MVP, we'll create the booking without checking exceptions
    let exception = null;

    let bookingDate = recurringBooking.nextBookingDate;
    let bookingTime = recurringBooking.startTime;

    if (exception) {
      switch (exception.exceptionType) {
        case 'skip':
          // Skip this booking, move to next date
          await this.calculateNextBookingDate(recurringBooking);
          return await this.createNextBooking(recurringBooking);
        
        case 'reschedule':
          if (exception.newDate) {
            bookingDate = exception.newDate;
          }
          if (exception.newTime) {
            bookingTime = exception.newTime;
          }
          break;
        
        case 'cancel':
          // Cancel this specific booking but continue the series
          await this.calculateNextBookingDate(recurringBooking);
          return await this.createNextBooking(recurringBooking);
      }
    }

    // Create the booking
    const startDateTime = this.combineDateTime(bookingDate, bookingTime);
    const endDateTime = new Date(startDateTime.getTime() + (recurringBooking.durationMinutes * 60 * 1000));

    // Get service details to calculate price
    const service = await this.serviceRepository.findOne({
      where: { id: recurringBooking.serviceId }
    });

    const totalPrice = service ? service.basePrice : 0; // Use service base price or 0 as fallback

    const booking = this.bookingRepository.create({
      customerId: recurringBooking.customerId,
      providerId: recurringBooking.providerId,
      serviceId: recurringBooking.serviceId,
      startDateTime,
      endDateTime,
      durationMinutes: recurringBooking.durationMinutes,
      totalPrice: totalPrice,
      status: recurringBooking.autoConfirm ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
      customerNotes: recurringBooking.specialInstructions,
      recurringBookingId: recurringBooking.id,
      bookingNumber: this.generateBookingNumber(),
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Update recurring booking
    recurringBooking.currentBookingCount += 1;
    recurringBooking.lastBookingCreated = new Date();
    await this.calculateNextBookingDate(recurringBooking);

    await this.recurringBookingRepository.save(recurringBooking);

    return savedBooking;
  }

  private async calculateNextBookingDate(recurringBooking: RecurringBooking): Promise<void> {
    const currentDate = new Date(recurringBooking.nextBookingDate);
    let nextDate: Date;

    switch (recurringBooking.frequency) {
      case RecurrenceFrequency.WEEKLY:
        nextDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        break;
      
      case RecurrenceFrequency.BIWEEKLY:
        nextDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
        break;
      
      case RecurrenceFrequency.MONTHLY:
        nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      
      case RecurrenceFrequency.QUARTERLY:
        nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      
      default:
        throw new Error(`Unsupported frequency: ${recurringBooking.frequency}`);
    }

    recurringBooking.nextBookingDate = nextDate;
  }

  private combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  private generateBookingNumber(): string {
    // Generate a unique booking number
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `RB${timestamp.slice(-6)}${random}`;
  }

  // Cron job to create upcoming bookings
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createUpcomingBookings(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all active recurring bookings that need new bookings created
    const recurringBookings = await this.recurringBookingRepository.find({
      where: {
        status: RecurrenceStatus.ACTIVE,
        nextBookingDate: LessThanOrEqual(tomorrow),
      },
    });

    for (const recurringBooking of recurringBookings) {
      try {
        await this.createNextBooking(recurringBooking);
      } catch (error) {
        console.error(`Failed to create booking for recurring booking ${recurringBooking.id}:`, error);
      }
    }
  }

  // Get upcoming bookings for a recurring booking
  async getUpcomingBookings(
    id: string, 
    customerId: string, 
    options?: {
      limit?: number;
      offset?: number;
      status?: string;
      startDate?: Date;
      endDate?: Date;
      includeProvider?: boolean;
      includeService?: boolean;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<Booking[]> {
    try {
      const recurringBooking = await this.getRecurringBookingById(id, customerId);

      const query = this.bookingRepository.createQueryBuilder('booking')
        .where('booking.recurringBookingId = :id', { id })
        .andWhere('booking.startDateTime >= :now', { now: new Date() });

      if (options?.status) {
        query.andWhere('booking.status = :status', { status: options.status });
      }

      if (options?.startDate) {
        query.andWhere('booking.startDateTime >= :startDate', { startDate: options.startDate });
      }

      if (options?.endDate) {
        query.andWhere('booking.startDateTime <= :endDate', { endDate: options.endDate });
      }

      if (options?.includeProvider) {
        query.leftJoinAndSelect('booking.provider', 'provider');
      }

      if (options?.includeService) {
        query.leftJoinAndSelect('booking.service', 'service');
      }

      query.orderBy('booking.startDateTime', options?.sortOrder || 'ASC');

      if (options?.limit) {
        query.take(options.limit);
      }
      if (options?.offset) {
        query.skip(options.offset);
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error getting upcoming bookings:', error);
      throw error;
    }
  }

  // Get statistics for a recurring booking
  async getRecurringBookingStats(
    id: string, 
    customerId: string,
    options?: {
      period?: 'week' | 'month' | 'year' | 'all';
      startDate?: Date;
      endDate?: Date;
      includeRevenue?: boolean;
      includeProjections?: boolean;
      groupBy?: 'day' | 'week' | 'month';
    }
  ): Promise<{
    totalBookings: number;
    completedBookings: number;
    upcomingBookings: number;
    cancelledBookings: number;
    nextBookingDate: Date;
    isActive: boolean;
    totalRevenue?: number;
    averageBookingValue?: number;
    projectedRevenue?: number;
    periodStats?: any[];
  }> {
    try {
      const recurringBooking = await this.getRecurringBookingById(id, customerId);
      
      let bookingsQuery = this.bookingRepository.createQueryBuilder('booking')
        .where('booking.recurringBookingId = :id', { id });

      // Apply date filtering based on period or custom dates
      if (options?.period && options.period !== 'all') {
        const startDate = new Date();
        switch (options.period) {
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
        bookingsQuery.andWhere('booking.startDateTime >= :startDate', { startDate });
      } else if (options?.startDate) {
        bookingsQuery.andWhere('booking.startDateTime >= :startDate', { startDate: options.startDate });
      }

      if (options?.endDate) {
        bookingsQuery.andWhere('booking.startDateTime <= :endDate', { endDate: options.endDate });
      }

      if (options?.includeRevenue) {
        bookingsQuery.leftJoinAndSelect('booking.service', 'service');
      }

      const bookings = await bookingsQuery.getMany();

      const completed = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
      const upcoming = bookings.filter(b => b.startDateTime > new Date()).length;
      const cancelled = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;

      const stats: any = {
        totalBookings: bookings.length,
        completedBookings: completed,
        upcomingBookings: upcoming,
        cancelledBookings: cancelled,
        nextBookingDate: recurringBooking.nextBookingDate,
        isActive: recurringBooking.status === RecurrenceStatus.ACTIVE,
      };

      // Calculate revenue if requested
      if (options?.includeRevenue) {
        const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
        const totalRevenue = completedBookings.reduce((sum, booking) => {
          return sum + (booking.service?.basePrice || 0);
        }, 0);
        
        stats.totalRevenue = totalRevenue;
        stats.averageBookingValue = completed > 0 ? totalRevenue / completed : 0;

        // Calculate projected revenue if requested
        if (options?.includeProjections && stats.averageBookingValue > 0) {
          stats.projectedRevenue = upcoming * stats.averageBookingValue;
        }
      }

      // Group data if requested
      if (options?.groupBy) {
        const groupedData = this.groupBookingsByPeriod(bookings, options.groupBy);
        stats.periodStats = groupedData;
      }

      return stats;
    } catch (error) {
      console.error('Error getting recurring booking stats:', error);
      throw error;
    }
  }

  private groupBookingsByPeriod(bookings: Booking[], groupBy: 'day' | 'week' | 'month'): any[] {
    const grouped = new Map();
    
    bookings.forEach(booking => {
      let key: string;
      const date = new Date(booking.startDateTime);
      
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          period: key,
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          revenue: 0
        });
      }
      
      const stats = grouped.get(key);
      stats.totalBookings++;
      
      if (booking.status === BookingStatus.COMPLETED) {
        stats.completedBookings++;
        stats.revenue += booking.service?.basePrice || 0;
      } else if (booking.status === BookingStatus.CANCELLED) {
        stats.cancelledBookings++;
      }
    });
    
    return Array.from(grouped.values()).sort((a, b) => a.period.localeCompare(b.period));
  }
}