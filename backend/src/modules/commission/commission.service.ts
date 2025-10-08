import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { Provider } from '../../entities/provider.entity';
import { Payout, PayoutStatus } from '../../entities/payout.entity';
import { Commission } from '../../entities';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    @InjectRepository(Payout)
    private payoutRepository: Repository<Payout>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}

  /**
   * Calculate commission for a booking
   */
  async calculateCommission(bookingId: string): Promise<number> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['provider', 'service'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const provider = booking.provider;
    const totalAmount = booking.totalPrice;
    const commissionRate = provider.commissionRate || 10; // Default 10%
    
    return (totalAmount * commissionRate) / 100;
  }

  /**
   * Process commission on booking completion
   */
  async processBookingCommission(bookingId: string): Promise<Commission> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['provider', 'service', 'customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if commission already processed
    const existingCommission = await this.commissionRepository.findOne({
      where: { bookingId },
    });

    if (existingCommission) {
      return existingCommission;
    }

    const commissionAmount = await this.calculateCommission(bookingId);
    const providerEarning = booking.totalPrice - commissionAmount;

    // Create commission record
    const commission = this.commissionRepository.create({
      bookingId,
      providerId: booking.provider.id,
      customerId: booking.customer.id,
      totalAmount: booking.totalPrice,
      commissionAmount,
      providerEarning,
      commissionRate: booking.provider.commissionRate || 10,
      status: 'processed' as any,
      processedAt: new Date(),
    });

    return await this.commissionRepository.save(commission);
  }

  /**
   * Calculate provider's pending payout amount
   */
  async calculatePendingPayout(providerId: string): Promise<number> {
    const result = await this.commissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.providerEarning)', 'total')
      .where('commission.providerId = :providerId', { providerId })
      .andWhere('commission.payoutStatus = :status', { status: 'pending' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Process automatic payout for provider
   */
  async processAutoPayout(providerId: string): Promise<Payout> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const pendingAmount = await this.calculatePendingPayout(providerId);
    const minimumPayout = 100; // Minimum $100 for payout

    if (pendingAmount < minimumPayout) {
      throw new Error(`Minimum payout amount is $${minimumPayout}`);
    }

    // Create payout record
    const payout = this.payoutRepository.create({
      providerId: provider.id,
      amount: pendingAmount,
      status: PayoutStatus.PENDING,
      payoutMethod: provider.payoutMethod || 'bank_transfer',
      scheduledAt: new Date(),
    });

    const savedPayout = await this.payoutRepository.save(payout);

    // Update commission records to mark as paid
    await this.commissionRepository.update(
      { 
        providerId, 
        payoutStatus: 'pending' as any
      },
      { 
        payoutStatus: 'paid' as any,
        payoutId: savedPayout.id,
        paidAt: new Date()
      }
    );

    return savedPayout;
  }

  /**
   * Get commission analytics for admin
   */
  async getCommissionAnalytics(dateFrom?: Date, dateTo?: Date) {
    const query = this.commissionRepository.createQueryBuilder('commission')
      .leftJoinAndSelect('commission.provider', 'provider')
      .leftJoinAndSelect('commission.booking', 'booking');

    if (dateFrom && dateTo) {
      query.andWhere('commission.processedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    }

    const commissions = await query.getMany();

    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalProviderEarnings = commissions.reduce((sum, c) => sum + c.providerEarning, 0);
    const totalRevenue = commissions.reduce((sum, c) => sum + c.totalAmount, 0);

    // Top earning providers
    const providerEarnings = commissions.reduce((acc, commission) => {
      const providerId = commission.providerId;
      if (!acc[providerId]) {
        acc[providerId] = {
          provider: commission.provider,
          totalEarnings: 0,
          totalCommission: 0,
          bookingCount: 0,
        };
      }
      acc[providerId].totalEarnings += commission.providerEarning;
      acc[providerId].totalCommission += commission.commissionAmount;
      acc[providerId].bookingCount += 1;
      return acc;
    }, {});

    const topProviders = Object.values(providerEarnings)
      .sort((a: any, b: any) => b.totalEarnings - a.totalEarnings)
      .slice(0, 10);

    return {
      totalCommission,
      totalProviderEarnings,
      totalRevenue,
      averageCommissionRate: totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0,
      topProviders,
      commissionCount: commissions.length,
    };
  }

  /**
   * Get provider commission report
   */
  async getProviderCommissionReport(providerId: string, dateFrom?: Date, dateTo?: Date) {
    const query = this.commissionRepository.createQueryBuilder('commission')
      .leftJoinAndSelect('commission.booking', 'booking')
      .where('commission.providerId = :providerId', { providerId });

    if (dateFrom && dateTo) {
      query.andWhere('commission.processedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    }

    const commissions = await query.orderBy('commission.processedAt', 'DESC').getMany();

    const totalEarnings = commissions.reduce((sum, c) => sum + c.providerEarning, 0);
    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingPayout = await this.calculatePendingPayout(providerId);

    return {
      commissions,
      totalEarnings,
      totalCommission,
      pendingPayout,
      bookingCount: commissions.length,
    };
  }

  /**
   * Schedule automatic payouts (to be called by cron job)
   */
  async scheduleAutoPayouts(): Promise<void> {
    // Get all providers with pending earnings above minimum
    const providers = await this.providerRepository
      .createQueryBuilder('provider')
      .leftJoin('provider.commissions', 'commission')
      .where('commission.payoutStatus = :status', { status: 'pending' })
      .groupBy('provider.id')
      .having('SUM(commission.providerEarning) >= :minimum', { minimum: 100 })
      .getMany();

    for (const provider of providers) {
      try {
        await this.processAutoPayout(provider.id);
      } catch (error) {
        console.error(`Failed to process payout for provider ${provider.id}:`, error);
      }
    }
  }

  /**
   * Get commission tracking dashboard data
   */
  async getCommissionDashboard() {
    const [
      totalCommissionsToday,
      totalCommissionsMonth,
      pendingPayouts,
      recentCommissions
    ] = await Promise.all([
      this.getTotalCommissions('today'),
      this.getTotalCommissions('month'),
      this.getTotalPendingPayouts(),
      this.getRecentCommissions(10)
    ]);

    return {
      totalCommissionsToday,
      totalCommissionsMonth,
      pendingPayouts,
      recentCommissions,
    };
  }

  private async getTotalCommissions(period: 'today' | 'month'): Promise<number> {
    const date = new Date();
    let startDate: Date;

    if (period === 'today') {
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } else {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }

    const result = await this.commissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.commissionAmount)', 'total')
      .where('commission.processedAt >= :startDate', { startDate })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  private async getTotalPendingPayouts(): Promise<number> {
    const result = await this.commissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.providerEarning)', 'total')
      .where('commission.payoutStatus = :status', { status: 'pending' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  private async getRecentCommissions(limit: number) {
    return await this.commissionRepository.find({
      relations: ['provider', 'booking'],
      order: { processedAt: 'DESC' },
      take: limit,
    });
  }
}