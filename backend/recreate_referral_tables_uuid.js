const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  ssl: {
    rejectUnauthorized: false
  }
});

async function recreateReferralTablesWithUuid() {
  try {
    console.log('🔄 Recreating referral tables with proper UUID support...\n');
    
    // Drop existing tables in correct order (FK constraints)
    await pool.query('DROP TABLE IF EXISTS referrals CASCADE');
    await pool.query('DROP TABLE IF EXISTS referral_codes CASCADE');
    await pool.query('DROP TABLE IF EXISTS referral_campaigns CASCADE');
    console.log('✅ Dropped existing tables');
    
    // Create referral_campaigns table
    await pool.query(`
      CREATE TABLE referral_campaigns (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          reward_type VARCHAR(50) NOT NULL DEFAULT 'DISCOUNT',
          reward_value DECIMAL(10,2) NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_date TIMESTAMP,
          max_uses INTEGER,
          current_uses INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created referral_campaigns table');
    
    // Create referral_codes table with UUID
    await pool.query(`
      CREATE TABLE referral_codes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          code VARCHAR(50) UNIQUE NOT NULL,
          campaign_id INTEGER,
          is_active BOOLEAN NOT NULL DEFAULT true,
          uses_count INTEGER DEFAULT 0,
          max_uses INTEGER DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (campaign_id) REFERENCES referral_campaigns(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Created referral_codes table with UUID');
    
    // Create referrals table with UUID
    await pool.query(`
      CREATE TABLE referrals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          referrer_id UUID NOT NULL,
          referred_id UUID NOT NULL,
          referral_code_id UUID NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          reward_amount DECIMAL(10,2) DEFAULT 0,
          reward_given BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (referral_code_id) REFERENCES referral_codes(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created referrals table with UUID');
    
    // Create indexes
    await pool.query('CREATE INDEX idx_referral_codes_user_id ON referral_codes(user_id)');
    await pool.query('CREATE INDEX idx_referral_codes_code ON referral_codes(code)');
    await pool.query('CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id)');
    await pool.query('CREATE INDEX idx_referrals_referred_id ON referrals(referred_id)');
    await pool.query('CREATE INDEX idx_referrals_status ON referrals(status)');
    console.log('✅ Created indexes');
    
    // Insert default campaign
    await pool.query(`
      INSERT INTO referral_campaigns (name, description, reward_type, reward_value, is_active)
      VALUES ('Default Referral Campaign', 'Default campaign for referral rewards', 'DISCOUNT', 10.00, true)
    `);
    console.log('✅ Inserted default campaign');
    
    console.log('\n🎉 Referral tables recreated successfully with UUID support!');
    
  } catch (error) {
    console.error('❌ Error recreating tables:', error.message);
  } finally {
    await pool.end();
  }
}

recreateReferralTablesWithUuid();