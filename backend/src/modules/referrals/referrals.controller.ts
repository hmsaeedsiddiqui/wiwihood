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
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto, CreateReferralCampaignDto, UpdateReferralCampaignDto, CompleteReferralDto } from './dto/referral.dto';
import { ReferralCode, Referral, ReferralCampaign } from '../../entities/referral.entity';

@ApiTags('Referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my-code')
  @ApiOperation({ summary: 'Get user referral code' })
  @ApiQuery({
    name: 'includeStats',
    required: false,
    description: 'Include usage statistics',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'format',
    required: false,
    description: 'Response format (full or minimal)',
    enum: ['full', 'minimal'],
    example: 'full',
  })
  @ApiResponse({
    status: 200,
    description: 'Referral code retrieved successfully',
    type: ReferralCode,
  })
  async getUserReferralCode(
    @Request() req: any,
    @Query('includeStats') includeStats?: boolean,
    @Query('format') format?: string,
  ): Promise<ReferralCode | any> {
    const referralCode = await this.referralsService.getUserReferralCode(req.user.id, includeStats);
    
    if (format === 'minimal') {
      return {
        code: referralCode.code,
        totalUses: referralCode.totalUses || referralCode.uses_count || 0,
        isActive: referralCode.isActive || referralCode.is_active,
      };
    }
    
    return referralCode;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new referral' })
  @ApiResponse({
    status: 201,
    description: 'Referral created successfully',
    type: Referral,
  })
  async createReferral(
    @Body() createReferralDto: CreateReferralDto,
    @Request() req: any,
  ): Promise<Referral> {
    return this.referralsService.createReferral(createReferralDto, req.user.id);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete a referral (when referee makes first booking)' })
  @ApiBody({
    type: CompleteReferralDto,
    description: 'Referral completion data',
    examples: {
      example1: {
        summary: 'Complete referral example',
        value: {
          referralId: '550e8400-e29b-41d4-a716-446655440000',
          bookingId: '550e8400-e29b-41d4-a716-446655440001'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Referral completed successfully',
    type: Referral,
  })
  async completeReferral(@Body() completeReferralDto: CompleteReferralDto): Promise<Referral> {
    return this.referralsService.completeReferral(completeReferralDto);
  }

  @Get('my-referrals')
  @ApiOperation({ summary: 'Get user referrals' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by referral status',
    enum: ['pending', 'completed', 'expired', 'cancelled'],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'User referrals retrieved successfully',
    type: [Referral],
  })
  async getUserReferrals(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Referral[]> {
    return this.referralsService.getUserReferrals(req.user.id, status, limit, offset);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user referral statistics' })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'Filter stats from date (YYYY-MM-DD)',
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'Filter stats to date (YYYY-MM-DD)',
    type: String,
    example: '2025-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Referral statistics retrieved successfully',
  })
  async getReferralStats(
    @Request() req: any,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.referralsService.getReferralStats(req.user.id, fromDate, toDate);
  }

  @Post('validate/:code')
  @ApiOperation({ summary: 'Validate referral code' })
  @ApiParam({ name: 'code', description: 'Referral code to validate' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'User ID to check eligibility (optional)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Referral code validation result',
  })
  async validateReferralCode(
    @Param('code') code: string,
    @Query('userId') userId?: string,
  ) {
    return this.referralsService.validateReferralCode(code, userId);
  }

  // Admin endpoints for campaign management
  @Post('campaigns')
  @ApiOperation({ summary: 'Create referral campaign (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 201,
    description: 'Campaign created successfully',
    type: ReferralCampaign,
  })
  async createCampaign(@Body() createCampaignDto: CreateReferralCampaignDto): Promise<ReferralCampaign> {
    return this.referralsService.createCampaign(createCampaignDto);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get all referral campaigns (Admin only)' })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'rewardType',
    required: false,
    description: 'Filter by reward type',
    enum: ['points', 'discount', 'cash', 'free_service'],
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
    description: 'Campaigns retrieved successfully',
    type: [ReferralCampaign],
  })
  async getAllCampaigns(
    @Query('isActive') isActive?: boolean,
    @Query('rewardType') rewardType?: string,
    @Query('limit') limit?: number,
  ): Promise<ReferralCampaign[]> {
    return this.referralsService.getAllCampaigns(isActive, rewardType, limit);
  }

  @Get('campaigns/active')
  @ApiOperation({ summary: 'Get active referral campaign' })
  @ApiResponse({
    status: 200,
    description: 'Active campaign retrieved successfully',
    type: ReferralCampaign,
  })
  async getActiveCampaign(): Promise<ReferralCampaign | null> {
    return this.referralsService.getActiveCampaign();
  }

  @Patch('campaigns/:id')
  @ApiOperation({ summary: 'Update referral campaign (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaign updated successfully',
    type: ReferralCampaign,
  })
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateReferralCampaignDto,
  ): Promise<ReferralCampaign> {
    return this.referralsService.updateCampaign(id, updateCampaignDto);
  }

  @Delete('campaigns/:id')
  @ApiOperation({ summary: 'Delete referral campaign (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaign deleted successfully',
  })
  async deleteCampaign(@Param('id') id: string): Promise<{ message: string }> {
    await this.referralsService.deleteCampaign(id);
    return { message: 'Campaign deleted successfully' };
  }
}