import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200, description: 'Support tickets retrieved successfully' })
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get support ticket by ID' })
  @ApiParam({ name: 'id', description: 'Support ticket ID' })
  @ApiResponse({ status: 200, description: 'Support ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new support ticket' })
  @ApiResponse({ status: 201, description: 'Support ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: any) {
    return this.supportTicketsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update support ticket by ID' })
  @ApiParam({ name: 'id', description: 'Support ticket ID' })
  @ApiResponse({ status: 200, description: 'Support ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.supportTicketsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete support ticket by ID' })
  @ApiParam({ name: 'id', description: 'Support ticket ID' })
  @ApiResponse({ status: 200, description: 'Support ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  remove(@Param('id') id: string) {
    return this.supportTicketsService.remove(id);
  }
}
