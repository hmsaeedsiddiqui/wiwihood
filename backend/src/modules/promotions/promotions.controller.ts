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
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import {
  CreatePromotionDto,
  UpdatePromotionDto,
  ValidatePromotionDto,
  PromotionResponseDto,
} from './dto/promotion.dto';
import { PromotionStatus } from '../../entities/promotion.entity';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({
    status: 201,
    description: 'Promotion successfully created',
    type: PromotionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - promotion code already exists',
  })
  async create(
    @Request() req,
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<PromotionResponseDto> {
    // If user is a provider, set their provider ID
    if (req.user.role === 'provider' && !createPromotionDto.providerId) {
      createPromotionDto.providerId = req.user.provider?.id;
    }
    
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions with optional filters' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' })
  @ApiQuery({ name: 'status', required: false, enum: PromotionStatus, description: 'Filter by status' })
  @ApiResponse({
    status: 200,
    description: 'Promotions retrieved successfully',
    type: [PromotionResponseDto],
  })
  async findAll(
    @Query('providerId') providerId?: string,
    @Query('status') status?: PromotionStatus,
  ): Promise<PromotionResponseDto[]> {
    return this.promotionsService.findAll(providerId, status);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active promotions' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Active promotions retrieved successfully',
    type: [PromotionResponseDto],
  })
  async findActivePromotions(
    @Query('providerId') providerId?: string,
  ): Promise<PromotionResponseDto[]> {
    return this.promotionsService.findActivePromotions(providerId);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured promotions for homepage' })
  @ApiResponse({
    status: 200,
    description: 'Featured promotions retrieved successfully',
    type: [PromotionResponseDto],
  })
  async findFeaturedPromotions(): Promise<PromotionResponseDto[]> {
    return this.promotionsService.findActivePromotions();
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a promotion code' })
  @ApiResponse({
    status: 200,
    description: 'Promotion validation result',
    schema: {
      type: 'object',
      properties: {
        valid: { 
          type: 'boolean', 
          example: true, 
          description: 'Whether the promotion is valid' 
        },
        promotion: { 
          $ref: '#/components/schemas/PromotionResponseDto',
          description: 'Promotion details if valid'
        },
        discountAmount: { 
          type: 'number', 
          example: 20.00,
          description: 'Calculated discount amount'
        },
        finalAmount: { 
          type: 'number', 
          example: 80.00,
          description: 'Final amount after discount'
        },
        reason: { 
          type: 'string', 
          example: 'Promotion code not found',
          description: 'Reason for invalid promotion (if applicable)'
        },
      },
      example: {
        valid: true,
        promotion: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'New Customer Welcome',
          code: 'WELCOME20',
          type: 'percentage',
          discountValue: 20,
          status: 'active'
        },
        discountAmount: 20.00,
        finalAmount: 80.00
      }
    },
  })
  async validatePromotion(@Body() validateDto: ValidatePromotionDto): Promise<any> {
    return this.promotionsService.validatePromotion(validateDto);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get promotion by code' })
  @ApiParam({ name: 'code', description: 'Promotion code' })
  @ApiResponse({
    status: 200,
    description: 'Promotion retrieved successfully',
    type: PromotionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found',
  })
  async findByCode(@Param('code') code: string): Promise<PromotionResponseDto> {
    return this.promotionsService.findByCode(code);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current provider promotions' })
  @ApiResponse({
    status: 200,
    description: 'Provider promotions retrieved successfully',
    type: [PromotionResponseDto],
  })
  async getMyPromotions(@Request() req): Promise<PromotionResponseDto[]> {
    const providerId = req.user.provider?.id;
    return this.promotionsService.findAll(providerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion retrieved successfully',
    type: PromotionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PromotionResponseDto> {
    return this.promotionsService.findOne(id);
  }

  @Get(':id/usage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion usage statistics' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion usage retrieved successfully',
  })
  async getPromotionUsage(@Param('id', ParseUUIDPipe) id: string): Promise<any[]> {
    return this.promotionsService.getPromotionUsage(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promotion by ID' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion updated successfully',
    type: PromotionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<PromotionResponseDto> {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promotion by ID' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.promotionsService.remove(id);
    return { message: 'Promotion deleted successfully' };
  }
}