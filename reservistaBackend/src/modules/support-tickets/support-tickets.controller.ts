import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Get()
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.supportTicketsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.supportTicketsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportTicketsService.remove(id);
  }
}
