import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  ReferralCode, 
  Referral, 
  ReferralCampaign, 
  ReferralStatus,
  ReferralRewardType 
} from '../../entities/referral.entity';
import { CreateReferralDto, CreateReferralCampaignDto, UpdateReferralCampaignDto, CompleteReferralDto } from './dto/referral.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(ReferralCode)
    private readonly referralCodeRepository: Repository<ReferralCode>,
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
    @InjectRepository(ReferralCampaign)
    private readonly referralCampaignRepository: Repository<ReferralCampaign>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private generateReferralCode(userId: string): string {
    // Generate unique referral code
    const prefix = 'REF';
    const year = new Date().getFullYear();
    const userSuffix = userId.slice(-4).toUpperCase();
    const randomString = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${year}${userSuffix}${randomString}`;
  }

  async createReferralCode(userId: string): Promise<ReferralCode> {
    try {
      // Check if user already has a referral code
      const existingCode = await this.referralCodeRepository.findOne({
        where: { userId },
      });

      if (existingCode) {
        return existingCode;
      }

      let code: string;
      let isUnique = false;
      
      // Ensure unique code generation
      while (!isUnique) {
        code = this.generateReferralCode(userId);
        const existingCode = await this.referralCodeRepository.findOne({ where: { code } });
        if (!existingCode) {
          isUnique = true;
        }
      }

      const referralCode = this.referralCodeRepository.create({
        code,
        userId,
        totalUses: 0,
        isActive: true,
      });

      return await this.referralCodeRepository.save(referralCode);
    } catch (error) {
      if (error.message && (error.message.includes('does not exist') || error.message.includes('relation'))) {
        throw new BadRequestException('Referral system is not available');
      }
      console.error('Error creating referral code:', error);
      throw error;
    }
  }

  async getUserReferralCode(userId: string, includeStats?: boolean): Promise<any> {
    try {
      console.log('Getting referral code for user:', userId);
      
      let referralCode = await this.referralCodeRepository.findOne({
        where: { userId },
      });

      if (!referralCode) {
        console.log('No referral code found, creating new one...');
        referralCode = await this.createReferralCode(userId);
      }

      // If includeStats is requested, fetch additional data
      if (includeStats) {
        try {
          const referralsCount = await this.referralRepository.count({
            where: { referrerId: userId },
          });

          return {
            ...referralCode,
            stats: {
              totalReferrals: referralsCount,
              pendingReferrals: 0,
              completedReferrals: 0,
            },
          };
        } catch (statsError) {
          console.log('Error fetching stats:', statsError.message);
          return {
            ...referralCode,
            stats: {
              totalReferrals: 0,
              pendingReferrals: 0,
              completedReferrals: 0,
            },
          };
        }
      }

      return referralCode;
    } catch (error) {
      console.error('Error getting user referral code:', error);
      // If referral tables don't exist, return a basic response
      if (error.message && (error.message.includes('does not exist') || error.message.includes('relation'))) {
        throw new BadRequestException('Referral system is not available');
      }
      throw error;
    }
  }

  async createReferral(createReferralDto: CreateReferralDto, refereeId: string): Promise<Referral> {
    try {
      // Find referral code
      const referralCode = await this.referralCodeRepository.findOne({
        where: { code: createReferralDto.referralCode, isActive: true },
        relations: ['user'],
      });

      if (!referralCode) {
        throw new NotFoundException('Invalid or inactive referral code');
      }

      // Check if referee exists
      const referee = await this.userRepository.findOne({
        where: { id: refereeId },
      });

      if (!referee) {
        throw new NotFoundException('Referee user not found');
      }

    // Prevent self-referral
    if (referralCode.userId === refereeId) {
      throw new BadRequestException('Cannot refer yourself');
    }

    // Check if referee was already referred by this user
    const existingReferral = await this.referralRepository.findOne({
      where: {
        referrerId: referralCode.userId,
        refereeId: refereeId,
      },
    });

    if (existingReferral) {
      throw new BadRequestException('User has already been referred by this referrer');
    }

    // Get active campaign for rewards
    const activeCampaign = await this.getActiveCampaign();

    const referral = this.referralRepository.create({
      referrerId: referralCode.userId,
      refereeId: refereeId,
      referralCodeId: referralCode.id,
      status: ReferralStatus.PENDING,
      referrerReward: activeCampaign?.referrerRewardAmount || 0,
      refereeReward: activeCampaign?.refereeRewardAmount || 0,
      referrerRewardType: activeCampaign?.referrerRewardType || ReferralRewardType.POINTS,
      refereeRewardType: activeCampaign?.refereeRewardType || ReferralRewardType.POINTS,
    });

    const savedReferral = await this.referralRepository.save(referral);

    // Update referral code usage
    referralCode.totalUses += 1;
    await this.referralCodeRepository.save(referralCode);

    return savedReferral;
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        throw new BadRequestException('Referral system is not available');
      }
      throw error;
    }
  }

  async completeReferral(completeReferralDto: CompleteReferralDto): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: completeReferralDto.referralId },
      relations: ['referrer', 'referee'],
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    if (referral.status !== ReferralStatus.PENDING) {
      throw new BadRequestException('Referral is not in pending status');
    }

    // Mark referral as completed
    referral.status = ReferralStatus.COMPLETED;
    referral.completedAt = new Date();
    referral.completingBookingId = completeReferralDto.bookingId;

    const completedReferral = await this.referralRepository.save(referral);

    // Here you would typically trigger reward distribution
    // This could be handled by event listeners or separate services
    await this.distributeReferralRewards(completedReferral);

    return completedReferral;
  }

  private async distributeReferralRewards(referral: Referral): Promise<void> {
    // This is a placeholder for reward distribution logic
    // In a real implementation, you would:
    // 1. Give points/discount to referrer based on referrerRewardType
    // 2. Give points/discount to referee based on refereeRewardType
    // 3. Create notification records
    // 4. Send emails/SMS notifications

    console.log(`Distributing rewards for referral ${referral.id}`);
    console.log(`Referrer reward: ${referral.referrerReward} ${referral.referrerRewardType}`);
    console.log(`Referee reward: ${referral.refereeReward} ${referral.refereeRewardType}`);
  }

  async getUserReferrals(
    userId: string,
    status?: string,
    limit?: number,
    offset?: number
  ): Promise<Referral[]> {
    try {
      let queryBuilder = this.referralRepository.createQueryBuilder('referral')
        .leftJoinAndSelect('referral.referee', 'referee')
        .leftJoinAndSelect('referral.referralCode', 'referralCode')
        .where('referral.referrerId = :userId', { userId });

      // Apply status filter
      if (status) {
        queryBuilder = queryBuilder.andWhere('referral.status = :status', { status });
      }

      queryBuilder = queryBuilder.orderBy('referral.createdAt', 'DESC');

      // Apply pagination
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }
      if (offset) {
        queryBuilder = queryBuilder.offset(offset);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return []; // Return empty array if table doesn't exist
      }
      throw error;
    }
  }

  async getReferralStats(
    userId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewardsEarned: number;
  }> {
    try {
      let queryBuilder = this.referralRepository.createQueryBuilder('referral')
        .where('referral.referrerId = :userId', { userId });

      // Apply date filters
      if (fromDate) {
        queryBuilder = queryBuilder.andWhere('referral.createdAt >= :fromDate', {
          fromDate: new Date(fromDate)
        });
      }
      if (toDate) {
        queryBuilder = queryBuilder.andWhere('referral.createdAt <= :toDate', {
          toDate: new Date(toDate + ' 23:59:59')
        });
      }

      const referrals = await queryBuilder.getMany();
    
      const completed = referrals.filter(r => r.status === ReferralStatus.COMPLETED);
      const pending = referrals.filter(r => r.status === ReferralStatus.PENDING);
      const totalRewards = completed.reduce((sum, r) => sum + (r.referrerReward || 0), 0);

      return {
        totalReferrals: referrals.length,
        completedReferrals: completed.length,
        pendingReferrals: pending.length,
        totalRewardsEarned: totalRewards,
      };
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return {
          totalReferrals: 0,
          completedReferrals: 0,
          pendingReferrals: 0,
          totalRewardsEarned: 0,
        };
      }
      throw error;
    }
  }

  // Campaign management methods
  async createCampaign(createCampaignDto: CreateReferralCampaignDto): Promise<ReferralCampaign> {
    const campaign = this.referralCampaignRepository.create({
      ...createCampaignDto,
      startDate: new Date(createCampaignDto.startDate),
      endDate: new Date(createCampaignDto.endDate),
    });

    return await this.referralCampaignRepository.save(campaign);
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateReferralCampaignDto): Promise<ReferralCampaign> {
    const campaign = await this.referralCampaignRepository.findOne({ where: { id } });
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (updateCampaignDto.startDate) {
      updateCampaignDto.startDate = new Date(updateCampaignDto.startDate) as any;
    }
    if (updateCampaignDto.endDate) {
      updateCampaignDto.endDate = new Date(updateCampaignDto.endDate) as any;
    }

    Object.assign(campaign, updateCampaignDto);
    return await this.referralCampaignRepository.save(campaign);
  }

  async getActiveCampaign(): Promise<ReferralCampaign | null> {
    const now = new Date();
    
    return await this.referralCampaignRepository.findOne({
      where: {
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllCampaigns(
    isActive?: boolean,
    rewardType?: string,
    limit?: number
  ): Promise<ReferralCampaign[]> {
    try {
      let queryBuilder = this.referralCampaignRepository.createQueryBuilder('campaign');

      // Apply active filter
      if (isActive !== undefined) {
        queryBuilder = queryBuilder.where('campaign.isActive = :isActive', { isActive });
      }

      // Apply reward type filter
      if (rewardType) {
        queryBuilder = queryBuilder.andWhere(
          '(campaign.referrerRewardType = :rewardType OR campaign.refereeRewardType = :rewardType)',
          { rewardType }
        );
      }

      queryBuilder = queryBuilder.orderBy('campaign.createdAt', 'DESC');

      // Apply limit
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return []; // Return empty array if table doesn't exist
      }
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    const campaign = await this.referralCampaignRepository.findOne({ where: { id } });
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.isActive = false;
    await this.referralCampaignRepository.save(campaign);
  }

  async validateReferralCode(
    code: string,
    userId?: string
  ): Promise<{ valid: boolean; message?: string; referralCode?: ReferralCode }> {
    try {
      const referralCode = await this.referralCodeRepository.findOne({
        where: { code },
        relations: ['user'],
      });

      if (!referralCode) {
        return { valid: false, message: 'Referral code not found' };
      }

      if (!referralCode.isActive) {
        return { valid: false, message: 'Referral code is inactive' };
      }

      if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
        return { valid: false, message: 'Referral code has expired' };
      }

      if (referralCode.maxUses && referralCode.totalUses >= referralCode.maxUses) {
        return { valid: false, message: 'Referral code usage limit reached' };
      }

      // Check if user is trying to use their own referral code
      if (userId && referralCode.userId === userId) {
        return { valid: false, message: 'Cannot use your own referral code' };
      }

      // Check if user has already been referred by this referrer
      if (userId) {
        const existingReferral = await this.referralRepository.findOne({
          where: {
            referrerId: referralCode.userId,
            refereeId: userId,
          },
        });

        if (existingReferral) {
          return { valid: false, message: 'You have already been referred by this user' };
        }
      }

      return { valid: true, referralCode };
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return { valid: false, message: 'Referral system is not available' };
      }
      throw error;
    }
  }
}