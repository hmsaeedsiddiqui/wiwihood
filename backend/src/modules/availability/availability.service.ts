import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { ProviderWorkingHours, DayOfWeek } from '../../entities/provider-working-hours.entity';
import { ProviderBlockedTime, BlockedTimeType } from '../../entities/provider-blocked-time.entity';
import { ProviderTimeSlot, TimeSlotStatus } from '../../entities/provider-time-slot.entity';
import { Provider } from '../../entities/provider.entity';
import { Service } from '../../entities/service.entity';
import { ServiceAvailabilitySettings } from '../../entities/service-availability-settings.entity';
import { AvailabilityGateway } from '../websocket/websocket-gateway';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';
import { CreateBlockedTimeDto } from './dto/create-blocked-time.dto';
import { UpdateBlockedTimeDto } from './dto/update-blocked-time.dto';
import { GenerateTimeSlotsDto } from './dto/generate-time-slots.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(ProviderWorkingHours)
    private readonly workingHoursRepository: Repository<ProviderWorkingHours>,
    @InjectRepository(ProviderBlockedTime)
    private readonly blockedTimeRepository: Repository<ProviderBlockedTime>,
    @InjectRepository(ProviderTimeSlot)
    private readonly timeSlotRepository: Repository<ProviderTimeSlot>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceAvailabilitySettings)
    private readonly serviceAvailabilityRepository: Repository<ServiceAvailabilitySettings>,
    private readonly websocketGateway: AvailabilityGateway,
  ) {}

  // =================== WORKING HOURS METHODS ===================

  async getWorkingHours(providerId: string): Promise<ProviderWorkingHours[]> {
    try {
      const workingHours = await this.workingHoursRepository.find({
        where: { providerId },
        order: { dayOfWeek: 'ASC' },
      });

      // If no working hours exist, create default ones
      if (workingHours.length === 0) {
        return await this.createDefaultWorkingHours(providerId);
      }

      return workingHours;
    } catch (error) {
      console.error('Error getting working hours:', error);
      throw error;
    }
  }

  async createOrUpdateWorkingHours(
    providerId: string,
    workingHoursData: CreateWorkingHoursDto[],
  ): Promise<ProviderWorkingHours[]> {
    try {
      // Validate provider exists
      await this.validateProvider(providerId);

      const savedWorkingHours: ProviderWorkingHours[] = [];

      for (const data of workingHoursData) {
        // Check if working hours for this day already exist
        let existingWorkingHours = await this.workingHoursRepository.findOne({
          where: { providerId, dayOfWeek: data.dayOfWeek },
        });

        if (existingWorkingHours) {
          // Update existing
          Object.assign(existingWorkingHours, data);
          const updated = await this.workingHoursRepository.save(existingWorkingHours);
          savedWorkingHours.push(updated);
        } else {
          // Create new
          const newWorkingHours = this.workingHoursRepository.create({
            ...data,
            providerId,
          });
          const saved = await this.workingHoursRepository.save(newWorkingHours);
          savedWorkingHours.push(saved);
        }
      }

      // Regenerate time slots for affected days
      await this.regenerateTimeSlotsForDays(providerId, workingHoursData.map(w => w.dayOfWeek));

      return savedWorkingHours;
    } catch (error) {
      console.error('Error creating/updating working hours:', error);
      throw error;
    }
  }

  async updateWorkingHours(
    id: string,
    updateData: UpdateWorkingHoursDto,
    providerId: string,
  ): Promise<ProviderWorkingHours> {
    try {
      const workingHours = await this.workingHoursRepository.findOne({
        where: { id, providerId },
      });

      if (!workingHours) {
        throw new NotFoundException('Working hours not found');
      }

      Object.assign(workingHours, updateData);
      const updated = await this.workingHoursRepository.save(workingHours);

      // Regenerate time slots for this day
      await this.regenerateTimeSlotsForDays(providerId, [workingHours.dayOfWeek]);

      return updated;
    } catch (error) {
      console.error('Error updating working hours:', error);
      throw error;
    }
  }

  async deleteWorkingHours(id: string, providerId: string): Promise<void> {
    try {
      const workingHours = await this.workingHoursRepository.findOne({
        where: { id, providerId },
      });

      if (!workingHours) {
        throw new NotFoundException('Working hours not found');
      }

      await this.workingHoursRepository.remove(workingHours);

      // Remove time slots for this day
      await this.deleteTimeSlotsForDay(providerId, workingHours.dayOfWeek);
    } catch (error) {
      console.error('Error deleting working hours:', error);
      throw error;
    }
  }

  // =================== BLOCKED TIMES METHODS ===================

  async getBlockedTimes(
    providerId: string,
    fromDate?: string,
    toDate?: string,
    isActive?: boolean,
  ): Promise<ProviderBlockedTime[]> {
    try {
      const query: any = { providerId };

      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      if (fromDate && toDate) {
        query.blockDate = Between(fromDate, toDate);
      } else if (fromDate) {
        query.blockDate = fromDate;
      }

      return await this.blockedTimeRepository.find({
        where: query,
        order: { blockDate: 'ASC', startTime: 'ASC' },
      });
    } catch (error) {
      console.error('Error getting blocked times:', error);
      throw error;
    }
  }

  async createBlockedTime(
    providerId: string,
    createData: CreateBlockedTimeDto,
  ): Promise<ProviderBlockedTime> {
    try {
      await this.validateProvider(providerId);

      // Validate time logic
      if (!createData.isAllDay && (!createData.startTime || !createData.endTime)) {
        throw new BadRequestException('Start time and end time are required for partial day blocks');
      }

      if (createData.startTime && createData.endTime) {
        if (createData.startTime >= createData.endTime) {
          throw new BadRequestException('Start time must be before end time');
        }
      }

      // Check for conflicts with existing blocked times
      await this.checkBlockedTimeConflicts(providerId, createData);

      const blockedTime = this.blockedTimeRepository.create({
        ...createData,
        providerId,
      });

      const saved = await this.blockedTimeRepository.save(blockedTime);

      // Update affected time slots
      await this.updateTimeSlotsForBlockedTime(saved);

      return saved;
    } catch (error) {
      console.error('Error creating blocked time:', error);
      throw error;
    }
  }

  async updateBlockedTime(
    id: string,
    updateData: UpdateBlockedTimeDto,
    providerId: string,
  ): Promise<ProviderBlockedTime> {
    try {
      const blockedTime = await this.blockedTimeRepository.findOne({
        where: { id, providerId },
      });

      if (!blockedTime) {
        throw new NotFoundException('Blocked time not found');
      }

      // Store original values before update
      const oldValues = {
        blockDate: blockedTime.blockDate,
        startTime: blockedTime.startTime,
        endTime: blockedTime.endTime,
        isAllDay: blockedTime.isAllDay,
        providerId: blockedTime.providerId
      };
      
      Object.assign(blockedTime, updateData);

      // Validate updated data
      if (!blockedTime.isAllDay && (!blockedTime.startTime || !blockedTime.endTime)) {
        throw new BadRequestException('Start time and end time are required for partial day blocks');
      }

      const updated = await this.blockedTimeRepository.save(blockedTime);

      // Update affected time slots using old values and new entity
      await this.updateTimeSlotsForBlockedTimeChange(oldValues, updated);

      return updated;
    } catch (error) {
      console.error('Error updating blocked time:', error);
      throw error;
    }
  }

  async deleteBlockedTime(id: string, providerId: string): Promise<void> {
    try {
      const blockedTime = await this.blockedTimeRepository.findOne({
        where: { id, providerId },
      });

      if (!blockedTime) {
        throw new NotFoundException('Blocked time not found');
      }

      await this.blockedTimeRepository.remove(blockedTime);

      // Restore affected time slots
      await this.restoreTimeSlotsFromBlockedTime(blockedTime);
    } catch (error) {
      console.error('Error deleting blocked time:', error);
      throw error;
    }
  }

  // =================== TIME SLOTS METHODS ===================

  async getTimeSlots(
    providerId: string,
    fromDate: string,
    toDate: string,
    serviceId?: string,
    status?: string,
  ): Promise<ProviderTimeSlot[]> {
    try {
      const query: any = {
        providerId,
        slotDate: Between(fromDate, toDate),
      };

      if (serviceId) {
        query.serviceId = serviceId;
      }

      if (status) {
        query.status = status;
      }

      return await this.timeSlotRepository.find({
        where: query,
        relations: ['service'],
        order: { slotDate: 'ASC', startTime: 'ASC' },
      });
    } catch (error) {
      console.error('Error getting time slots:', error);
      throw error;
    }
  }

  async generateTimeSlots(
    providerId: string,
    generateData: GenerateTimeSlotsDto,
  ): Promise<ProviderTimeSlot[]> {
    try {
      await this.validateProvider(providerId);

      const {
        fromDate,
        toDate,
        slotDurationMinutes = 30,
        bufferTimeMinutes = 15,
        serviceId,
        maxBookings = 1,
        skipExistingSlots = true,
      } = generateData;

      // Get working hours for provider
      const workingHours = await this.getWorkingHours(providerId);
      const workingHoursMap = new Map(
        workingHours.map(wh => [wh.dayOfWeek, wh])
      );

      // Get blocked times for the date range
      const blockedTimes = await this.getBlockedTimes(providerId, fromDate, toDate, true);

      const generatedSlots: ProviderTimeSlot[] = [];
      const currentDate = new Date(fromDate);
      const endDate = new Date(toDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayOfWeek = this.getDayOfWeekFromDate(currentDate);
        
        // Check if provider works on this day
        const dayWorkingHours = workingHoursMap.get(dayOfWeek);
        if (!dayWorkingHours?.isActive) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // Check if this date is blocked
        const dayBlockedTimes = blockedTimes.filter(bt => 
          bt.blockDate === dateString && bt.isActive
        );

        // Generate slots for this day
        const daySlots = await this.generateProviderSlotsForDay(
          providerId,
          dateString,
          dayWorkingHours,
          dayBlockedTimes,
          slotDurationMinutes,
          bufferTimeMinutes,
          serviceId,
          maxBookings,
          skipExistingSlots,
        );

        generatedSlots.push(...daySlots);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return generatedSlots;
    } catch (error) {
      console.error('Error generating time slots:', error);
      throw error;
    }
  }

  async updateTimeSlot(
    id: string,
    updateData: any,
    providerId: string,
  ): Promise<ProviderTimeSlot> {
    try {
      const timeSlot = await this.timeSlotRepository.findOne({
        where: { id, providerId },
      });

      if (!timeSlot) {
        throw new NotFoundException('Time slot not found');
      }

      Object.assign(timeSlot, updateData);
      return await this.timeSlotRepository.save(timeSlot);
    } catch (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
  }

  async deleteTimeSlot(id: string, providerId: string): Promise<void> {
    try {
      const timeSlot = await this.timeSlotRepository.findOne({
        where: { id, providerId },
      });

      if (!timeSlot) {
        throw new NotFoundException('Time slot not found');
      }

      // Check if slot has bookings
      if (timeSlot.currentBookings > 0) {
        throw new BadRequestException('Cannot delete time slot with existing bookings');
      }

      await this.timeSlotRepository.remove(timeSlot);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  }

  // =================== BULK OPERATIONS ===================

  async bulkUpdateTimeSlots(
    providerId: string,
    bulkData: {
      slotIds: string[];
      status?: string;
      customPrice?: number;
      notes?: string;
    },
  ): Promise<{ updated: number }> {
    try {
      const result = await this.timeSlotRepository.update(
        {
          id: In(bulkData.slotIds),
          providerId,
        },
        {
          ...(bulkData.status && { status: bulkData.status as TimeSlotStatus }),
          ...(bulkData.customPrice !== undefined && { customPrice: bulkData.customPrice }),
          ...(bulkData.notes !== undefined && { notes: bulkData.notes }),
        },
      );

      return { updated: result.affected || 0 };
    } catch (error) {
      console.error('Error bulk updating time slots:', error);
      throw error;
    }
  }

  async copyWorkingHours(
    providerId: string,
    fromDay: string,
    toDays: string[],
  ): Promise<ProviderWorkingHours[]> {
    try {
      const sourceWorkingHours = await this.workingHoursRepository.findOne({
        where: { providerId, dayOfWeek: fromDay as DayOfWeek },
      });

      if (!sourceWorkingHours) {
        throw new NotFoundException('Source working hours not found');
      }

      const copiedWorkingHours: ProviderWorkingHours[] = [];

      for (const toDay of toDays) {
        let targetWorkingHours = await this.workingHoursRepository.findOne({
          where: { providerId, dayOfWeek: toDay as DayOfWeek },
        });

        const workingHoursData = {
          dayOfWeek: toDay as DayOfWeek,
          isActive: sourceWorkingHours.isActive,
          startTime: sourceWorkingHours.startTime,
          endTime: sourceWorkingHours.endTime,
          breakStartTime: sourceWorkingHours.breakStartTime,
          breakEndTime: sourceWorkingHours.breakEndTime,
          timezone: sourceWorkingHours.timezone,
          notes: sourceWorkingHours.notes,
        };

        if (targetWorkingHours) {
          Object.assign(targetWorkingHours, workingHoursData);
          const updated = await this.workingHoursRepository.save(targetWorkingHours);
          copiedWorkingHours.push(updated);
        } else {
          const newWorkingHours = this.workingHoursRepository.create({
            ...workingHoursData,
            providerId,
          });
          const saved = await this.workingHoursRepository.save(newWorkingHours);
          copiedWorkingHours.push(saved);
        }
      }

      // Regenerate time slots for copied days
      await this.regenerateTimeSlotsForDays(
        providerId,
        toDays.map(day => day as DayOfWeek),
      );

      return copiedWorkingHours;
    } catch (error) {
      console.error('Error copying working hours:', error);
      throw error;
    }
  }

  // =================== PUBLIC AVAILABILITY METHODS ===================

  async getProviderAvailabilityForDate(
    providerId: string,
    date: string,
    serviceId?: string,
  ): Promise<{
    date: string;
    isAvailable: boolean;
    workingHours?: ProviderWorkingHours;
    availableSlots: ProviderTimeSlot[];
    totalSlots: number;
    bookedSlots: number;
  }> {
    try {
      const dayOfWeek = this.getDayOfWeekFromDate(new Date(date));
      
      // Get working hours for this day
      const workingHours = await this.workingHoursRepository.findOne({
        where: { providerId, dayOfWeek },
      });

      if (!workingHours?.isActive) {
        return {
          date,
          isAvailable: false,
          workingHours,
          availableSlots: [],
          totalSlots: 0,
          bookedSlots: 0,
        };
      }

      // Get time slots for this date
      const query: any = {
        providerId,
        slotDate: date,
      };

      if (serviceId) {
        query.serviceId = serviceId;
      }

      const timeSlots = await this.timeSlotRepository.find({
        where: query,
        relations: ['service'],
        order: { startTime: 'ASC' },
      });

      const availableSlots = timeSlots.filter(slot => slot.isAvailable);
      const bookedSlots = timeSlots.filter(slot => 
        slot.status === TimeSlotStatus.BOOKED
      ).length;

      return {
        date,
        isAvailable: availableSlots.length > 0,
        workingHours,
        availableSlots,
        totalSlots: timeSlots.length,
        bookedSlots,
      };
    } catch (error) {
      console.error('Error getting provider availability for date:', error);
      throw error;
    }
  }

  async getProviderAvailabilityForRange(
    providerId: string,
    fromDate: string,
    toDate: string,
    serviceId?: string,
  ): Promise<any[]> {
    try {
      const availability: any[] = [];
      const currentDate = new Date(fromDate);
      const endDate = new Date(toDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayAvailability = await this.getProviderAvailabilityForDate(
          providerId,
          dateString,
          serviceId,
        );
        availability.push(dayAvailability);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return availability;
    } catch (error) {
      console.error('Error getting provider availability for range:', error);
      throw error;
    }
  }

  // =================== ANALYTICS METHODS ===================

  async getAvailabilityAnalytics(
    providerId: string,
    period: 'week' | 'month' | 'year',
  ): Promise<any> {
    try {
      const now = new Date();
      let fromDate: Date;

      switch (period) {
        case 'week':
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          fromDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const fromDateString = fromDate.toISOString().split('T')[0];
      const toDateString = now.toISOString().split('T')[0];

      // Get time slots for analysis
      const timeSlots = await this.getTimeSlots(providerId, fromDateString, toDateString);
      
      // Get working hours
      const workingHours = await this.getWorkingHours(providerId);
      
      // Get blocked times
      const blockedTimes = await this.getBlockedTimes(providerId, fromDateString, toDateString);

      // Calculate analytics
      const totalSlots = timeSlots.length;
      const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
      const bookedSlots = timeSlots.filter(slot => slot.status === TimeSlotStatus.BOOKED).length;
      const blockedSlots = timeSlots.filter(slot => slot.status === TimeSlotStatus.BLOCKED).length;
      const breakSlots = timeSlots.filter(slot => slot.status === TimeSlotStatus.BREAK).length;

      const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
      const availabilityRate = totalSlots > 0 ? (availableSlots / totalSlots) * 100 : 0;

      const workingDays = workingHours.filter(wh => wh.isActive).length;
      const totalWorkingHours = workingHours.reduce((total, wh) => 
        total + (wh.isActive ? wh.workingDurationMinutes / 60 : 0), 0
      );

      return {
        period,
        dateRange: { from: fromDateString, to: toDateString },
        slots: {
          total: totalSlots,
          available: availableSlots,
          booked: bookedSlots,
          blocked: blockedSlots,
          break: breakSlots,
        },
        rates: {
          utilization: Math.round(utilizationRate * 100) / 100,
          availability: Math.round(availabilityRate * 100) / 100,
        },
        workingSchedule: {
          workingDays,
          totalWorkingHours: Math.round(totalWorkingHours * 100) / 100,
          avgHoursPerDay: Math.round((totalWorkingHours / 7) * 100) / 100,
        },
        blockedTimes: {
          total: blockedTimes.length,
          active: blockedTimes.filter(bt => bt.isActive).length,
          byType: this.groupBlockedTimesByType(blockedTimes),
        },
      };
    } catch (error) {
      console.error('Error getting availability analytics:', error);
      throw error;
    }
  }

  // =================== SETTINGS METHODS ===================

  async getAvailabilitySettings(providerId: string): Promise<any> {
    try {
      // For now, return default settings. In the future, these could be stored in a settings table
      return {
        defaultSlotDuration: 30,
        defaultBufferTime: 15,
        maxAdvanceBookingDays: 30,
        minAdvanceBookingHours: 2,
        autoGenerateSlots: true,
        timezone: 'Europe/Berlin',
        allowDoubleBooking: false,
        requireConfirmation: true,
      };
    } catch (error) {
      console.error('Error getting availability settings:', error);
      throw error;
    }
  }

  async updateAvailabilitySettings(
    providerId: string,
    settingsData: any,
  ): Promise<any> {
    try {
      // For now, just return the updated settings. In the future, store in database
      const currentSettings = await this.getAvailabilitySettings(providerId);
      const updatedSettings = { ...currentSettings, ...settingsData };
      
      // Here you would save to a settings table
      // await this.settingsRepository.save(updatedSettings);
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating availability settings:', error);
      throw error;
    }
  }

  // =================== HELPER METHODS ===================

  private async validateProvider(providerId: string): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
  }

  private async createDefaultWorkingHours(providerId: string): Promise<ProviderWorkingHours[]> {
    const defaultHours = [
      { dayOfWeek: DayOfWeek.MONDAY, isActive: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.TUESDAY, isActive: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.WEDNESDAY, isActive: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.THURSDAY, isActive: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.FRIDAY, isActive: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.SATURDAY, isActive: false, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.SUNDAY, isActive: false, startTime: '09:00', endTime: '17:00' },
    ];

    const workingHours = defaultHours.map(hours => 
      this.workingHoursRepository.create({ ...hours, providerId })
    );

    return await this.workingHoursRepository.save(workingHours);
  }

  private getDayOfWeekFromDate(date: Date): DayOfWeek {
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

  private async regenerateTimeSlotsForDays(
    providerId: string,
    days: DayOfWeek[],
  ): Promise<void> {
    // This would regenerate time slots based on new working hours
    // Implementation depends on your business logic
    console.log(`Regenerating time slots for provider ${providerId} on days:`, days);
  }

  private async deleteTimeSlotsForDay(
    providerId: string,
    dayOfWeek: DayOfWeek,
  ): Promise<void> {
    // This would delete time slots for a specific day
    console.log(`Deleting time slots for provider ${providerId} on ${dayOfWeek}`);
  }

  private async checkBlockedTimeConflicts(
    providerId: string,
    blockData: CreateBlockedTimeDto,
  ): Promise<void> {
    const existingBlocks = await this.blockedTimeRepository.find({
      where: {
        providerId,
        blockDate: blockData.blockDate,
        isActive: true,
      },
    });

    // Check for conflicts
    for (const existing of existingBlocks) {
      if (existing.isAllDay || blockData.isAllDay) {
        throw new ConflictException('Blocked time conflicts with existing all-day block');
      }

      if (
        blockData.startTime &&
        blockData.endTime &&
        existing.startTime &&
        existing.endTime
      ) {
        const newStart = blockData.startTime;
        const newEnd = blockData.endTime;
        const existingStart = existing.startTime;
        const existingEnd = existing.endTime;

        if (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        ) {
          throw new ConflictException('Blocked time conflicts with existing blocked time');
        }
      }
    }
  }

  private async updateTimeSlotsForBlockedTime(
    blockedTime: ProviderBlockedTime,
  ): Promise<void> {
    // Update time slots to reflect blocked time
    const query: any = {
      providerId: blockedTime.providerId,
      slotDate: blockedTime.blockDate,
    };

    if (!blockedTime.isAllDay && blockedTime.startTime && blockedTime.endTime) {
      query.startTime = Between(blockedTime.startTime, blockedTime.endTime);
    }

    await this.timeSlotRepository.update(query, {
      status: TimeSlotStatus.BLOCKED,
      notes: `Blocked: ${blockedTime.reason}`,
    });
  }

  private async updateTimeSlotsForBlockedTimeChange(
    oldValues: { blockDate: string; startTime?: string; endTime?: string; isAllDay: boolean; providerId: string },
    newBlockedTime: ProviderBlockedTime,
  ): Promise<void> {
    // Restore old blocked slots
    await this.restoreTimeSlotsFromOldBlockedTime(oldValues);
    
    // Apply new blocked time
    await this.updateTimeSlotsForBlockedTime(newBlockedTime);
  }

  private async restoreTimeSlotsFromBlockedTime(
    blockedTime: ProviderBlockedTime,
  ): Promise<void> {
    // Restore time slots that were blocked
    const query: any = {
      providerId: blockedTime.providerId,
      slotDate: blockedTime.blockDate,
      status: TimeSlotStatus.BLOCKED,
    };

    if (!blockedTime.isAllDay && blockedTime.startTime && blockedTime.endTime) {
      query.startTime = Between(blockedTime.startTime, blockedTime.endTime);
    }

    await this.timeSlotRepository.update(query, {
      status: TimeSlotStatus.AVAILABLE,
      notes: null,
    });
  }

  private async restoreTimeSlotsFromOldBlockedTime(
    oldValues: { blockDate: string; startTime?: string; endTime?: string; isAllDay: boolean; providerId: string },
  ): Promise<void> {
    // Restore time slots that were blocked
    const query: any = {
      providerId: oldValues.providerId,
      slotDate: oldValues.blockDate,
      status: TimeSlotStatus.BLOCKED,
    };

    if (!oldValues.isAllDay && oldValues.startTime && oldValues.endTime) {
      query.startTime = Between(oldValues.startTime, oldValues.endTime);
    }

    await this.timeSlotRepository.update(query, {
      status: TimeSlotStatus.AVAILABLE,
      notes: null,
    });
  }

  private async generateProviderSlotsForDay(
    providerId: string,
    date: string,
    workingHours: ProviderWorkingHours,
    blockedTimes: ProviderBlockedTime[],
    slotDuration: number,
    bufferTime: number,
    serviceId?: string,
    maxBookings = 1,
    skipExisting = true,
  ): Promise<ProviderTimeSlot[]> {
    // Complex slot generation logic would go here
    // This is a simplified version
    const slots: ProviderTimeSlot[] = [];
    
    if (!workingHours.startTime || !workingHours.endTime) {
      return slots;
    }

    // Generate time slots based on working hours
    const startMinutes = this.timeToMinutes(workingHours.startTime);
    const endMinutes = this.timeToMinutes(workingHours.endTime);
    
    let currentMinutes = startMinutes;
    
    while (currentMinutes + slotDuration <= endMinutes) {
      const slotStartTime = this.minutesToTime(currentMinutes);
      const slotEndTime = this.minutesToTime(currentMinutes + slotDuration);
      
      // Check if this slot conflicts with blocked times or breaks
      const isBlocked = this.isTimeSlotBlocked(
        slotStartTime,
        slotEndTime,
        blockedTimes,
        workingHours,
      );
      
      if (!isBlocked) {
        // Check if slot already exists (if skipExisting is true)
        if (skipExisting) {
          const existingSlot = await this.timeSlotRepository.findOne({
            where: {
              providerId,
              slotDate: date,
              startTime: slotStartTime,
            },
          });
          
          if (existingSlot) {
            currentMinutes += slotDuration + bufferTime;
            continue;
          }
        }
        
        const timeSlot = this.timeSlotRepository.create({
          providerId,
          slotDate: date,
          startTime: slotStartTime,
          endTime: slotEndTime,
          durationMinutes: slotDuration,
          bufferTimeMinutes: bufferTime,
          maxBookings,
          serviceId,
          status: TimeSlotStatus.AVAILABLE,
        });
        
        const savedSlot = await this.timeSlotRepository.save(timeSlot);
        slots.push(savedSlot);
      }
      
      currentMinutes += slotDuration + bufferTime;
    }
    
    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private isTimeSlotBlocked(
    startTime: string,
    endTime: string,
    blockedTimes: ProviderBlockedTime[],
    workingHours: ProviderWorkingHours,
  ): boolean {
    // Check if slot falls within break time
    if (workingHours.breakStartTime && workingHours.breakEndTime) {
      if (
        startTime >= workingHours.breakStartTime &&
        startTime < workingHours.breakEndTime
      ) {
        return true;
      }
    }

    // Check against blocked times
    for (const blocked of blockedTimes) {
      if (blocked.isAllDay) {
        return true;
      }

      if (blocked.startTime && blocked.endTime) {
        if (
          startTime >= blocked.startTime &&
          startTime < blocked.endTime
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private groupBlockedTimesByType(blockedTimes: ProviderBlockedTime[]): any {
    const grouped: { [key: string]: number } = {};
    
    for (const type of Object.values(BlockedTimeType)) {
      grouped[type] = blockedTimes.filter(bt => bt.blockType === type).length;
    }
    
    return grouped;
  }

  // =================== SERVICE-SPECIFIC AVAILABILITY METHODS ===================

  /**
   * Get service-specific availability settings
   */
  async getServiceAvailabilitySettings(
    providerId: string, 
    serviceId: string
  ): Promise<ServiceAvailabilitySettings | null> {
    return await this.serviceAvailabilityRepository.findOne({
      where: { providerId, serviceId },
      relations: ['service'],
    });
  }

  /**
   * Create or update service-specific availability settings
   */
  async createOrUpdateServiceAvailabilitySettings(
    providerId: string,
    serviceId: string,
    settingsData: Partial<ServiceAvailabilitySettings>
  ): Promise<ServiceAvailabilitySettings> {
    await this.validateProvider(providerId);
    
    // Verify service belongs to provider
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, providerId },
    });
    
    if (!service) {
      throw new NotFoundException('Service not found for this provider');
    }

    // Check if settings already exist
    let settings = await this.serviceAvailabilityRepository.findOne({
      where: { providerId, serviceId },
    });

    if (settings) {
      // Update existing settings
      Object.assign(settings, settingsData);
      settings = await this.serviceAvailabilityRepository.save(settings);
    } else {
      // Create new settings
      settings = this.serviceAvailabilityRepository.create({
        providerId,
        serviceId,
        ...settingsData,
      });
      settings = await this.serviceAvailabilityRepository.save(settings);
    }

    // Notify clients about service availability update
    await this.websocketGateway.notifyServiceAvailabilityUpdate(
      serviceId, 
      providerId, 
      { settings, type: 'service-settings-updated' }
    );

    return settings;
  }

  /**
   * Get all services with their availability settings for a provider
   */
  async getProviderServicesWithAvailability(
    providerId: string
  ): Promise<{
    serviceId: string;
    serviceName: string;
    defaultSettings: any;
    customSettings: ServiceAvailabilitySettings | null;
    effectiveSettings: any;
  }[]> {
    await this.validateProvider(providerId);

    // Get all services for this provider
    const services = await this.serviceRepository.find({
      where: { providerId },
      select: ['id', 'name', 'durationMinutes', 'bufferTimeMinutes', 'maxAdvanceBookingDays', 'minAdvanceBookingHours'],
    });

    // Get custom availability settings for each service
    const results = [];
    for (const service of services) {
      const customSettings = await this.getServiceAvailabilitySettings(providerId, service.id);
      
      const defaultSettings = {
        durationMinutes: service.durationMinutes,
        bufferTimeMinutes: service.bufferTimeMinutes,
        maxAdvanceBookingDays: service.maxAdvanceBookingDays,
        minAdvanceBookingHours: service.minAdvanceBookingHours,
      };

      const effectiveSettings = {
        durationMinutes: customSettings?.customDurationMinutes || service.durationMinutes,
        bufferTimeMinutes: customSettings?.customBufferTimeMinutes || service.bufferTimeMinutes || 15,
        maxAdvanceBookingDays: customSettings?.customMaxAdvanceBookingDays || service.maxAdvanceBookingDays || 30,
        minAdvanceBookingHours: customSettings?.customMinAdvanceBookingHours || service.minAdvanceBookingHours || 2,
        availableDays: customSettings?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        requiresSpecialScheduling: customSettings?.requiresSpecialScheduling || false,
        allowWeekends: customSettings?.allowWeekends ?? true,
        maxBookingsPerDay: customSettings?.maxBookingsPerDay,
      };

      results.push({
        serviceId: service.id,
        serviceName: service.name,
        defaultSettings,
        customSettings,
        effectiveSettings,
      });
    }

    return results;
  }

  /**
   * Generate time slots for a specific service based on its availability settings
   */
  async generateServiceSpecificTimeSlots(
    providerId: string,
    serviceId: string,
    fromDate: string,
    toDate: string
  ): Promise<ProviderTimeSlot[]> {
    await this.validateProvider(providerId);

    // Get service and its availability settings
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, providerId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const settings = await this.getServiceAvailabilitySettings(providerId, serviceId);

    // Get provider's working hours
    const workingHours = await this.getWorkingHours(providerId);

    // Get blocked times
    const blockedTimes = await this.getBlockedTimes(providerId, fromDate, toDate);

    const slots: ProviderTimeSlot[] = [];
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);

    while (currentDate <= endDate) {
  const dayOfWeek = this.getDayOfWeekFromDate(currentDate);
  const dayWorkingHours = workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isActive);

      if (dayWorkingHours) {
        // Check if service is available on this day
        const serviceAvailableDays = settings?.availableDays || 
          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        if (serviceAvailableDays.includes(dayOfWeek.toLowerCase())) {
          // Use custom working hours for this service if available
          const effectiveWorkingHours = settings?.customWorkingHours?.[dayOfWeek] || {
            startTime: dayWorkingHours.startTime,
            endTime: dayWorkingHours.endTime,
            breakStartTime: dayWorkingHours.breakStartTime,
            breakEndTime: dayWorkingHours.breakEndTime,
          };

          // Generate slots for this day
          const daySlots = await this.generateSlotsForDay(
            providerId,
            serviceId,
            currentDate,
            effectiveWorkingHours,
            settings,
            service,
            blockedTimes
          );

          slots.push(...daySlots);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Save generated slots
    if (slots.length > 0) {
      await this.timeSlotRepository.save(slots);
      
      // Notify clients about new time slots
      await this.websocketGateway.notifyTimeSlotsUpdate(providerId, serviceId, slots);
    }

    return slots;
  }

  /**
   * Get available time slots for a specific service
   */
  async getServiceAvailableTimeSlots(
    providerId: string,
    serviceId: string,
    date: string
  ): Promise<{
    date: string;
    serviceId: string;
    serviceName: string;
    availableSlots: ProviderTimeSlot[];
    totalSlots: number;
    bookedSlots: number;
    customSettings: ServiceAvailabilitySettings | null;
  }> {
    await this.validateProvider(providerId);

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, providerId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const customSettings = await this.getServiceAvailabilitySettings(providerId, serviceId);

    // Get time slots for this service and date
    const allSlots = await this.timeSlotRepository.find({
      where: {
        providerId,
        serviceId,
        slotDate: date,
      },
      order: { startTime: 'ASC' },
    });

    const availableSlots = allSlots.filter(slot => slot.status === TimeSlotStatus.AVAILABLE);
    const bookedSlots = allSlots.filter(slot => slot.status === TimeSlotStatus.BOOKED).length;

    return {
      date,
      serviceId,
      serviceName: service.name,
      availableSlots,
      totalSlots: allSlots.length,
      bookedSlots,
      customSettings,
    };
  }

  /**
   * Delete service-specific availability settings
   */
  async deleteServiceAvailabilitySettings(
    providerId: string,
    serviceId: string
  ): Promise<void> {
    await this.validateProvider(providerId);

    const settings = await this.serviceAvailabilityRepository.findOne({
      where: { providerId, serviceId },
    });

    if (settings) {
      await this.serviceAvailabilityRepository.remove(settings);
      
      // Notify clients about settings removal
      await this.websocketGateway.notifyServiceAvailabilityUpdate(
        serviceId, 
        providerId, 
        { type: 'service-settings-deleted' }
      );
    }
  }

  // =================== HELPER METHODS FOR SERVICE-SPECIFIC AVAILABILITY ===================

  private async generateSlotsForDay(
    providerId: string,
    serviceId: string,
    date: Date,
    workingHours: any,
    settings: ServiceAvailabilitySettings | null,
    service: Service,
    blockedTimes: ProviderBlockedTime[]
  ): Promise<ProviderTimeSlot[]> {
    const slots: ProviderTimeSlot[] = [];
    const dateStr = date.toISOString().split('T')[0];

    // Check if this date is blocked
    const isDateBlocked = blockedTimes.some(bt => 
      bt.blockDate === dateStr && bt.isAllDay
    );

    if (isDateBlocked) {
      return slots;
    }

    // Get effective duration and buffer time
    const durationMinutes = settings?.customDurationMinutes || service.durationMinutes;
    const bufferMinutes = settings?.customBufferTimeMinutes || 15;
    const preparationMinutes = settings?.preparationTimeMinutes || 0;
    const cleanupMinutes = settings?.cleanupTimeMinutes || 0;

    // Calculate total slot time
    const totalSlotTime = durationMinutes + bufferMinutes + preparationMinutes + cleanupMinutes;

    // Generate time slots
    const startTime = workingHours.startTime;
    const endTime = workingHours.endTime;
    const breakStart = workingHours.breakStartTime;
    const breakEnd = workingHours.breakEndTime;

    let currentTime = this.timeStringToMinutes(startTime);
    const endTimeMinutes = this.timeStringToMinutes(endTime);
    const breakStartMinutes = breakStart ? this.timeStringToMinutes(breakStart) : null;
    const breakEndMinutes = breakEnd ? this.timeStringToMinutes(breakEnd) : null;

    while (currentTime + totalSlotTime <= endTimeMinutes) {
      // Check if slot conflicts with break time
      if (breakStartMinutes && breakEndMinutes) {
        if (currentTime < breakEndMinutes && currentTime + totalSlotTime > breakStartMinutes) {
          // Slot conflicts with break, skip to after break
          currentTime = breakEndMinutes;
          continue;
        }
      }

      // Check if slot conflicts with blocked times
      const slotStart = this.minutesToTimeString(currentTime);
      const slotEnd = this.minutesToTimeString(currentTime + totalSlotTime);
      
      const isSlotBlocked = blockedTimes.some(bt => 
        bt.blockDate === dateStr && 
        !bt.isAllDay &&
        bt.startTime &&
        bt.endTime &&
        this.timeRangesOverlap(slotStart, slotEnd, bt.startTime, bt.endTime)
      );

      if (!isSlotBlocked) {
        // Create time slot
        const slot = this.timeSlotRepository.create({
          providerId,
          serviceId,
          slotDate: dateStr,
          startTime: slotStart,
          endTime: this.minutesToTimeString(currentTime + durationMinutes),
          durationMinutes,
          bufferTimeMinutes: bufferMinutes,
          status: TimeSlotStatus.AVAILABLE,
          isManuallyCreated: false,
          isBreakSlot: false,
          maxBookings: 1,
          currentBookings: 0,
          customPrice: service.basePrice,
        });

        slots.push(slot);
      }

      currentTime += totalSlotTime;
    }

    return slots;
  }

  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const start1Minutes = this.timeStringToMinutes(start1);
    const end1Minutes = this.timeStringToMinutes(end1);
    const start2Minutes = this.timeStringToMinutes(start2);
    const end2Minutes = this.timeStringToMinutes(end2);

    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
  }
}