import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  LoyaltyAccount, 
  PointTransaction, 
  LoyaltyReward, 
  LoyaltyTier, 
  PointTransactionType 
} from '../../entities/loyalty.entity';
import { AddPointsDto, RedeemPointsDto, CreateLoyaltyRewardDto, UpdateLoyaltyRewardDto } from './dto/loyalty.dto';

@Injectable()
export class LoyaltyService {
  private readonly tierThresholds = {
    [LoyaltyTier.BRONZE]: 0,
    [LoyaltyTier.SILVER]: 1000,
    [LoyaltyTier.GOLD]: 5000,
    [LoyaltyTier.PLATINUM]: 15000,
  };

  constructor(
    @InjectRepository(LoyaltyAccount)
    private readonly loyaltyAccountRepository: Repository<LoyaltyAccount>,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(LoyaltyReward)
    private readonly loyaltyRewardRepository: Repository<LoyaltyReward>,
  ) {}

  async createLoyaltyAccount(userId: string): Promise<LoyaltyAccount> {
    // Check if account already exists
    const existingAccount = await this.loyaltyAccountRepository.findOne({
      where: { userId },
    });

    if (existingAccount) {
      return existingAccount;
    }

    const loyaltyAccount = this.loyaltyAccountRepository.create({
      userId,
      currentPoints: 0,
      totalPointsEarned: 0,
      totalPointsRedeemed: 0,
      tier: LoyaltyTier.BRONZE,
      pointsToNextTier: this.tierThresholds[LoyaltyTier.SILVER],
    });

    return await this.loyaltyAccountRepository.save(loyaltyAccount);
  }

  async getLoyaltyAccount(userId: string): Promise<LoyaltyAccount> {
    try {
      // Simple findOne without problematic joins
      const account = await this.loyaltyAccountRepository.findOne({
        where: { userId },
        relations: ['user'],
      });

      if (!account) {
        return await this.createLoyaltyAccount(userId);
      }

      return account;
    } catch (error) {
      console.error('Error in getLoyaltyAccount:', error);
      // Fallback: try without relations
      const account = await this.loyaltyAccountRepository.findOne({
        where: { userId },
      });
      
      if (!account) {
        return await this.createLoyaltyAccount(userId);
      }
      
      return account;
    }
  }

  async addPoints(userId: string, addPointsDto: AddPointsDto): Promise<LoyaltyAccount> {
    const account = await this.getLoyaltyAccount(userId);
    
    console.log('Account found:', { id: account.id, userId: account.userId });
    
    // Create transaction record
    const transaction = this.pointTransactionRepository.create({
      loyaltyAccountId: account.id,
      type: PointTransactionType.EARNED,
      points: addPointsDto.points,
      balanceAfter: account.currentPoints + addPointsDto.points,
      description: addPointsDto.description,
      referenceId: addPointsDto.referenceId,
      referenceType: addPointsDto.referenceType,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
    });

    console.log('Transaction before save:', {
      loyaltyAccountId: transaction.loyaltyAccountId,
      hasLoyaltyAccount: !!transaction.loyaltyAccount,
      type: transaction.type,
      points: transaction.points
    });

    const savedTransaction = await this.pointTransactionRepository.save(transaction);

    // Update account
    account.currentPoints += addPointsDto.points;
    account.totalPointsEarned += addPointsDto.points;

    // Check for tier upgrade
    await this.updateTier(account);

    return await this.loyaltyAccountRepository.save(account);
  }

  async redeemPoints(userId: string, redeemPointsDto: RedeemPointsDto): Promise<LoyaltyAccount> {
    const account = await this.getLoyaltyAccount(userId);
    
    // For testing without reward table, allow simple point redemption
    if (!redeemPointsDto.rewardId) {
      if (account.currentPoints < redeemPointsDto.points) {
        throw new BadRequestException('Insufficient points');
      }

      // Create simple redemption transaction
      const transaction = this.pointTransactionRepository.create({
        loyaltyAccountId: account.id,
        type: PointTransactionType.REDEEMED,
        points: -redeemPointsDto.points,
        balanceAfter: account.currentPoints - redeemPointsDto.points,
        description: 'Points redeemed',
        referenceId: redeemPointsDto.bookingId,
        referenceType: 'booking',
      });

      await this.pointTransactionRepository.save(transaction);

      // Update account
      account.currentPoints -= redeemPointsDto.points;
      account.totalPointsRedeemed += redeemPointsDto.points;

      return await this.loyaltyAccountRepository.save(account);
    }

    try {
      const reward = await this.loyaltyRewardRepository.findOne({
        where: { id: redeemPointsDto.rewardId, isActive: true },
      });

      if (!reward) {
        throw new NotFoundException('Reward not found or inactive');
      }

      if (account.currentPoints < redeemPointsDto.points) {
        throw new BadRequestException('Insufficient points');
      }

      if (redeemPointsDto.points !== reward.pointsRequired) {
        throw new BadRequestException('Invalid points amount for this reward');
      }

      // Check tier requirement
      if (!this.meetsMinimumTier(account.tier, reward.minimumTier)) {
        throw new BadRequestException(`This reward requires ${reward.minimumTier} tier or higher`);
      }

      // Create redemption transaction
      const transaction = this.pointTransactionRepository.create({
        loyaltyAccountId: account.id,
        type: PointTransactionType.REDEEMED,
        points: -redeemPointsDto.points,
        balanceAfter: account.currentPoints - redeemPointsDto.points,
        description: `Redeemed: ${reward.name}`,
        referenceId: redeemPointsDto.bookingId,
        referenceType: 'reward_redemption',
      });

      await this.pointTransactionRepository.save(transaction);

      // Update account
      account.currentPoints -= redeemPointsDto.points;
      account.totalPointsRedeemed += redeemPointsDto.points;

      return await this.loyaltyAccountRepository.save(account);
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        // Fallback to simple redemption if rewards table doesn't exist
        if (account.currentPoints < redeemPointsDto.points) {
          throw new BadRequestException('Insufficient points');
        }

        const transaction = this.pointTransactionRepository.create({
          loyaltyAccountId: account.id,
          type: PointTransactionType.REDEEMED,
          points: -redeemPointsDto.points,
          balanceAfter: account.currentPoints - redeemPointsDto.points,
          description: 'Points redeemed',
          referenceId: redeemPointsDto.bookingId,
          referenceType: 'booking',
        });

        await this.pointTransactionRepository.save(transaction);

        account.currentPoints -= redeemPointsDto.points;
        account.totalPointsRedeemed += redeemPointsDto.points;

        return await this.loyaltyAccountRepository.save(account);
      }
      throw error;
    }
  }

  async getPointsHistory(userId: string, limit: number = 50): Promise<PointTransaction[]> {
    const account = await this.getLoyaltyAccount(userId);
    
    return await this.pointTransactionRepository.find({
      where: { loyaltyAccountId: account.id },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAvailableRewards(
    userId: string,
    filters?: {
      tier?: string;
      maxPoints?: number;
      minPoints?: number;
      isActive?: boolean;
      limit?: number;
    }
  ): Promise<LoyaltyReward[]> {
    try {
      const account = await this.getLoyaltyAccount(userId);
      
      const queryBuilder = this.loyaltyRewardRepository.createQueryBuilder('reward');
      
      // Apply filters
      if (filters?.isActive !== undefined) {
        queryBuilder.andWhere('reward.isActive = :isActive', { isActive: filters.isActive });
      } else {
        queryBuilder.andWhere('reward.isActive = :isActive', { isActive: true });
      }
      
      if (filters?.minPoints) {
        queryBuilder.andWhere('reward.pointsRequired >= :minPoints', { minPoints: filters.minPoints });
      }
      
      if (filters?.maxPoints) {
        queryBuilder.andWhere('reward.pointsRequired <= :maxPoints', { maxPoints: filters.maxPoints });
      }
      
      if (filters?.tier) {
        const tierOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        const userTierLevel = tierOrder[account.tier] || 1;
        const filterTierLevel = tierOrder[filters.tier] || 1;
        
        // Show rewards for user's tier and below (if they have access)
        if (userTierLevel >= filterTierLevel) {
          queryBuilder.andWhere('reward.minimumTier = :tier', { tier: filters.tier });
        } else {
          // User doesn't have access to this tier
          return [];
        }
      }
      
      queryBuilder.orderBy('reward.pointsRequired', 'ASC');
      
      if (filters?.limit) {
        queryBuilder.take(filters.limit);
      }
      
      return await queryBuilder.getMany();
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return []; // Return empty array if rewards table doesn't exist
      }
      throw error;
    }
  }

  async getEligibleRewards(
    userId: string,
    tier?: LoyaltyTier,
    maxPoints?: number,
    minPoints?: number,
    limit?: number
  ): Promise<LoyaltyReward[]> {
    try {
      const account = await this.getLoyaltyAccount(userId);
      
      let queryBuilder = this.loyaltyRewardRepository.createQueryBuilder('reward')
        .where('reward.isActive = :isActive', { isActive: true })
        .andWhere('reward.pointsRequired <= :currentPoints', { currentPoints: account.currentPoints });

      // Apply tier filter
      if (tier) {
        queryBuilder = queryBuilder.andWhere('reward.minimumTier = :tier', { tier });
      }

      // Apply max points filter
      if (maxPoints) {
        queryBuilder = queryBuilder.andWhere('reward.pointsRequired <= :maxPoints', { maxPoints });
      }

      // Apply min points filter
      if (minPoints) {
        queryBuilder = queryBuilder.andWhere('reward.pointsRequired >= :minPoints', { minPoints });
      }

      queryBuilder = queryBuilder.orderBy('reward.pointsRequired', 'ASC');

      // Apply limit
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      const rewards = await queryBuilder.getMany();

      return rewards.filter(reward => this.meetsMinimumTier(account.tier, reward.minimumTier));
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return []; // Return empty array if rewards table doesn't exist
      }
      throw error;
    }
  }

  private async updateTier(account: LoyaltyAccount): Promise<void> {
    const currentTier = this.calculateTier(account.totalPointsEarned);
    
    if (currentTier !== account.tier) {
      account.tier = currentTier;
      account.lastTierUpgrade = new Date();
    }

    account.pointsToNextTier = this.calculatePointsToNextTier(account.totalPointsEarned, currentTier);
  }

  private calculateTier(totalPoints: number): LoyaltyTier {
    if (totalPoints >= this.tierThresholds[LoyaltyTier.PLATINUM]) {
      return LoyaltyTier.PLATINUM;
    } else if (totalPoints >= this.tierThresholds[LoyaltyTier.GOLD]) {
      return LoyaltyTier.GOLD;
    } else if (totalPoints >= this.tierThresholds[LoyaltyTier.SILVER]) {
      return LoyaltyTier.SILVER;
    } else {
      return LoyaltyTier.BRONZE;
    }
  }

  private calculatePointsToNextTier(totalPoints: number, currentTier: LoyaltyTier): number {
    const tierOrder = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM];
    const currentIndex = tierOrder.indexOf(currentTier);
    
    if (currentIndex === tierOrder.length - 1) {
      return 0; // Already at highest tier
    }

    const nextTier = tierOrder[currentIndex + 1];
    return this.tierThresholds[nextTier] - totalPoints;
  }

  private meetsMinimumTier(userTier: LoyaltyTier, requiredTier: string): boolean {
    const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
    const userTierMap = { [LoyaltyTier.BRONZE]: 'bronze', [LoyaltyTier.SILVER]: 'silver', [LoyaltyTier.GOLD]: 'gold', [LoyaltyTier.PLATINUM]: 'platinum' };
    
    const userTierLevel = tierOrder[userTierMap[userTier]] || 0;
    const requiredTierLevel = tierOrder[requiredTier] || 0;
    
    return userTierLevel >= requiredTierLevel;
  }

  // Admin methods for managing rewards
  async createReward(createRewardDto: CreateLoyaltyRewardDto): Promise<LoyaltyReward> {
    const rewardData = { ...createRewardDto };
    
    // Handle field mapping for discountPercentage and discountAmount
    if (createRewardDto.discountPercentage !== undefined) {
      rewardData.rewardValue = createRewardDto.discountPercentage;
      rewardData.rewardType = 'percentage';
    } else if (createRewardDto.discountAmount !== undefined) {
      rewardData.rewardValue = createRewardDto.discountAmount;
      rewardData.rewardType = 'amount';
    } else {
      rewardData.rewardType = createRewardDto.rewardType || 'discount';
      rewardData.rewardValue = createRewardDto.rewardValue || 0;
    }

    const reward = this.loyaltyRewardRepository.create(rewardData);
    return await this.loyaltyRewardRepository.save(reward);
  }

  async updateReward(id: string, updateRewardDto: UpdateLoyaltyRewardDto): Promise<LoyaltyReward> {
    const reward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    // Map discountPercentage and discountAmount to rewardValue if provided
    const updateData = { ...updateRewardDto };
    
    if (updateRewardDto.discountPercentage !== undefined) {
      updateData.rewardValue = updateRewardDto.discountPercentage;
      updateData.rewardType = 'percentage';
      delete updateData.discountPercentage;
    }
    
    if (updateRewardDto.discountAmount !== undefined) {
      updateData.rewardValue = updateRewardDto.discountAmount;
      updateData.rewardType = 'amount';
      delete updateData.discountAmount;
    }

    Object.assign(reward, updateData);
    return await this.loyaltyRewardRepository.save(reward);
  }

  async deleteReward(id: string): Promise<void> {
    const reward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    reward.isActive = false;
    await this.loyaltyRewardRepository.save(reward);
  }

  async getAllRewards(
    tier?: LoyaltyTier,
    isActive?: boolean,
    maxPoints?: number,
    minPoints?: number,
    limit?: number
  ): Promise<LoyaltyReward[]> {
    try {
      let queryBuilder = this.loyaltyRewardRepository.createQueryBuilder('reward');

      // Apply active filter
      if (isActive !== undefined) {
        queryBuilder = queryBuilder.where('reward.isActive = :isActive', { isActive });
      }

      // Apply tier filter
      if (tier) {
        queryBuilder = queryBuilder.andWhere('reward.minimumTier = :tier', { tier });
      }

      // Apply max points filter
      if (maxPoints) {
        queryBuilder = queryBuilder.andWhere('reward.pointsRequired <= :maxPoints', { maxPoints });
      }

      // Apply min points filter
      if (minPoints) {
        queryBuilder = queryBuilder.andWhere('reward.pointsRequired >= :minPoints', { minPoints });
      }

      queryBuilder = queryBuilder.orderBy('reward.pointsRequired', 'ASC');

      // Apply limit
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        return []; // Return empty array if rewards table doesn't exist
      }
      throw error;
    }
  }

  // Booking completion points calculation
  async calculateBookingPoints(bookingAmount: number): Promise<number> {
    // 1 point per $1 spent (configurable)
    return Math.floor(bookingAmount);
  }

  // Review bonus points
  async addReviewBonus(userId: string, reviewId: string): Promise<LoyaltyAccount> {
    return await this.addPoints(userId, {
      points: 50, // Configurable bonus
      description: 'Review submission bonus',
      referenceId: reviewId,
      referenceType: 'review',
    });
  }

  // Birthday bonus
  async addBirthdayBonus(userId: string): Promise<LoyaltyAccount> {
    return await this.addPoints(userId, {
      points: 200, // Configurable bonus
      description: 'Happy Birthday bonus points!',
      referenceType: 'birthday_bonus',
    });
  }
}