import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeBlocksService } from './time-blocks.service';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { UpdateTimeBlockDto } from './dto/update-time-block.dto';

@ApiTags('time-blocks')
@Controller('time-blocks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeBlocksController {
  constructor(private readonly timeBlocksService: TimeBlocksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a time block' })
  @ApiResponse({ status: 201, description: 'Time block created successfully.' })
  create(@Body() createTimeBlockDto: CreateTimeBlockDto, @Request() req) {
    return this.timeBlocksService.create(createTimeBlockDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all time blocks for provider' })
  @ApiResponse({ status: 200, description: 'Time blocks retrieved successfully.' })
  findAll(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.timeBlocksService.findAll(req.user.id, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific time block' })
  @ApiResponse({ status: 200, description: 'Time block retrieved successfully.' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.timeBlocksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a time block' })
  @ApiResponse({ status: 200, description: 'Time block updated successfully.' })
  update(@Param('id') id: string, @Body() updateTimeBlockDto: UpdateTimeBlockDto, @Request() req) {
    return this.timeBlocksService.update(id, updateTimeBlockDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time block' })
  @ApiResponse({ status: 200, description: 'Time block deleted successfully.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.timeBlocksService.remove(id, req.user.id);
  }
}