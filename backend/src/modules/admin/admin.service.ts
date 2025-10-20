import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Provider, ProviderStatus } from '../../entities/provider.entity';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Category } from '../../entities/category.entity';
import { Service, ServiceStatus } from '../../entities/service.entity';
import { SupportTicket } from '../../entities/support-ticket.entity';
import { SystemSetting } from '../../entities/system-setting.entity';
import { Analytics } from '../../entities/analytics.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { AdminBookingsQueryDto } from './dto/admin-bookings-query.dto';
import { AdminProvidersQueryDto } from './dto/admin-providers-query.dto';
import { ApproveServiceDto, AdminServiceQueryDto, BulkServiceActionDto } from './dto/admin-service-approval.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(SupportTicket)
    private supportTicketsRepository: Repository<SupportTicket>,
    @InjectRepository(SystemSetting)
    private systemSettingsRepository: Repository<SystemSetting>,
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      activeUsers,
      pendingBookings,
      newUsersThisMonth,
      newProvidersThisMonth,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.providersRepository.count(),
      this.bookingsRepository.count(),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.totalPrice)', 'total')
        .where('booking.status = :status', { status: BookingStatus.COMPLETED })
        .getRawOne(),
            this.usersRepository.count({ where: { status: 'active' } }),
            this.bookingsRepository.count({ where: { status: BookingStatus.PENDING } }),
      this.usersRepository
        .createQueryBuilder('user')
        .where('user.createdAt >= :date', {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })
        .getCount(),
      this.providersRepository
        .createQueryBuilder('provider')
        .where('provider.createdAt >= :date', {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })
        .getCount(),
    ]);

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue: totalRevenue?.total || 0,
      activeUsers,
      pendingBookings,
      newUsersThisMonth,
      newProvidersThisMonth,
      averageBookingValue: totalBookings > 0 ? (totalRevenue?.total || 0) / totalBookings : 0,
    };
  }

  async getDashboardCharts() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [revenueData, bookingsData, userRegistrations] = await Promise.all([
      this.bookingsRepository
        .createQueryBuilder('booking')
        .select('DATE(booking.createdAt)', 'date')
        .addSelect('SUM(booking.totalPrice)', 'revenue')
        .where('booking.createdAt >= :date', { date: thirtyDaysAgo })
        .groupBy('DATE(booking.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany(),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .select('DATE(booking.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('booking.createdAt >= :date', { date: thirtyDaysAgo })
        .groupBy('DATE(booking.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany(),
      this.usersRepository
        .createQueryBuilder('user')
        .select('DATE(user.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('user.createdAt >= :date', { date: thirtyDaysAgo })
        .groupBy('DATE(user.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany(),
    ]);

    return {
      revenue: revenueData,
      bookings: bookingsData,
      userRegistrations,
    };
  }

  async getRecentActivity() {
    const [recentBookings, recentUsers, recentProviders] = await Promise.all([
      this.bookingsRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
        relations: ['customer', 'provider'],
      }),
      this.usersRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
      }),
      this.providersRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
      }),
    ]);

    return {
      recentBookings,
      recentUsers,
      recentProviders,
    };
  }

  // Users management methods
  async getUsers(query: AdminUsersQueryDto) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['bookings', 'provider'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(id: string, status: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  // Providers management methods
  async getProviders(query: AdminProvidersQueryDto) {
    const { page = 1, limit = 10, search, status, verified } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.providersRepository.createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user');

    if (search) {
      queryBuilder.andWhere(
        '(provider.businessName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('provider.status = :status', { status });
    }

    if (verified !== undefined) {
      queryBuilder.andWhere('provider.isVerified = :verified', { verified });
    }

    const [providers, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('provider.createdAt', 'DESC')
      .getManyAndCount();

    return {
      providers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProvider(id: string) {
    const provider = await this.providersRepository.findOne({
      where: { id },
      relations: ['user', 'services', 'bookings'],
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async updateProviderStatus(id: string, status: string) {
    const provider = await this.providersRepository.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    provider.status = status as ProviderStatus;
    return this.providersRepository.save(provider);
  }

  async verifyProvider(id: string, verified: boolean) {
    const provider = await this.providersRepository.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    provider.isVerified = verified;
    return this.providersRepository.save(provider);
  }

  async getProviderDocuments(id: string) {
    const provider = await this.providersRepository.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Return verification info from provider entity
    return {
      documents: [], // Would need separate document entity if we store documents
      verificationStatus: provider.isVerified ? 'verified' : 'unverified',
      verificationNotes: provider.verificationNotes,
      verifiedAt: provider.verifiedAt,
    };
  }

  // Bookings management methods
  async getBookings(query: AdminBookingsQueryDto) {
    const { page = 1, limit = 10, search, status, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingsRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.provider', 'provider')
      .leftJoinAndSelect('booking.service', 'service');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR provider.businessName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('booking.bookingDate BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    }

    const [bookings, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('booking.createdAt', 'DESC')
      .getManyAndCount();

    return {
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBooking(id: string) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'provider', 'service', 'payments'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(id: string, status: string) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = status as BookingStatus;
    return this.bookingsRepository.save(booking);
  }

  async processRefund(id: string, amount?: number) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Process refund logic here
    // This would integrate with payment processor (Stripe, PayPal, etc.)
    // Note: 'refunded' is not in BookingStatus enum, using CANCELLED instead
    booking.status = BookingStatus.CANCELLED;
    
    // Note: refundAmount property doesn't exist in Booking entity
    // You would need to add this field to the entity or create a separate refund table
    
    return this.bookingsRepository.save(booking);
  }

  // Analytics methods
  async getAnalytics(query: any) {
    const { dateFrom, dateTo, granularity = 'day' } = query;
    
    const dateFilter = dateFrom && dateTo ? {
      createdAt: Between(new Date(dateFrom), new Date(dateTo))
    } : {};

    const [bookingsCount, revenue, topCategories] = await Promise.all([
      this.bookingsRepository.count({ where: dateFilter }),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.totalPrice)', 'total')
        .where(dateFilter)
        .getRawOne(),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.service', 'service')
        .leftJoin('service.category', 'category')
        .select('category.name', 'category')
        .addSelect('COUNT(*)', 'count')
        .where(dateFilter)
        .groupBy('category.name')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
    ]);

    return {
      bookingsCount,
      totalRevenue: revenue?.total || 0,
      topCategories,
    };
  }

  async getRevenueAnalytics(query: any) {
    const { dateFrom, dateTo } = query;
    
    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .select('DATE(booking.createdAt)', 'date')
      .addSelect('SUM(booking.totalPrice)', 'revenue')
      .addSelect('COUNT(*)', 'bookings')
      .where('booking.status = :status', { status: BookingStatus.COMPLETED });

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('booking.createdAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
      });
    }

    const revenueData = await queryBuilder
      .groupBy('DATE(booking.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return revenueData;
  }

  async getCategoryAnalytics() {
    const categoryStats = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.service', 'service')
      .leftJoin('service.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(*)', 'bookings')
      .addSelect('SUM(booking.totalPrice)', 'revenue')
      .groupBy('category.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return categoryStats;
  }

  async getTopProviders(limit: number = 10) {
    const topProviders = await this.providersRepository
      .createQueryBuilder('provider')
      .leftJoin('provider.bookings', 'booking')
      .select('provider.businessName', 'businessName')
      .addSelect('COUNT(booking.id)', 'totalBookings')
      .addSelect('SUM(booking.totalPrice)', 'totalRevenue')
      .addSelect('AVG(provider.rating)', 'averageRating')
      .groupBy('provider.id')
      .orderBy('totalRevenue', 'DESC')
      .limit(limit)
      .getRawMany();

    return topProviders;
  }

  // Categories management methods
  async getCategories(query: any) {
    const { page = 1, limit = 10, search, active } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.categoriesRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.andWhere(
        '(category.name LIKE :search OR category.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (active !== undefined) {
      queryBuilder.andWhere('category.isActive = :active', { active });
    }

    const [categories, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('category.sortOrder', 'ASC')
      .getManyAndCount();

    return {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategory(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async createCategory(categoryData: any) {
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
  }

  async updateCategory(id: string, categoryData: any) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, categoryData);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }

  async updateCategoryStatus(id: string, isActive: boolean) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.isActive = isActive;
    return this.categoriesRepository.save(category);
  }

  // Support tickets methods
  async getSupportTickets(query: any) {
    const { page = 1, limit = 10, search, status, priority, category } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.supportTicketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user');

    if (search) {
      queryBuilder.andWhere(
        '(ticket.subject LIKE :search OR ticket.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority });
    }

    if (category) {
      queryBuilder.andWhere('ticket.category = :category', { category });
    }

    const [tickets, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('ticket.createdAt', 'DESC')
      .getManyAndCount();

    return {
      tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSupportTicket(id: string) {
    const ticket = await this.supportTicketsRepository.findOne({
      where: { id },
      relations: ['user', 'messages'],
    });

    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    return ticket;
  }

  async updateTicketStatus(id: string, status: string) {
    const ticket = await this.supportTicketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    ticket.status = status;
    ticket.updatedAt = new Date();
    return this.supportTicketsRepository.save(ticket);
  }

  async assignTicket(id: string, assignedTo: string) {
    const ticket = await this.supportTicketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    // Note: assignedTo property doesn't exist in SupportTicket entity
    // You would need to add this field to the entity if you want assignment functionality
    return this.supportTicketsRepository.save(ticket);
  }

  async addTicketMessage(id: string, message: string) {
    const ticket = await this.supportTicketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    // Add message to ticket (this would integrate with messages system)
    // For now, just update the ticket
    ticket.updatedAt = new Date();
    return this.supportTicketsRepository.save(ticket);
  }

  // Settings methods
  async getSettings() {
    try {
      const settings = await this.systemSettingsRepository.find();
      
      // Convert array to object for easier frontend consumption
      const settingsObject = {};
      settings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
      });

      return settingsObject;
    } catch (error) {
      // Return default settings if table doesn't exist
      return {
        siteName: 'Reservista',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        smsNotifications: false,
        defaultCurrency: 'EUR',
        timezone: 'Europe/Malta'
      };
    }
  }

  async updateSettings(settingsData: any) {
    const updates = [];
    
    for (const [key, value] of Object.entries(settingsData)) {
      let setting = await this.systemSettingsRepository.findOne({ where: { key } });
      
      if (setting) {
        setting.value = value as string;
      } else {
        setting = this.systemSettingsRepository.create({ key, value: value as string });
      }
      
      updates.push(this.systemSettingsRepository.save(setting));
    }

    await Promise.all(updates);
    return { message: 'Settings updated successfully' };
  }

  async getSystemStatus() {
    const [
      databaseConnection,
      totalUsers,
      totalProviders,
      activeBookings,
    ] = await Promise.all([
      // Database connection check would go here
      Promise.resolve(true),
      this.usersRepository.count(),
      this.providersRepository.count(),
      this.bookingsRepository.count({ where: { status: In([BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]) } }),
    ]);

    return {
      database: databaseConnection ? 'healthy' : 'error',
      totalUsers,
      totalProviders,
      activeBookings,
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  async toggleMaintenanceMode(enabled: boolean) {
    let setting = await this.systemSettingsRepository.findOne({ 
      where: { key: 'maintenanceMode' } 
    });

    if (setting) {
      setting.value = enabled.toString();
    } else {
      setting = this.systemSettingsRepository.create({ 
        key: 'maintenanceMode', 
        value: enabled.toString() 
      });
    }

    await this.systemSettingsRepository.save(setting);
    return { message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` };
  }

  // Reports methods
  async generateReport(type: string, params?: any) {
    // This would generate various types of reports
    // For now, return a mock response
    return {
      id: `report_${Date.now()}`,
      type,
      status: 'generating',
      params,
      createdAt: new Date(),
    };
  }

  async getReports() {
    // Return list of generated reports
    // This would come from a reports table
    return [];
  }

  async downloadReport(id: string) {
    // Return report file or URL
    // This would integrate with file storage system
    return {
      url: `/reports/${id}.pdf`,
      filename: `report_${id}.pdf`,
    };
  }

  // ==== ADMIN SERVICE MANAGEMENT METHODS ====

  async getAllServices(query: AdminServiceQueryDto) {
    const {
      isApproved,
      status,
      search,
      providerId,
      categoryId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = query;

    const queryBuilder = this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('service.category', 'category');

    // Apply filters
    if (isApproved !== undefined) {
      queryBuilder.andWhere('service.isApproved = :isApproved', { isApproved });
    }

    if (status) {
      queryBuilder.andWhere('service.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(service.name ILIKE :search OR service.description ILIKE :search OR provider.businessName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (providerId) {
      queryBuilder.andWhere('service.providerId = :providerId', { providerId });
    }

    if (categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    // Apply sorting
    queryBuilder.orderBy(`service.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [services, total] = await queryBuilder.getManyAndCount();

    return {
      services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getServiceById(id: string): Promise<Service> {
    const service = await this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('service.category', 'category')
      .where('service.id = :id', { id })
      .getOne();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async approveService(id: string, approveDto: ApproveServiceDto, adminId: string): Promise<Service> {
    const service = await this.getServiceById(id);

    service.isApproved = approveDto.isApproved;
    service.approvedByAdminId = adminId;
    service.approvalDate = new Date();
    service.adminComments = approveDto.adminComments;
    service.adminAssignedBadge = approveDto.adminAssignedBadge;
    service.adminQualityRating = approveDto.adminQualityRating;

    // Update service status based on approval
    if (approveDto.isApproved) {
      service.status = ServiceStatus.APPROVED;
      // Auto-activate approved services
      service.isActive = true;
    } else {
      service.status = ServiceStatus.REJECTED;
      service.isActive = false;
    }

    return await this.servicesRepository.save(service);
  }

  async assignBadgeToService(id: string, badge: string, adminId: string): Promise<Service> {
    const service = await this.getServiceById(id);

    service.adminAssignedBadge = badge;
    service.approvedByAdminId = adminId;
    service.approvalDate = new Date();

    return await this.servicesRepository.save(service);
  }

  async deleteService(id: string): Promise<void> {
    const service = await this.getServiceById(id);
    await this.servicesRepository.remove(service);
  }

  async bulkServiceAction(bulkActionDto: BulkServiceActionDto, adminId: string) {
    const { serviceIds, action, adminComments } = bulkActionDto;

    const services = await this.servicesRepository
      .createQueryBuilder('service')
      .where('service.id IN (:...ids)', { ids: serviceIds })
      .getMany();

    if (services.length !== serviceIds.length) {
      throw new BadRequestException('Some services not found');
    }

    const updatePromises = services.map(async (service) => {
      switch (action) {
        case 'approve':
          service.isApproved = true;
          service.status = ServiceStatus.APPROVED;
          service.isActive = true;
          break;
        case 'reject':
          service.isApproved = false;
          service.status = ServiceStatus.REJECTED;
          service.isActive = false;
          break;
        case 'delete':
          return this.servicesRepository.remove(service);
        case 'feature':
          service.isFeatured = true;
          break;
        case 'unfeature':
          service.isFeatured = false;
          break;
      }

      service.approvedByAdminId = adminId;
      service.approvalDate = new Date();
      service.adminComments = adminComments;

      return this.servicesRepository.save(service);
    });

    await Promise.all(updatePromises);

    return {
      message: `Bulk ${action} completed for ${serviceIds.length} services`,
      affectedServices: serviceIds.length,
    };
  }

  async getServiceStats() {
    const [
      totalServices,
      approvedServices,
      pendingServices,
      rejectedServices,
      featuredServices,
      activeServices,
    ] = await Promise.all([
      this.servicesRepository.count(),
      this.servicesRepository.count({ where: { isApproved: true } }),
      this.servicesRepository.count({ where: { status: ServiceStatus.PENDING_APPROVAL } }),
      this.servicesRepository.count({ where: { status: ServiceStatus.REJECTED } }),
      this.servicesRepository.count({ where: { isFeatured: true } }),
      this.servicesRepository.count({ where: { isActive: true } }),
    ]);

    return {
      totalServices,
      approvedServices,
      pendingServices,
      rejectedServices,
      featuredServices,
      activeServices,
      approvalRate: totalServices > 0 ? (approvedServices / totalServices) * 100 : 0,
    };
  }
}