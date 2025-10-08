const { Client } = require('pg');

async function fixLoyaltyTierEnumProperly() {
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

    // Drop the default first
    await client.query(`
      ALTER TABLE loyalty_accounts 
      ALTER COLUMN tier DROP DEFAULT;
    `);
    console.log('✅ Dropped default for tier column');

    // Update existing values to ensure they match enum values
    await client.query(`
      UPDATE loyalty_accounts 
      SET tier = 'bronze' 
      WHERE tier NOT IN ('bronze', 'silver', 'gold', 'platinum');
    `);
    console.log('✅ Updated existing tier values');

    // Now change the column type
    await client.query(`
      ALTER TABLE loyalty_accounts 
      ALTER COLUMN tier TYPE loyalty_tier_enum 
      USING tier::loyalty_tier_enum;
    `);
    console.log('✅ Changed tier column to enum type');

    // Set the default back
    await client.query(`
      ALTER TABLE loyalty_accounts 
      ALTER COLUMN tier SET DEFAULT 'bronze'::loyalty_tier_enum;
    `);
    console.log('✅ Set default value for tier column');

    // Check the table structure
    const columns = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_accounts' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Final loyalty_accounts table structure:');
    console.table(columns.rows);

    console.log('\n🎉 Loyalty tier enum fixed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔚 Database connection closed');
  }
}

fixLoyaltyTierEnumProperly();