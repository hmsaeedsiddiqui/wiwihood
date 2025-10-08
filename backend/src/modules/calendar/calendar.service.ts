import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { Booking } from '../../entities/booking.entity';
import { RecurringBooking } from '../../entities/recurring-booking.entity';

export interface ICSEvent {
  uid: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendee?: {
    name: string;
    email: string;
  };
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarRepository: Repository<CalendarEvent>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(RecurringBooking)
    private recurringBookingRepository: Repository<RecurringBooking>,
  ) {}

  async create(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const event = this.calendarRepository.create(data);
    return this.calendarRepository.save(event);
  }

  async findAll(): Promise<CalendarEvent[]> {
    return this.calendarRepository.find({ order: { start: 'DESC' } });
  }

  async findOne(id: string): Promise<CalendarEvent | null> {
    return this.calendarRepository.findOneBy({ id });
  }

  /**
   * Generate ICS calendar content for events
   */
  generateICS(events: ICSEvent[]): string {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Reservista//Booking System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    events.forEach(event => {
      icsLines.push(...this.generateEventLines(event));
    });

    icsLines.push('END:VCALENDAR');
    return icsLines.join('\r\n');
  }

  /**
   * Generate individual event lines for ICS
   */
  private generateEventLines(event: ICSEvent): string[] {
    const lines = [
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTART:${this.formatDateForICS(event.startDate)}`,
      `DTEND:${this.formatDateForICS(event.endDate)}`,
      `DTSTAMP:${this.formatDateForICS(new Date())}`,
      `SUMMARY:${this.escapeICSText(event.title)}`,
    ];

    if (event.description) {
      lines.push(`DESCRIPTION:${this.escapeICSText(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${this.escapeICSText(event.location)}`);
    }

    if (event.organizer) {
      lines.push(`ORGANIZER;CN=${this.escapeICSText(event.organizer.name)}:MAILTO:${event.organizer.email}`);
    }

    if (event.attendee) {
      lines.push(`ATTENDEE;CN=${this.escapeICSText(event.attendee.name)}:MAILTO:${event.attendee.email}`);
    }

    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');

    return lines;
  }

  /**
   * Format date for ICS format (YYYYMMDDTHHMMSSZ)
   */
  private formatDateForICS(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /**
   * Escape special characters for ICS text fields
   */
  private escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  /**
   * Get calendar events for a user's bookings
   */
  async getUserBookingEvents(userId: string): Promise<ICSEvent[]> {
    const bookings = await this.bookingRepository.find({
      where: { customer: { id: userId } },
      relations: ['service', 'provider', 'customer'],
    });

    return bookings.map(booking => this.mapBookingToEvent(booking));
  }

  /**
   * Get calendar events for a provider's bookings
   */
  async getProviderBookingEvents(providerId: string): Promise<ICSEvent[]> {
    const bookings = await this.bookingRepository.find({
      where: { provider: { id: providerId } },
      relations: ['service', 'provider', 'customer'],
    });

    return bookings.map(booking => this.mapBookingToEvent(booking));
  }

  /**
   * Map booking to calendar event
   */
  private mapBookingToEvent(booking: Booking): ICSEvent {
    const endDate = new Date(booking.startDateTime);
    endDate.setMinutes(endDate.getMinutes() + booking.service.durationMinutes);

    return {
      uid: `booking-${booking.id}`,
      title: booking.service.name,
      description: `Appointment for ${booking.service.name} with ${booking.provider.businessName}`,
      startDate: booking.startDateTime,
      endDate,
      location: booking.provider.address,
      organizer: {
        name: booking.provider.businessName,
        email: booking.provider.user.email,
      },
      attendee: {
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
        email: booking.customer.email,
      },
    };
  }

  /**
   * Generate ICS file for user bookings
   */
  async generateUserBookingICS(userId: string): Promise<string> {
    const events = await this.getUserBookingEvents(userId);
    return this.generateICS(events);
  }

  /**
   * Generate ICS file for provider bookings
   */
  async generateProviderBookingICS(providerId: string): Promise<string> {
    const events = await this.getProviderBookingEvents(providerId);
    return this.generateICS(events);
  }
}
