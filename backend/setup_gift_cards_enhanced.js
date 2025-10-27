const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DATABASE_USERNAME || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'wiwihood_db',
  password: process.env.DATABASE_PASSWORD || 'root',
  port: process.env.DATABASE_PORT || 5432,
});

async function checkAndUpdateGiftCardTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking current gift card table structure...');
    
    // Check if gift_cards table exists and its columns
    const tableCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'gift_cards' 
      ORDER BY ordinal_position;
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('📋 Current gift_cards table structure:');
      tableCheck.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Drop and recreate table with new structure
      console.log('\\n🔄 Dropping existing table and recreating with enhanced structure...');
      await client.query('DROP TABLE IF EXISTS gift_card_usage CASCADE;');
      await client.query('DROP TABLE IF EXISTS gift_cards CASCADE;');
    }
    
    // Create new enhanced gift_cards table
    console.log('🔄 Creating enhanced gift_cards table...');
    await client.query(`
      CREATE TABLE gift_cards (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          code VARCHAR(20) UNIQUE NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          current_balance DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
          
          -- Purchase Information
          purchaser_email VARCHAR(255) NOT NULL,
          purchaser_name VARCHAR(255),
          purchaser_phone VARCHAR(20),
          purchaser_id UUID,
          
          -- Recipient Information
          recipient_email VARCHAR(255) NOT NULL,
          recipient_name VARCHAR(255),
          personal_message TEXT,
          
          -- Status and Lifecycle
          status VARCHAR(20) DEFAULT 'active' NOT NULL,
          is_physical BOOLEAN DEFAULT FALSE,
          is_transferable BOOLEAN DEFAULT true,
          
          -- Dates
          purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          delivery_date TIMESTAMP,
          first_redemption_date TIMESTAMP,
          last_redemption_date TIMESTAMP,
          expiry_date TIMESTAMP NOT NULL,
          
          -- Business Logic
          provider_id UUID,
          service_id UUID,
          minimum_spend DECIMAL(10,2) DEFAULT 0,
          maximum_discount DECIMAL(10,2),
          
          -- Payment Information
          payment_intent_id VARCHAR(255),
          payment_status VARCHAR(20) DEFAULT 'pending',
          transaction_fee DECIMAL(10,2) DEFAULT 0,
          
          -- Metadata
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by UUID,
          current_owner_id UUID,
          
          -- Constraints
          CONSTRAINT chk_amount_positive CHECK (amount > 0),
          CONSTRAINT chk_balance_valid CHECK (current_balance >= 0 AND current_balance <= amount),
          CONSTRAINT chk_status_valid CHECK (status IN ('active', 'redeemed', 'partially_redeemed', 'canceled', 'expired'))
      );
    `);
    
    // Create gift card transactions table
    console.log('🔄 Creating gift_card_transactions table...');
    await client.query(`
      CREATE TABLE gift_card_transactions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          gift_card_id UUID NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
          
          -- Transaction Details
          transaction_type VARCHAR(20) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          balance_before DECIMAL(10,2) NOT NULL,
          balance_after DECIMAL(10,2) NOT NULL,
          
          -- Order/Service Information
          booking_id UUID,
          order_id UUID,
          provider_id UUID,
          
          -- User Information
          redeemed_by_email VARCHAR(255),
          user_id UUID,
          
          -- Location and Context
          redemption_location VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          
          -- Metadata
          transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          -- Constraints
          CONSTRAINT chk_transaction_amount_positive CHECK (amount > 0),
          CONSTRAINT chk_transaction_type_valid CHECK (transaction_type IN ('redemption', 'refund', 'adjustment'))
      );
    `);
    
    // Create gift card promotions table
    console.log('🔄 Creating gift_card_promotions table...');
    await client.query(`
      CREATE TABLE gift_card_promotions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          
          -- Promotion Rules
          promotion_type VARCHAR(20) NOT NULL,
          bonus_percentage DECIMAL(5,2) DEFAULT 0,
          bonus_amount DECIMAL(10,2) DEFAULT 0,
          minimum_purchase DECIMAL(10,2) DEFAULT 0,
          
          -- Validity
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          
          -- Usage Limits
          usage_limit INTEGER,
          usage_count INTEGER DEFAULT 0,
          per_customer_limit INTEGER DEFAULT 1,
          
          -- Targeting
          customer_email_pattern VARCHAR(255),
          provider_id UUID,
          
          -- Metadata
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by UUID,
          
          -- Constraints
          CONSTRAINT chk_promotion_dates CHECK (end_date > start_date),
          CONSTRAINT chk_bonus_valid CHECK (bonus_percentage >= 0 AND bonus_percentage <= 100),
          CONSTRAINT chk_promotion_type_valid CHECK (promotion_type IN ('bonus', 'discount', 'bulk'))
      );
    `);
    
    // Create gift card settings table
    console.log('🔄 Creating gift_card_settings table...');
    await client.query(`
      CREATE TABLE gift_card_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          setting_key VARCHAR(100) UNIQUE NOT NULL,
          setting_value TEXT NOT NULL,
          data_type VARCHAR(20) DEFAULT 'string',
          description TEXT,
          is_public BOOLEAN DEFAULT FALSE,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_by UUID
      );
    `);
    
    // Create indexes for performance
    console.log('🔄 Creating indexes...');
    const indexes = [
      'CREATE INDEX idx_gift_cards_code ON gift_cards(code);',
      'CREATE INDEX idx_gift_cards_status ON gift_cards(status);',
      'CREATE INDEX idx_gift_cards_purchaser_email ON gift_cards(purchaser_email);',
      'CREATE INDEX idx_gift_cards_recipient_email ON gift_cards(recipient_email);',
      'CREATE INDEX idx_gift_cards_expiry_date ON gift_cards(expiry_date);',
      'CREATE INDEX idx_gift_cards_provider_id ON gift_cards(provider_id);',
      'CREATE INDEX idx_gift_cards_purchase_date ON gift_cards(purchase_date);',
      'CREATE INDEX idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);',
      'CREATE INDEX idx_gift_card_transactions_transaction_date ON gift_card_transactions(transaction_date);',
      'CREATE INDEX idx_gift_card_transactions_user_id ON gift_card_transactions(user_id);',
      'CREATE INDEX idx_gift_card_promotions_active ON gift_card_promotions(is_active);',
      'CREATE INDEX idx_gift_card_promotions_dates ON gift_card_promotions(start_date, end_date);'
    ];
    
    for (const index of indexes) {
      await client.query(index);
    }
    
    // Insert default settings
    console.log('🔄 Inserting default settings...');
    await client.query(`
      INSERT INTO gift_card_settings (setting_key, setting_value, data_type, description, is_public) VALUES
      ('default_expiry_months', '12', 'number', 'Default expiry period in months', TRUE),
      ('minimum_amount', '10', 'number', 'Minimum gift card purchase amount', TRUE),
      ('maximum_amount', '1000', 'number', 'Maximum gift card purchase amount', TRUE),
      ('allowed_amounts', '[25, 50, 100, 250, 500]', 'json', 'Predefined gift card amounts', TRUE),
      ('email_delivery_enabled', 'true', 'boolean', 'Enable automatic email delivery', FALSE),
      ('physical_cards_enabled', 'false', 'boolean', 'Enable physical gift cards', TRUE),
      ('bulk_purchase_enabled', 'true', 'boolean', 'Enable bulk gift card purchases', TRUE),
      ('refund_policy_days', '7', 'number', 'Days within which refund is allowed', TRUE),
      ('transaction_fee_percentage', '2.9', 'number', 'Transaction fee percentage', FALSE),
      ('code_prefix', 'GC-', 'string', 'Prefix for gift card codes', FALSE),
      ('code_length', '10', 'number', 'Length of gift card code (excluding prefix)', FALSE)
      ON CONFLICT (setting_key) DO NOTHING;
    `);
    
    // Create trigger for updated_at
    console.log('🔄 Creating triggers...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    const triggers = [
      'CREATE TRIGGER update_gift_cards_updated_at BEFORE UPDATE ON gift_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'CREATE TRIGGER update_gift_card_transactions_updated_at BEFORE UPDATE ON gift_card_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'CREATE TRIGGER update_gift_card_promotions_updated_at BEFORE UPDATE ON gift_card_promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
    ];
    
    for (const trigger of triggers) {
      await client.query(trigger);
    }
    
    // Insert sample data for testing
    console.log('🔄 Inserting sample gift cards for testing...');
    const sampleCards = [
      {
        code: 'GC-TEST001',
        amount: 100.00,
        current_balance: 100.00,
        purchaser_email: 'customer@example.com',
        purchaser_name: 'John Customer',
        recipient_email: 'friend@example.com',
        recipient_name: 'Jane Friend',
        personal_message: 'Happy Birthday! Enjoy this gift card.',
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        payment_status: 'completed'
      },
      {
        code: 'GC-TEST002',
        amount: 50.00,
        current_balance: 25.00,
        purchaser_email: 'user@example.com',
        purchaser_name: 'Alice User',
        recipient_email: 'recipient@example.com',
        recipient_name: 'Bob Recipient',
        personal_message: 'Congratulations on your promotion!',
        status: 'partially_redeemed',
        first_redemption_date: new Date(),
        last_redemption_date: new Date(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        payment_status: 'completed'
      },
      {
        code: 'GC-TEST003',
        amount: 200.00,
        current_balance: 0.00,
        purchaser_email: 'buyer@example.com',
        purchaser_name: 'Charlie Buyer',
        recipient_email: 'giftee@example.com',
        recipient_name: 'Diana Giftee',
        personal_message: 'Merry Christmas!',
        status: 'redeemed',
        first_redemption_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        last_redemption_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        payment_status: 'completed'
      }
    ];
    
    for (const card of sampleCards) {
      await client.query(`
        INSERT INTO gift_cards (
          code, amount, current_balance, purchaser_email, purchaser_name,
          recipient_email, recipient_name, personal_message, status,
          first_redemption_date, last_redemption_date, expiry_date, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        card.code, card.amount, card.current_balance, card.purchaser_email, card.purchaser_name,
        card.recipient_email, card.recipient_name, card.personal_message, card.status || 'active',
        card.first_redemption_date, card.last_redemption_date, card.expiry_date, card.payment_status
      ]);
    }
    
    console.log('✅ Enhanced gift cards database schema created successfully!');
    console.log('📊 Tables created:');
    console.log('   - gift_cards (main table with comprehensive fields)');
    console.log('   - gift_card_transactions (transaction history)');
    console.log('   - gift_card_promotions (promotional campaigns)');
    console.log('   - gift_card_settings (system configuration)');
    console.log('🔗 Indexes and triggers created for optimal performance');
    console.log('📝 Sample gift cards inserted for testing');
    
    // Verify tables exist and show counts
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'gift_card%'
      ORDER BY table_name;
    `);
    
    console.log('\\n📋 Verified tables:');
    for (const row of result.rows) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${row.table_name}`);
      console.log(`   ✓ ${row.table_name} (${countResult.rows[0].count} records)`);
    }
    
  } catch (error) {
    console.error('❌ Error updating gift card tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the setup
checkAndUpdateGiftCardTables()
  .then(() => {
    console.log('\\n🎉 Gift card database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });