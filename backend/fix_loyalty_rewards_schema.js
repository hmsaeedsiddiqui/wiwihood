const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  ssl: false
});

async function fixLoyaltyRewardsTable() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Drop existing table if it exists
    console.log('🗑️ Dropping existing loyalty_rewards table...');
    await client.query('DROP TABLE IF EXISTS loyalty_rewards CASCADE');
    console.log('✅ Dropped loyalty_rewards table');

    // Create new table with correct schema matching entity definition
    console.log('🔨 Creating loyalty_rewards table with correct schema...');
    await client.query(`
      CREATE TABLE loyalty_rewards (
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
    console.log('✅ Created loyalty_rewards table');

    // Create indexes
    console.log('🔧 Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_tier ON loyalty_rewards(tier_required);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_active ON loyalty_rewards(is_active);');
    console.log('✅ Created indexes');

    // Insert sample data
    console.log('📝 Inserting sample rewards...');
    await client.query(`
      INSERT INTO loyalty_rewards (name, description, points_required, reward_type, reward_value, tier_required) VALUES
      ('5% Discount', '5% off your next booking', 100, 'percentage', 5.00, 'bronze'),
      ('10% Discount', '10% off your next booking', 250, 'percentage', 10.00, 'silver'),
      ('15% Discount', '15% off your next booking', 500, 'percentage', 15.00, 'gold'),
      ('Free Service Add-on', 'Free add-on service worth $20', 300, 'amount', 20.00, 'silver'),
      ('Priority Booking', 'Skip the queue with priority booking', 750, 'special', 0, 'gold');
    `);
    console.log('✅ Inserted sample rewards');

    // Verify the table structure
    console.log('🔍 Verifying table structure...');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_rewards' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 loyalty_rewards table columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}) default: ${col.column_default}`);
    });

    // Count records
    const count = await client.query('SELECT COUNT(*) as count FROM loyalty_rewards');
    console.log(`\n📊 Total rewards: ${count.rows[0].count}`);

    console.log('\n🎉 loyalty_rewards table fixed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('👋 Disconnected from database');
  }
}

fixLoyaltyRewardsTable();