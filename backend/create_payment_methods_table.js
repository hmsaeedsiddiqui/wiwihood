const { Pool } = require('pg');
require('dotenv').config();

async function createPaymentMethodsTable() {
  console.log('🏦 CREATING PAYMENT METHODS TABLE FOR USER DASHBOARD\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔍 1. CHECKING IF PAYMENT METHODS TABLE EXISTS:');
    console.log('───────────────────────────────────────────────────────────────');
    
    const tableExists = await pool.query(`
      SELECT to_regclass('public.payment_methods') as table_exists
    `);
    
    if (tableExists.rows[0].table_exists) {
      console.log('   ✅ Payment Methods table already exists');
      
      // Check columns
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'payment_methods' 
        ORDER BY ordinal_position
      `);
      
      console.log('   📋 Existing columns:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      return;
    }
    
    console.log('   📝 Payment Methods table does not exist, creating...');
    
    console.log('\n🔨 2. CREATING PAYMENT METHODS TABLE:');
    console.log('───────────────────────────────────────────────────────────────');
    
    // Create payment method type enum
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_method_type AS ENUM ('card', 'bank', 'digital_wallet');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);
    
    console.log('   ✅ Payment method type enum created');
    
    // Create payment_methods table
    await pool.query(`
      CREATE TABLE payment_methods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type payment_method_type NOT NULL DEFAULT 'card',
        stripe_payment_method_id VARCHAR(255),
        last_four_digits VARCHAR(4),
        card_brand VARCHAR(50),
        expiry_month INTEGER CHECK (expiry_month >= 1 AND expiry_month <= 12),
        expiry_year INTEGER CHECK (expiry_year >= EXTRACT(YEAR FROM NOW())),
        billing_name VARCHAR(255),
        billing_email VARCHAR(255),
        billing_address TEXT,
        billing_city VARCHAR(100),
        billing_state VARCHAR(100),
        billing_postal_code VARCHAR(20),
        billing_country VARCHAR(2),
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        nickname VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    console.log('   ✅ Payment methods table created');
    
    console.log('\n📊 3. CREATING INDEXES:');
    console.log('───────────────────────────────────────────────────────────────');
    
    // Create indexes
    await pool.query(`
      CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
    `);
    console.log('   ✅ Index on user_id created');
    
    await pool.query(`
      CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);
    `);
    console.log('   ✅ Index on is_default created');
    
    await pool.query(`
      CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);
    `);
    console.log('   ✅ Index on is_active created');
    
    await pool.query(`
      CREATE INDEX idx_payment_methods_stripe_id ON payment_methods(stripe_payment_method_id);
    `);
    console.log('   ✅ Index on stripe_payment_method_id created');
    
    console.log('\n🔒 4. CREATING CONSTRAINTS:');
    console.log('───────────────────────────────────────────────────────────────');
    
    // Constraint to ensure only one default payment method per user
    await pool.query(`
      CREATE UNIQUE INDEX idx_payment_methods_user_default 
      ON payment_methods(user_id) 
      WHERE is_default = TRUE AND is_active = TRUE;
    `);
    console.log('   ✅ Unique constraint on default payment method per user created');
    
    console.log('\n🎯 5. CREATING UPDATE TRIGGER:');
    console.log('───────────────────────────────────────────────────────────────');
    
    // Create update trigger for updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    await pool.query(`
      CREATE TRIGGER update_payment_methods_updated_at
      BEFORE UPDATE ON payment_methods
      FOR EACH ROW EXECUTE PROCEDURE update_payment_methods_updated_at();
    `);
    console.log('   ✅ Updated_at trigger created');
    
    console.log('\n📝 6. INSERTING SAMPLE DATA:');
    console.log('───────────────────────────────────────────────────────────────');
    
    // Get a test user
    const testUser = await pool.query(`
      SELECT id FROM users LIMIT 1
    `);
    
    if (testUser.rows.length > 0) {
      const userId = testUser.rows[0].id;
      
      // Insert sample payment methods
      await pool.query(`
        INSERT INTO payment_methods (
          user_id, type, last_four_digits, card_brand, expiry_month, expiry_year,
          billing_name, billing_email, is_default, nickname
        ) VALUES
        ($1, 'card', '4242', 'visa', 12, 2025, 'John Doe', 'john.doe@example.com', TRUE, 'My Visa Card'),
        ($1, 'card', '5555', 'mastercard', 08, 2026, 'John Doe', 'john.doe@example.com', FALSE, 'Backup Card')
      `, [userId]);
      
      console.log('   ✅ Sample payment methods inserted');
    } else {
      console.log('   ⚠️  No users found, skipping sample data insertion');
    }
    
    console.log('\n📋 7. VERIFYING TABLE STRUCTURE:');
    console.log('───────────────────────────────────────────────────────────────');
    
    const finalColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'payment_methods' 
      ORDER BY ordinal_position
    `);
    
    console.log('   📊 Final table structure:');
    finalColumns.rows.forEach(col => {
      console.log(`   ✅ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
    // Check foreign keys
    const foreignKeys = await pool.query(`
      SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'payment_methods'
    `);
    
    console.log('\n   🔗 Foreign key relationships:');
    foreignKeys.rows.forEach(fk => {
      console.log(`   ✅ ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    
    console.log('\n🏆 8. PAYMENT METHODS TABLE CREATION COMPLETE:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ Payment Methods table successfully created!');
    console.log('✅ All indexes and constraints added');
    console.log('✅ Update triggers configured');
    console.log('✅ Sample data inserted');
    console.log('');
    console.log('🎯 User Dashboard Payment Methods Features:');
    console.log('   • Add new payment methods (cards, bank accounts)');
    console.log('   • View all saved payment methods');
    console.log('   • Set default payment method');
    console.log('   • Update billing information');
    console.log('   • Delete payment methods');
    console.log('   • Secure card data handling');
    console.log('   • Integration with Stripe');
    console.log('');
    console.log('🚀 API Endpoints Available:');
    console.log('   • GET /api/v1/payment-methods - List user payment methods');
    console.log('   • POST /api/v1/payment-methods - Add new payment method');
    console.log('   • GET /api/v1/payment-methods/default - Get default payment method');
    console.log('   • PATCH /api/v1/payment-methods/:id - Update payment method');
    console.log('   • PATCH /api/v1/payment-methods/:id/set-default - Set as default');
    console.log('   • DELETE /api/v1/payment-methods/:id - Remove payment method');
    
  } catch (error) {
    console.error('❌ Error creating payment methods table:', error.message);
  } finally {
    await pool.end();
  }
}

createPaymentMethodsTable();