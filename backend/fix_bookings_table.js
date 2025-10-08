const { Client } = require('pg');
require('dotenv').config();

async function addRecurringBookingColumn() {
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

    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'recurring_booking_id'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column recurring_booking_id already exists');
      return;
    }

    // Add the missing column
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN "recurring_booking_id" UUID REFERENCES recurring_bookings(id) ON DELETE SET NULL
    `);

    console.log('✅ Added recurring_booking_id column to bookings table');

    // Verify the column was added
    const verifyColumn = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'recurring_booking_id'
    `);

    if (verifyColumn.rows.length > 0) {
      console.log('✅ Column verification successful:', verifyColumn.rows[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

addRecurringBookingColumn();