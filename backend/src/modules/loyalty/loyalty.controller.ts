import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { LoyaltyService } from './loyalty.service';
import { AddPointsDto, RedeemPointsDto, CreateLoyaltyRewardDto, UpdateLoyaltyRewardDto } from './dto/loyalty.dto';
import { LoyaltyAccount, PointTransaction, LoyaltyReward } from '../../entities/loyalty.entity';

@ApiTags('Loyalty Program')
@Controller('loyalty')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('account')
  @ApiOperation({ summary: 'Get user loyalty account' })
  @ApiResponse({
    status: 200,
    description: 'Loyalty account retrieved successfully',
    type: LoyaltyAccount,
  })
  async getLoyaltyAccount(@Request() req: any): Promise<LoyaltyAccount> {
    return this.loyaltyService.getLoyaltyAccount(req.user.id);
  }

  @Post('add-points')
  @ApiOperation({ summary: 'Add points to user account (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 200,
    description: 'Points added successfully',
    type: LoyaltyAccount,
  })
  async addPoints(
    @Body() addPointsDto: AddPointsDto,
    @Query('userId') userId: string,
  ): Promise<LoyaltyAccount> {
    return this.loyaltyService.addPoints(userId, addPointsDto);
  }

  @Post('redeem-points')
  @ApiOperation({ summary: 'Redeem points for rewards' })
  @ApiResponse({
    status: 200,
    description: 'Points redeemed successfully',
    type: LoyaltyAccount,
  })
  async redeemPoints(
    @Body() redeemPointsDto: RedeemPointsDto,
    @Request() req: any,
  ): Promise<LoyaltyAccount> {
    return this.loyaltyService.redeemPoints(req.user.id, redeemPointsDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get points transaction history' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of transactions to return' })
  @ApiResponse({
    status: 200,
    description: 'Points history retrieved successfully',
    type: [PointTransaction],
  })
  async getPointsHistory(
    @Request() req: any,
    @Query('limit') limit?: number,
  ): Promise<PointTransaction[]> {
    return this.loyaltyService.getPointsHistory(req.user.id, limit || 50);
  }

  @Get('rewards')
  @ApiOperation({ summary: 'Get all available rewards' })
  @ApiQuery({
    name: 'tier',
    required: false,
    description: 'Filter by minimum tier (bronze, silver, gold, platinum)',
    enum: ['bronze', 'silver', 'gold', 'platinum'],
  })
  @ApiQuery({
    name: 'maxPoints',
    required: false,
    description: 'Filter by maximum points required',
    type: Number,
    example: 1000,
  })
  @ApiQuery({
    name: 'minPoints',
    required: false,
    description: 'Filter by minimum points required',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Available rewards retrieved successfully',
    type: [LoyaltyReward],
  })
  async getAvailableRewards(
    @Request() req: any,
    @Query('tier') tier?: string,
    @Query('maxPoints') maxPoints?: number,
    @Query('minPoints') minPoints?: number,
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyReward[]> {
    return this.loyaltyService.getAvailableRewards(req.user.id, {
      tier,
      maxPoints,
      minPoints,
      isActive,
      limit,
    });
  }

  @Get('rewards/eligible')
  @ApiOperation({ summary: 'Get rewards user can redeem' })
  @ApiQuery({
    name: 'tier',
    required: false,
    description: 'Filter by specific tier (bronze, silver, gold, platinum)',
    enum: ['bronze', 'silver', 'gold', 'platinum'],
  })
  @ApiQuery({
    name: 'maxPoints',
    required: false,
    description: 'Filter by maximum points required',
    type: Number,
    example: 1000,
  })
  @ApiQuery({
    name: 'minPoints',
    required: false,
    description: 'Filter by minimum points required',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Eligible rewards retrieved successfully',
    type: [LoyaltyReward],
  })
  async getEligibleRewards(
    @Request() req: any,
    @Query('tier') tier?: string,
    @Query('maxPoints') maxPoints?: number,
    @Query('minPoints') minPoints?: number,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyReward[]> {
    return this.loyaltyService.getEligibleRewards(
      req.user.id,
      tier as any,
      maxPoints,
      minPoints,
      limit,
    );
  }

  // Admin endpoints for managing rewards
  @Post('rewards')
  @ApiOperation({ summary: 'Create new loyalty reward (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 201,
    description: 'Reward created successfully',
    type: LoyaltyReward,
  })
  async createReward(@Body() createRewardDto: CreateLoyaltyRewardDto): Promise<LoyaltyReward> {
    return this.loyaltyService.createReward(createRewardDto);
  }

  @Get('rewards/all')
  @ApiOperation({ summary: 'Get all rewards (Admin only)' })
  @ApiQuery({
    name: 'tier',
    required: false,
    description: 'Filter by specific tier (bronze, silver, gold, platinum)',
    enum: ['bronze', 'silver', 'gold', 'platinum'],
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'maxPoints',
    required: false,
    description: 'Filter by maximum points required',
    type: Number,
    example: 1000,
  })
  @ApiQuery({
    name: 'minPoints',
    required: false,
    description: 'Filter by minimum points required',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 10,
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 200,
    description: 'All rewards retrieved successfully',
    type: [LoyaltyReward],
  })
  async getAllRewards(
    @Query('tier') tier?: string,
    @Query('isActive') isActive?: boolean,
    @Query('maxPoints') maxPoints?: number,
    @Query('minPoints') minPoints?: number,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyReward[]> {
    return this.loyaltyService.getAllRewards(
      tier as any,
      isActive,
      maxPoints,
      minPoints,
      limit,
    );
  }

  @Patch('rewards/:id')
  @ApiOperation({ summary: 'Update loyalty reward (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'Reward ID' })
  @ApiResponse({
    status: 200,
    description: 'Reward updated successfully',
    type: LoyaltyReward,
  })
  async updateReward(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateLoyaltyRewardDto,
  ): Promise<LoyaltyReward> {
    return this.loyaltyService.updateReward(id, updateRewardDto);
  }

  @Delete('rewards/:id')
  @ApiOperation({ summary: 'Delete loyalty reward (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'Reward ID' })
  @ApiResponse({
    status: 200,
    description: 'Reward deleted successfully',
  })
  async deleteReward(@Param('id') id: string): Promise<{ message: string }> {
    await this.loyaltyService.deleteReward(id);
    return { message: 'Reward deleted successfully' };
  }

  @Post('review-bonus')
  @ApiOperation({ summary: 'Add review bonus points' })
  @ApiResponse({
    status: 200,
    description: 'Review bonus added successfully',
    type: LoyaltyAccount,
  })
  async addReviewBonus(
    @Request() req: any,
    @Body('reviewId') reviewId: string,
  ): Promise<LoyaltyAccount> {
    return this.loyaltyService.addReviewBonus(req.user.id, reviewId);
  }

  @Post('birthday-bonus')
  @ApiOperation({ summary: 'Add birthday bonus points' })
  @ApiResponse({
    status: 200,
    description: 'Birthday bonus added successfully',
    type: LoyaltyAccount,
  })
  async addBirthdayBonus(@Request() req: any): Promise<LoyaltyAccount> {
    return this.loyaltyService.addBirthdayBonus(req.user.id);
  }
}