const { Pool } = require('pg');
require('dotenv').config();

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

async function fixGiftCardUsageSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking gift_card_usage table schema...');
    
    // Check current schema
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'gift_card_usage' 
      ORDER BY ordinal_position;
    `;
    
    const schemaResult = await client.query(schemaQuery);
    console.log('📋 Current gift_card_usage columns:');
    schemaResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gift_card_usage'
      );
    `;
    
    const tableExists = await client.query(tableExistsQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log('🏗️ Creating gift_card_usage table...');
      
      const createTableQuery = `
        CREATE TABLE gift_card_usage (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          gift_card_id uuid NOT NULL,
          amount_used DECIMAL(10, 2) NOT NULL,
          remaining_balance DECIMAL(10, 2) NOT NULL,
          used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          used_in_booking_id uuid,
          description TEXT,
          FOREIGN KEY (gift_card_id) REFERENCES gift_cards(id) ON DELETE CASCADE
        );
      `;
      
      await client.query(createTableQuery);
      
      // Create indexes
      await client.query('CREATE INDEX idx_gift_card_usage_gift_card_id ON gift_card_usage(gift_card_id);');
      await client.query('CREATE INDEX idx_gift_card_usage_booking_id ON gift_card_usage(used_in_booking_id);');
      
      console.log('✅ gift_card_usage table created successfully!');
      
    } else {
      console.log('📝 Table exists, checking/adding missing columns...');
      
      // Check if remaining_balance column exists
      const remainingBalanceExists = schemaResult.rows.some(row => row.column_name === 'remaining_balance');
      
      if (!remainingBalanceExists) {
        console.log('➕ Adding remaining_balance column...');
        await client.query(`
          ALTER TABLE gift_card_usage 
          ADD COLUMN remaining_balance DECIMAL(10, 2) NOT NULL DEFAULT 0;
        `);
        console.log('✅ remaining_balance column added!');
      }
      
      // Check if amount_used column exists
      const amountUsedExists = schemaResult.rows.some(row => row.column_name === 'amount_used');
      
      if (!amountUsedExists) {
        console.log('➕ Adding amount_used column...');
        await client.query(`
          ALTER TABLE gift_card_usage 
          ADD COLUMN amount_used DECIMAL(10, 2) NOT NULL DEFAULT 0;
        `);
        console.log('✅ amount_used column added!');
      }
      
      // Check if used_at column exists
      const usedAtExists = schemaResult.rows.some(row => row.column_name === 'used_at');
      
      if (!usedAtExists) {
        console.log('➕ Adding used_at column...');
        await client.query(`
          ALTER TABLE gift_card_usage 
          ADD COLUMN used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log('✅ used_at column added!');
      }
      
      // Check if used_in_booking_id column exists
      const bookingIdExists = schemaResult.rows.some(row => row.column_name === 'used_in_booking_id');
      
      if (!bookingIdExists) {
        console.log('➕ Adding used_in_booking_id column...');
        await client.query(`
          ALTER TABLE gift_card_usage 
          ADD COLUMN used_in_booking_id uuid;
        `);
        console.log('✅ used_in_booking_id column added!');
      }
      
      // Check if description column exists
      const descriptionExists = schemaResult.rows.some(row => row.column_name === 'description');
      
      if (!descriptionExists) {
        console.log('➕ Adding description column...');
        await client.query(`
          ALTER TABLE gift_card_usage 
          ADD COLUMN description TEXT;
        `);
        console.log('✅ description column added!');
      }
    }
    
    // Final schema check
    console.log('\n🔍 Final gift_card_usage table schema:');
    const finalSchemaResult = await client.query(schemaQuery);
    finalSchemaResult.rows.forEach(row => {
      console.log(`  ✅ ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n🎉 Gift card usage schema fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing gift card usage schema:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixGiftCardUsageSchema();