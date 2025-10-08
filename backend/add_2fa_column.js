const { Pool } = require('pg');
require('dotenv').config();

async function add2FAColumn() {
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
    console.log('🔧 Adding 2FA column to users table...');
    
    // Add the column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);
    `);
    
    console.log('✅ Column two_factor_secret added successfully!');
    
    // Verify column exists
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'two_factor_secret';
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verification successful:', result.rows[0]);
    } else {
      console.log('❌ Column not found after creation');
    }
    
    console.log('🎉 2FA database setup complete!');
    
  } catch (error) {
    console.error('❌ Error adding 2FA column:', error.message);
  } finally {
    await pool.end();
  }
}

add2FAColumn();