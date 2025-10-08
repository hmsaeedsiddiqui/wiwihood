const { Client } = require('pg');

async function fixLoyaltyTierEnum() {
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

    // Create enum type for loyalty tier
    await client.query(`
      CREATE TYPE loyalty_tier_enum AS ENUM ('bronze', 'silver', 'gold', 'platinum');
    `);
    console.log('✅ Created loyalty_tier_enum type');

    // Update the tier column to use enum type
    await client.query(`
      ALTER TABLE loyalty_accounts 
      ALTER COLUMN tier TYPE loyalty_tier_enum 
      USING tier::loyalty_tier_enum;
    `);
    console.log('✅ Updated tier column to use enum type');

    // Add last_tier_upgrade column rename to match entity
    try {
      await client.query(`
        ALTER TABLE loyalty_accounts 
        RENAME COLUMN last_tier_upgrade TO last_tier_upgrade_at;
      `);
      console.log('✅ Renamed last_tier_upgrade to last_tier_upgrade_at');
    } catch (error) {
      console.log('ℹ️ Column already renamed or doesn\'t exist');
    }

    // Verify table structure matches entity
    const columns = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_accounts' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Updated loyalty_accounts table structure:');
    console.table(columns.rows);

    // Check if user data exists
    const userData = await client.query(`
      SELECT * FROM loyalty_accounts 
      WHERE user_id = '474a5df3-60cf-446a-b446-a9763b26a81e';
    `);
    
    console.log('\n👤 User loyalty data:');
    if (userData.rows.length > 0) {
      console.table(userData.rows);
    } else {
      console.log('❌ No loyalty data found for user');
    }

    console.log('\n🎉 Loyalty enum type fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // If enum already exists, just continue
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Enum type already exists, continuing...');
    }
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

fixLoyaltyTierEnum();