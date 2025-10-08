const { Client } = require('pg');

async function createLoyaltyTables() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create loyalty table
    const createLoyaltyTable = `
      CREATE TABLE IF NOT EXISTS loyalty (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        current_points INTEGER DEFAULT 0,
        total_points_earned INTEGER DEFAULT 0,
        total_points_redeemed INTEGER DEFAULT 0,
        tier VARCHAR(20) DEFAULT 'bronze',
        points_to_next_tier INTEGER DEFAULT 0,
        last_tier_upgrade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `;

    await client.query(createLoyaltyTable);
    console.log('✅ Created loyalty table');

    // Create loyalty_transactions table
    const createLoyaltyTransactionsTable = `
      CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        loyalty_id UUID NOT NULL REFERENCES loyalty(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'earned', 'redeemed'
        description TEXT,
        reference_id UUID, -- booking_id, review_id, etc.
        reference_type VARCHAR(50), -- 'booking', 'review', 'referral', etc.
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createLoyaltyTransactionsTable);
    console.log('✅ Created loyalty_transactions table');

    // Create loyalty_rewards table
    const createLoyaltyRewardsTable = `
      CREATE TABLE IF NOT EXISTS loyalty_rewards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        points_required INTEGER NOT NULL,
        reward_type VARCHAR(50) NOT NULL, -- 'discount', 'freebie', 'cashback'
        reward_value DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT true,
        tier_required VARCHAR(20) DEFAULT 'bronze',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createLoyaltyRewardsTable);
    console.log('✅ Created loyalty_rewards table');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_user_id ON loyalty(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_loyalty_id ON loyalty_transactions(loyalty_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_active ON loyalty_rewards(is_active);');
    console.log('✅ Created indexes');

    // Create loyalty account for john.doe user
    const createUserLoyalty = `
      INSERT INTO loyalty (user_id, current_points, total_points_earned, total_points_redeemed, tier, points_to_next_tier)
      VALUES ('474a5df3-60cf-446a-b446-a9763b26a81e', 100, 100, 0, 'bronze', 400)
      ON CONFLICT (user_id) DO NOTHING;
    `;

    await client.query(createUserLoyalty);
    console.log('✅ Created loyalty account for john.doe@example.com');

    // Add sample rewards
    const sampleRewards = `
      INSERT INTO loyalty_rewards (name, description, points_required, reward_type, reward_value, tier_required)
      VALUES 
        ('5% Discount', 'Get 5% off on your next booking', 100, 'discount', 5.00, 'bronze'),
        ('10% Discount', 'Get 10% off on your next booking', 250, 'discount', 10.00, 'silver'),
        ('Free Service', 'Get a free basic service', 500, 'freebie', 0.00, 'gold'),
        ('Cash Back', 'Get $5 cash back', 200, 'cashback', 5.00, 'bronze')
      ON CONFLICT DO NOTHING;
    `;

    await client.query(sampleRewards);
    console.log('✅ Added sample loyalty rewards');

    console.log('\n🎉 Loyalty system setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

createLoyaltyTables();