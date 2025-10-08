import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecurringAppointmentsService } from './recurring-appointments.service';
import { CreateRecurringAppointmentDto } from './dto/create-recurring-appointment.dto';
import { UpdateRecurringAppointmentDto } from './dto/update-recurring-appointment.dto';

@ApiTags('recurring-appointments')
@Controller('recurring-appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecurringAppointmentsController {
  constructor(private readonly recurringAppointmentsService: RecurringAppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a recurring appointment' })
  @ApiResponse({ status: 201, description: 'Recurring appointment created successfully.' })
  create(@Body() createRecurringAppointmentDto: CreateRecurringAppointmentDto, @Request() req) {
    return this.recurringAppointmentsService.create(createRecurringAppointmentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recurring appointments for provider' })
  @ApiResponse({ status: 200, description: 'Recurring appointments retrieved successfully.' })
  findAll(@Request() req, @Query('status') status?: string) {
    return this.recurringAppointmentsService.findAll(req.user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific recurring appointment' })
  @ApiResponse({ status: 200, description: 'Recurring appointment retrieved successfully.' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.recurringAppointmentsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recurring appointment' })
  @ApiResponse({ status: 200, description: 'Recurring appointment updated successfully.' })
  update(@Param('id') id: string, @Body() updateRecurringAppointmentDto: UpdateRecurringAppointmentDto, @Request() req) {
    return this.recurringAppointmentsService.update(id, updateRecurringAppointmentDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recurring appointment' })
  @ApiResponse({ status: 200, description: 'Recurring appointment deleted successfully.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.recurringAppointmentsService.remove(id, req.user.id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a recurring appointment' })
  @ApiResponse({ status: 200, description: 'Recurring appointment paused successfully.' })
  pause(@Param('id') id: string, @Request() req) {
    return this.recurringAppointmentsService.pause(id, req.user.id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a recurring appointment' })
  @ApiResponse({ status: 200, description: 'Recurring appointment resumed successfully.' })
  resume(@Param('id') id: string, @Request() req) {
    return this.recurringAppointmentsService.resume(id, req.user.id);
  }
}