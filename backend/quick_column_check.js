const { Pool } = require('pg');
require('dotenv').config();

async function quickColumnCheck() {
  const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const serviceColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Services table columns:');
    serviceColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}`);
    });

    const bookingColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📅 Bookings table columns:');
    bookingColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

quickColumnCheck();