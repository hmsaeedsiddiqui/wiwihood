const { Client } = require('pg');
require('dotenv').config();

async function checkRecurringBookingsSchema() {
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

    // Check recurring_bookings table columns
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'recurring_bookings' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Recurring bookings table columns:');
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('❌ Table "recurring_bookings" does not exist');
    }

    // Check for time-related columns
    const timeColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'recurring_bookings' 
      AND column_name LIKE '%time%'
    `);

    console.log('\n🕒 Time-related columns:');
    if (timeColumns.rows.length > 0) {
      timeColumns.rows.forEach(row => {
        console.log(`Found: ${row.column_name}`);
      });
    } else {
      console.log('No time-related columns found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRecurringBookingsSchema();