import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Category } from '../../entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @Get()
  async findAll(@Query('isActive') isActive?: boolean): Promise<Category[]> {
    return await this.categoriesService.findAll(isActive);
  }

  @ApiOperation({ summary: 'Get featured categories' })
  @ApiResponse({
    status: 200,
    description: 'Featured categories retrieved successfully',
    type: [Category],
  })
  @Get('featured')
  async findFeatured(): Promise<Category[]> {
    return await this.categoriesService.findFeatured();
  }

  @ApiOperation({ summary: 'Search categories' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [Category],
  })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @Get('search')
  async search(@Query('q') query: string): Promise<Category[]> {
    return await this.categoriesService.search(query);
  }

  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoriesService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Toggle category active status' })
  @ApiResponse({
    status: 200,
    description: 'Category status toggled successfully',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoriesService.toggleActiveStatus(id);
  }

  @ApiOperation({ summary: 'Toggle category featured status' })
  @ApiResponse({
    status: 200,
    description: 'Category featured status toggled successfully',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-featured')
  async toggleFeatured(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoriesService.toggleFeaturedStatus(id);
  }

  @ApiOperation({ summary: 'Update category sort order' })
  @ApiResponse({
    status: 200,
    description: 'Category order updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('sort-order')
  async updateSortOrder(
    @Body() categoryOrders: { id: string; sortOrder: number }[],
  ): Promise<void> {
    await this.categoriesService.updateSortOrder(categoryOrders);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete category with services' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
