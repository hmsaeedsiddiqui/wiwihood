import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from '../../entities/calendar-event.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async create(@Body() data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.calendarService.create(data);
  }

  @Get()
  async findAll(): Promise<CalendarEvent[]> {
    return this.calendarService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CalendarEvent | null> {
    return this.calendarService.findOne(id);
  }
}
