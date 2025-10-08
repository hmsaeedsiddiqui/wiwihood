import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CmsService } from './cms.service';

@ApiTags('CMS')
@ApiBearerAuth()
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all CMS content' })
  @ApiResponse({ status: 200, description: 'CMS content retrieved successfully' })
  findAll() {
    return this.cmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CMS content by ID' })
  @ApiParam({ name: 'id', description: 'CMS content ID' })
  @ApiResponse({ status: 200, description: 'CMS content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'CMS content not found' })
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get CMS content by slug' })
  @ApiParam({ name: 'slug', description: 'CMS content slug' })
  @ApiResponse({ status: 200, description: 'CMS content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'CMS content not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create new CMS content' })
  @ApiResponse({ status: 201, description: 'CMS content created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() data: any) {
    return this.cmsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update CMS content by ID' })
  @ApiParam({ name: 'id', description: 'CMS content ID' })
  @ApiResponse({ status: 200, description: 'CMS content updated successfully' })
  @ApiResponse({ status: 404, description: 'CMS content not found' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete CMS content by ID' })
  @ApiParam({ name: 'id', description: 'CMS content ID' })
  @ApiResponse({ status: 200, description: 'CMS content deleted successfully' })
  @ApiResponse({ status: 404, description: 'CMS content not found' })
  remove(@Param('id') id: string) {
    return this.cmsService.remove(id);
  }
}
