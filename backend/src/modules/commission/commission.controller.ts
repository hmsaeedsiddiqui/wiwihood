import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Body,
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
import { CommissionService } from './commission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';

@ApiTags('Commission')
@Controller('commission')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post('process/:bookingId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Process commission for a booking (Admin only)' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({
    status: 201,
    description: 'Commission processed successfully',
  })
  async processBookingCommission(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return this.commissionService.processBookingCommission(bookingId);
  }

  @Get('analytics')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get commission analytics (Admin only)' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Commission analytics retrieved successfully',
  })
  async getCommissionAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const dateFromObj = dateFrom ? new Date(dateFrom) : undefined;
    const dateToObj = dateTo ? new Date(dateTo) : undefined;
    
    return this.commissionService.getCommissionAnalytics(dateFromObj, dateToObj);
  }

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get commission dashboard data (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Commission dashboard data retrieved successfully',
  })
  async getCommissionDashboard() {
    return this.commissionService.getCommissionDashboard();
  }

  @Get('provider/:providerId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Get provider commission report' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Provider commission report retrieved successfully',
  })
  async getProviderCommissionReport(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const dateFromObj = dateFrom ? new Date(dateFrom) : undefined;
    const dateToObj = dateTo ? new Date(dateTo) : undefined;
    
    return this.commissionService.getProviderCommissionReport(
      providerId,
      dateFromObj,
      dateToObj,
    );
  }

  @Post('payout/:providerId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Process payout for provider (Admin only)' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiResponse({
    status: 201,
    description: 'Payout processed successfully',
  })
  async processProviderPayout(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ) {
    return this.commissionService.processAutoPayout(providerId);
  }

  @Get('pending-payout/:providerId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Get pending payout amount for provider' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Pending payout amount retrieved successfully',
  })
  async getPendingPayout(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ) {
    const amount = await this.commissionService.calculatePendingPayout(providerId);
    return { providerId, pendingAmount: amount };
  }

  @Post('schedule-payouts')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Schedule automatic payouts (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Automatic payouts scheduled successfully',
  })
  async scheduleAutoPayouts() {
    await this.commissionService.scheduleAutoPayouts();
    return { message: 'Automatic payouts scheduled successfully' };
  }
}