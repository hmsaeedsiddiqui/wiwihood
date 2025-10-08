const { Client } = require('pg');
require('dotenv').config();

async function checkBookingTableSchema() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check all columns in bookings table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Bookings table columns:');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Check if TypeORM is expecting camelCase column name
    const camelCaseCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name IN ('recurring_booking_id', 'recurringBookingId')
    `);

    console.log('\n🔍 Recurring booking column check:');
    if (camelCaseCheck.rows.length > 0) {
      camelCaseCheck.rows.forEach(row => {
        console.log(`Found: ${row.column_name}`);
      });
    } else {
      console.log('No recurring booking column found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkBookingTableSchema();