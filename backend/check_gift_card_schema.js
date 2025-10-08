const { Pool } = require('pg');
require('dotenv').config();

async function checkGiftCardSchema() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔍 Checking gift_cards table schema...');
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'gift_cards'
      );
    `);
    
    console.log('📋 Table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Get column information
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'gift_cards'
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📝 Current columns in gift_cards table:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}${col.is_nullable === 'YES' ? ', nullable' : ''})`);
      });
      
      // Check for specific columns that TypeORM expects
      const expectedColumns = ['original_amount', 'current_balance', 'purchaser_id', 'recipient_id'];
      console.log('\n🎯 Checking for expected columns:');
      
      expectedColumns.forEach(expectedCol => {
        const found = columns.rows.find(col => col.column_name === expectedCol);
        console.log(`  - ${expectedCol}: ${found ? '✅ EXISTS' : '❌ MISSING'}`);
      });
      
      // Check for old column names that might need renaming
      const oldColumns = ['amount', 'balance', 'current_owner_id'];
      console.log('\n🔄 Checking for old column names that need renaming:');
      
      oldColumns.forEach(oldCol => {
        const found = columns.rows.find(col => col.column_name === oldCol);
        console.log(`  - ${oldCol}: ${found ? '⚠️  NEEDS RENAMING' : '✅ NOT FOUND (good)'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await pool.end();
  }
}

checkGiftCardSchema();