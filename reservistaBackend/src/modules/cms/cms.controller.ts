import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  findAll() {
    return this.cmsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: any) {
    return this.cmsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmsService.remove(id);
  }
}
