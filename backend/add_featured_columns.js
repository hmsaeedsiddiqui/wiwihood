const { Pool } = require('pg');
require('dotenv').config();

async function addMissingColumns() {
  const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔧 Adding Missing Columns for Featured Functionality...\n');
    
    // 1. Add missing columns to providers table
    console.log('1. Adding provider rating columns...');
    await pool.query(`
      ALTER TABLE providers 
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2);
    `);
    
    await pool.query(`
      ALTER TABLE providers 
      ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
    `);
    
    console.log('✅ Provider rating columns added');
    
    // 2. Add missing columns to services table  
    console.log('2. Adding service pricing columns...');
    await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2);
    `);
    
    await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
    
    console.log('✅ Service pricing columns added');
    
    // 3. Add featured column to categories
    console.log('3. Adding featured column to categories...');
    await pool.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    `);
    
    console.log('✅ Featured categories column added');
    
    // 4. Create promotions table if it doesn't exist
    console.log('4. Creating promotions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL,
        max_discount_amount DECIMAL(10,2),
        min_order_amount DECIMAL(10,2),
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        provider_id UUID REFERENCES providers(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Promotions table created');
    
    // 5. Verify all columns exist
    console.log('\n🔍 Verifying all columns...');
    
    const providerCols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'providers' AND column_name IN ('average_rating', 'total_reviews');
    `);
    
    const serviceCols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name IN ('base_price', 'is_active');
    `);
    
    const categoryCols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'is_featured';
    `);
    
    const promotionsTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'promotions';
    `);
    
    console.log('\n🎉 VERIFICATION RESULTS:');
    console.log(`✅ Provider ratings: ${providerCols.rows.length}/2 columns exist`);
    console.log(`✅ Service pricing: ${serviceCols.rows.length}/2 columns exist`);  
    console.log(`✅ Featured categories: ${categoryCols.rows.length}/1 columns exist`);
    console.log(`✅ Promotions table: ${promotionsTable.rows.length > 0 ? 'EXISTS' : 'MISSING'}`);
    
    console.log('\n🎯 ALL FEATURED FUNCTIONALITY COLUMNS ADDED SUCCESSFULLY!');
    
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
  } finally {
    await pool.end();
  }
}

addMissingColumns();