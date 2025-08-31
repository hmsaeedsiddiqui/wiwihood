import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PayoutsService } from './payouts.service';

@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  findAll() {
    return this.payoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payoutsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.payoutsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.payoutsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payoutsService.remove(id);
  }
}
