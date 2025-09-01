import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarRepository: Repository<CalendarEvent>,
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
}
