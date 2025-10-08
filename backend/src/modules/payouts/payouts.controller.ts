import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';

@ApiTags('Payouts')
@ApiBearerAuth()
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payouts' })
  @ApiResponse({ status: 200, description: 'List of payouts retrieved successfully' })
  findAll() {
    return this.payoutsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payout by ID' })
  @ApiParam({ name: 'id', description: 'Payout ID' })
  @ApiResponse({ status: 200, description: 'Payout retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payout not found' })
  findOne(@Param('id') id: string) {
    return this.payoutsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new payout' })
  @ApiResponse({ status: 201, description: 'Payout created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: any) {
    return this.payoutsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payout by ID' })
  @ApiParam({ name: 'id', description: 'Payout ID' })
  @ApiResponse({ status: 200, description: 'Payout updated successfully' })
  @ApiResponse({ status: 404, description: 'Payout not found' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.payoutsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payout by ID' })
  @ApiParam({ name: 'id', description: 'Payout ID' })
  @ApiResponse({ status: 200, description: 'Payout deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payout not found' })
  remove(@Param('id') id: string) {
    return this.payoutsService.remove(id);
  }
}
