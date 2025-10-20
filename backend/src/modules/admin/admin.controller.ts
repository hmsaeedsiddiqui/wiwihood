import {
  Req,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { AdminBookingsQueryDto } from './dto/admin-bookings-query.dto';
import { AdminProvidersQueryDto } from './dto/admin-providers-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ApproveServiceDto, AdminServiceQueryDto, BulkServiceActionDto } from './dto/admin-service-approval.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard endpoints
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsDto,
  })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/charts')
  @ApiOperation({ summary: 'Get dashboard charts data' })
  async getDashboardCharts() {
    return this.adminService.getDashboardCharts();
  }

  @Get('dashboard/recent-activity')
  @ApiOperation({ summary: 'Get recent activity for dashboard' })
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  // Users management endpoints
  @Get('users')
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateStatusDto.status);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Providers management endpoints
  @Get('providers')
  @ApiOperation({ summary: 'Get all providers with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'verified', required: false, type: Boolean })
  async getProviders(@Query() query: AdminProvidersQueryDto) {
    return this.adminService.getProviders(query);
  }

  @Get('providers/:id')
  @ApiOperation({ summary: 'Get provider by ID' })
  async getProvider(@Param('id') id: string) {
    return this.adminService.getProvider(id);
  }

  @Patch('providers/:id/status')
  @ApiOperation({ summary: 'Update provider status' })
  async updateProviderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateProviderStatus(id, updateStatusDto.status);
  }

  @Patch('providers/:id/verify')
  @ApiOperation({ summary: 'Verify/unverify provider' })
  async verifyProvider(
    @Param('id') id: string,
    @Body() verifyDto: { verified: boolean },
  ) {
    return this.adminService.verifyProvider(id, verifyDto.verified);
  }

  @Get('providers/:id/documents')
  @ApiOperation({ summary: 'Get provider documents' })
  async getProviderDocuments(@Param('id') id: string) {
    return this.adminService.getProviderDocuments(id);
  }

  // Bookings management endpoints
  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getBookings(@Query() query: AdminBookingsQueryDto) {
    return this.adminService.getBookings(query);
  }

  @Get('bookings/:id')
  @ApiOperation({ summary: 'Get booking by ID' })
  async getBooking(@Param('id') id: string) {
    return this.adminService.getBooking(id);
  }

  @Patch('bookings/:id/status')
  @ApiOperation({ summary: 'Update booking status' })
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    return this.adminService.updateBookingStatus(id, updateStatusDto.status);
  }

  @Post('bookings/:id/refund')
  @ApiOperation({ summary: 'Process booking refund' })
  async refundBooking(
    @Param('id') id: string,
    @Body() refundDto: { amount?: number },
  ) {
    return this.adminService.processRefund(id, refundDto.amount);
  }

  // Analytics endpoints
  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'granularity', required: false, type: String })
  async getAnalytics(@Query() query: any) {
    return this.adminService.getAnalytics(query);
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getRevenueAnalytics(@Query() query: any) {
    return this.adminService.getRevenueAnalytics(query);
  }

  @Get('analytics/categories')
  @ApiOperation({ summary: 'Get category analytics' })
  async getCategoryAnalytics() {
    return this.adminService.getCategoryAnalytics();
  }

  @Get('analytics/top-providers')
  @ApiOperation({ summary: 'Get top performing providers' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopProviders(@Query('limit') limit?: number) {
    return this.adminService.getTopProviders(limit);
  }

  // Categories management endpoints
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async getCategories(@Query() query: any) {
    return this.adminService.getCategories(query);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(@Param('id') id: string) {
    return this.adminService.getCategory(id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create new category' })
  async createCategory(@Body() categoryData: any) {
    return this.adminService.createCategory(categoryData);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    return this.adminService.updateCategory(id, categoryData);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Patch('categories/:id/status')
  @ApiOperation({ summary: 'Update category status' })
  async updateCategoryStatus(
    @Param('id') id: string,
    @Body() statusDto: { isActive: boolean },
  ) {
    return this.adminService.updateCategoryStatus(id, statusDto.isActive);
  }

  // Support tickets endpoints
  @Get('support-tickets')
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async getSupportTickets(@Query() query: any) {
    return this.adminService.getSupportTickets(query);
  }

  @Get('support-tickets/:id')
  @ApiOperation({ summary: 'Get support ticket by ID' })
  async getSupportTicket(@Param('id') id: string) {
    return this.adminService.getSupportTicket(id);
  }

  @Patch('support-tickets/:id/status')
  @ApiOperation({ summary: 'Update support ticket status' })
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string },
  ) {
    return this.adminService.updateTicketStatus(id, statusDto.status);
  }

  @Patch('support-tickets/:id/assign')
  @ApiOperation({ summary: 'Assign support ticket' })
  async assignTicket(
    @Param('id') id: string,
    @Body() assignDto: { assignedTo: string },
  ) {
    return this.adminService.assignTicket(id, assignDto.assignedTo);
  }

  @Post('support-tickets/:id/messages')
  @ApiOperation({ summary: 'Add message to support ticket' })
  async addTicketMessage(
    @Param('id') id: string,
    @Body() messageDto: { message: string },
  ) {
    return this.adminService.addTicketMessage(id, messageDto.message);
  }

  // Settings endpoints
  @Get('settings')
  @ApiOperation({ summary: 'Get system settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update system settings' })
  async updateSettings(@Body() settings: any) {
    return this.adminService.updateSettings(settings);
  }

  @Get('system/status')
  @ApiOperation({ summary: 'Get system status' })
  async getSystemStatus() {
    return this.adminService.getSystemStatus();
  }

  @Post('system/maintenance')
  @ApiOperation({ summary: 'Toggle maintenance mode' })
  async toggleMaintenanceMode(@Body() maintenanceDto: { enabled: boolean }) {
    return this.adminService.toggleMaintenanceMode(maintenanceDto.enabled);
  }

  // Reports endpoints
  @Post('reports/generate')
  @ApiOperation({ summary: 'Generate report' })
  async generateReport(@Body() reportDto: { type: string; params?: any }) {
    return this.adminService.generateReport(reportDto.type, reportDto.params);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all reports' })
  async getReports() {
    return this.adminService.getReports();
  }

  @Get('reports/:id/download')
  @ApiOperation({ summary: 'Download report' })
  async downloadReport(@Param('id') id: string) {
    return this.adminService.downloadReport(id);
  }

  // ==== ADMIN SERVICE MANAGEMENT ENDPOINTS ====

  @Get('services')
  @ApiOperation({ summary: 'Get all services with admin filters' })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'providerId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async getAllServices(@Query() query: AdminServiceQueryDto) {
    return this.adminService.getAllServices(query);
  }

  @Get('services/stats')
  @ApiOperation({ summary: 'Get service statistics' })
  async getServiceStats() {
    return this.adminService.getServiceStats();
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  async getServiceById(@Param('id') id: string) {
    return this.adminService.getServiceById(id);
  }

  @Post('services/:id/approve')
  @ApiOperation({ summary: 'Approve or reject a service' })
  async approveService(
    @Param('id') id: string,
    @Body() approveDto: ApproveServiceDto,
    @Req() req: any,
  ) {
    return this.adminService.approveService(id, approveDto, req.user.id);
  }

  @Patch('services/:id/badge')
  @ApiOperation({ summary: 'Assign badge to service' })
  async assignBadge(
    @Param('id') id: string,
    @Body() badgeDto: { badge: string },
    @Req() req: any,
  ) {
    return this.adminService.assignBadgeToService(id, badgeDto.badge, req.user.id);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete service' })
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  @Post('services/bulk-action')
  @ApiOperation({ summary: 'Perform bulk action on services' })
  async bulkServiceAction(
    @Body() bulkActionDto: BulkServiceActionDto,
    @Req() req: any,
  ) {
    return this.adminService.bulkServiceAction(bulkActionDto, req.user.id);
  }
}