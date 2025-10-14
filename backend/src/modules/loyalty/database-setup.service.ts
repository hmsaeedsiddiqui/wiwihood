import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyReward } from '../../entities/loyalty.entity';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  constructor(
    @InjectRepository(LoyaltyReward)
    private readonly loyaltyRewardRepository: Repository<LoyaltyReward>,
  ) {}

  async onModuleInit() {
    await this.createLoyaltyRewardsTableIfNotExists();
  }

  private async createLoyaltyRewardsTableIfNotExists() {
    try {
      // Check if the table exists by trying to get its structure
      const queryRunner = this.loyaltyRewardRepository.manager.connection.createQueryRunner();
      
      try {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS loyalty_rewards (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            points_required INTEGER NOT NULL,
            reward_type VARCHAR(50) DEFAULT 'discount',
            reward_value DECIMAL(10,2) DEFAULT 0,
            tier_required VARCHAR(20) DEFAULT 'bronze',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Insert sample rewards if table is empty
        const count = await this.loyaltyRewardRepository.count();
        if (count === 0) {
          await queryRunner.query(`
            INSERT INTO loyalty_rewards (name, description, points_required, reward_type, reward_value, tier_required) VALUES
            ('5% Discount', '5% off your next booking', 100, 'percentage', 5.00, 'bronze'),
            ('10% Discount', '10% off your next booking', 250, 'percentage', 10.00, 'silver'),
            ('15% Discount', '15% off your next booking', 500, 'percentage', 15.00, 'gold'),
            ('Free Service Add-on', 'Free add-on service worth $20', 300, 'amount', 20.00, 'silver'),
            ('Priority Booking', 'Skip the queue with priority booking', 750, 'special', 0, 'gold');
          `);
          console.log('Sample loyalty rewards created');
        }
      } finally {
        await queryRunner.release();
      }

      console.log('Loyalty rewards table setup completed');
    } catch (error) {
      console.error('Error setting up loyalty rewards table:', error.message);
    }
  }
}