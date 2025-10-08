const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  ssl: {
    rejectUnauthorized: false
  }
};

async function createLoyaltyRewardsTable() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');

    // Create loyalty_rewards table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS loyalty_rewards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        "pointsRequired" INTEGER NOT NULL,
        "minimumTier" VARCHAR(50) NOT NULL DEFAULT 'bronze',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(createTableQuery);
    console.log('loyalty_rewards table created successfully!');

    // Add sample rewards data
    const rewards = [
      {
        name: 'Free Coffee',
        description: 'Get a free coffee on us!',
        pointsRequired: 100,
        minimumTier: 'bronze',
        isActive: true
      },
      {
        name: '10% Discount',
        description: 'Get 10% off your next purchase',
        pointsRequired: 200,
        minimumTier: 'bronze',
        isActive: true
      },
      {
        name: 'Free Dessert',
        description: 'Enjoy a free dessert with your meal',
        pointsRequired: 300,
        minimumTier: 'silver',
        isActive: true
      },
      {
        name: '20% Discount',
        description: 'Get 20% off your entire order',
        pointsRequired: 500,
        minimumTier: 'silver',
        isActive: true
      },
      {
        name: 'Free Main Course',
        description: 'Get a free main course meal',
        pointsRequired: 800,
        minimumTier: 'gold',
        isActive: true
      },
      {
        name: 'VIP Experience',
        description: 'Exclusive VIP dining experience',
        pointsRequired: 1500,
        minimumTier: 'platinum',
        isActive: true
      },
      {
        name: 'Expired Reward',
        description: 'This reward is no longer available',
        pointsRequired: 150,
        minimumTier: 'bronze',
        isActive: false
      }
    ];

    // Insert rewards
    for (const reward of rewards) {
      const query = `
        INSERT INTO loyalty_rewards (
          name, description, points_required, tier_required, is_active, reward_type, reward_value
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await client.query(query, [
        reward.name,
        reward.description,
        reward.pointsRequired,
        reward.minimumTier,
        reward.isActive,
        'discount', // reward_type
        0 // reward_value
      ]);
      
      console.log(`Added reward: ${reward.name}`);
    }

    console.log('All sample rewards added successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createLoyaltyRewardsTable();