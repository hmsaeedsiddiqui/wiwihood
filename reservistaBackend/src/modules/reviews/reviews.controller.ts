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
  Req,
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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewFilterDto, ProviderResponseDto } from './dto/review-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Review } from '../../entities/review.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Review,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ): Promise<Review> {
    return await this.reviewsService.create(createReviewDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all reviews with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: [Review],
  })
  @ApiQuery({ name: 'providerId', required: false, description: 'Provider ID filter' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Customer ID filter' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating filter' })
  @ApiQuery({ name: 'maxRating', required: false, description: 'Maximum rating filter' })
  @ApiQuery({ name: 'isPublished', required: false, description: 'Published status filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @Get()
  async findAll(@Query() filters: ReviewFilterDto): Promise<Review[]> {
    return await this.reviewsService.findAll(filters);
  }

  @ApiOperation({ summary: 'Get reviews by provider' })
  @ApiResponse({
    status: 200,
    description: 'Provider reviews retrieved successfully',
    type: [Review],
  })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiQuery({ name: 'onlyPublished', required: false, description: 'Show only published reviews' })
  @Get('provider/:providerId')
  async findByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('onlyPublished') onlyPublished?: string,
  ): Promise<Review[]> {
    const showOnlyPublished = onlyPublished !== 'false';
    return await this.reviewsService.findByProvider(providerId, showOnlyPublished);
  }

  @ApiOperation({ summary: 'Get provider review statistics' })
  @ApiResponse({
    status: 200,
    description: 'Provider stats retrieved successfully',
  })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @Get('provider/:providerId/stats')
  async getProviderStats(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    return await this.reviewsService.getProviderStats(providerId);
  }

  @ApiOperation({ summary: 'Get my reviews' })
  @ApiResponse({
    status: 200,
    description: 'Customer reviews retrieved successfully',
    type: [Review],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  async findMyReviews(@Req() req: any): Promise<Review[]> {
    return await this.reviewsService.findByCustomer(req.user.id);
  }

  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully',
    type: Review,
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Review> {
    return await this.reviewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: Review,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ): Promise<Review> {
    return await this.reviewsService.update(id, updateReviewDto, req.user.id);
  }

  @ApiOperation({ summary: 'Add provider response to review' })
  @ApiResponse({
    status: 200,
    description: 'Provider response added successfully',
    type: Review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @Patch(':id/response')
  async addProviderResponse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() responseDto: ProviderResponseDto,
    @Req() req: any,
  ): Promise<Review> {
    return await this.reviewsService.addProviderResponse(id, responseDto, req.user.id);
  }

  @ApiOperation({ summary: 'Toggle review published status' })
  @ApiResponse({
    status: 200,
    description: 'Review status toggled successfully',
    type: Review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Patch(':id/toggle-published')
  async togglePublished(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<Review> {
    return await this.reviewsService.togglePublishedStatus(id, req.user.id);
  }

  @ApiOperation({ summary: 'Toggle review verified status (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Review verification status toggled successfully',
    type: Review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-verified')
  async toggleVerified(@Param('id', ParseUUIDPipe) id: string): Promise<Review> {
    return await this.reviewsService.toggleVerifiedStatus(id);
  }

  @ApiOperation({ summary: 'Fix orphan reviews by associating them with correct providers' })
  @ApiResponse({
    status: 200,
    description: 'Orphan reviews fixed successfully',
    schema: {
      type: 'object',
      properties: {
        fixed: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @Post('fix-orphan-reviews')
  async fixOrphanReviews(@Req() req: any): Promise<{ fixed: number; message: string }> {
    return await this.reviewsService.fixOrphanReviews();
  }

  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({
    status: 204,
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    await this.reviewsService.remove(id, req.user.id, req.user.role);
  }
}
