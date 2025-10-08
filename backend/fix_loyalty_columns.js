const { Client } = require('pg');

async function fixLoyaltyColumnNames() {
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

    // Fix column name to match entity (camelCase)
    try {
      await client.query(`
        ALTER TABLE loyalty_accounts 
        RENAME COLUMN last_tier_upgrade TO "lastTierUpgrade";
      `);
      console.log('✅ Renamed last_tier_upgrade to lastTierUpgrade');
    } catch (error) {
      console.log('ℹ️ Column already renamed or doesn\'t exist:', error.message.split('\n')[0]);
    }

    // Also fix other column names to match camelCase convention
    const columnRenames = [
      { from: 'user_id', to: 'userId' },
      { from: 'current_points', to: 'currentPoints' },
      { from: 'total_points_earned', to: 'totalPointsEarned' },
      { from: 'total_points_redeemed', to: 'totalPointsRedeemed' },
      { from: 'points_to_next_tier', to: 'pointsToNextTier' },
      { from: 'created_at', to: 'createdAt' },
      { from: 'updated_at', to: 'updatedAt' }
    ];

    for (const rename of columnRenames) {
      try {
        await client.query(`
          ALTER TABLE loyalty_accounts 
          RENAME COLUMN ${rename.from} TO "${rename.to}";
        `);
        console.log(`✅ Renamed ${rename.from} to ${rename.to}`);
      } catch (error) {
        console.log(`ℹ️ Column ${rename.from} already renamed or doesn't exist`);
      }
    }

    // Create point_transactions table to match the entity
    await client.query(`
      CREATE TABLE IF NOT EXISTS point_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "loyaltyAccountId" UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        description TEXT,
        "referenceId" UUID,
        "referenceType" VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created point_transactions table with camelCase columns');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_loyalty_account ON point_transactions("loyaltyAccountId");');
    await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(type);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_point_transactions_created ON point_transactions("createdAt");');
    console.log('✅ Created indexes for point_transactions');

    // Check final table structure
    const columns = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_accounts' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Final loyalty_accounts table structure:');
    console.table(columns.rows);

    console.log('\n🎉 Loyalty database schema fully fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

fixLoyaltyColumnNames();