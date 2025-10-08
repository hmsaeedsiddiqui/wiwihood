const { Client } = require('pg');
require('dotenv').config();

async function getTestUUIDs() {
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

    // Get a provider ID
    const providerResult = await client.query('SELECT id, "businessName" FROM providers LIMIT 1');
    console.log('\n📋 Available Providers:');
    if (providerResult.rows.length > 0) {
      console.log(`Provider ID: ${providerResult.rows[0].id}`);
      console.log(`Business Name: ${providerResult.rows[0].businessName}`);
    } else {
      console.log('No providers found');
    }

    // Get a service ID
    const serviceResult = await client.query('SELECT id, name FROM services LIMIT 1');
    console.log('\n🛠️ Available Services:');
    if (serviceResult.rows.length > 0) {
      console.log(`Service ID: ${serviceResult.rows[0].id}`);
      console.log(`Service Name: ${serviceResult.rows[0].name}`);
    } else {
      console.log('No services found');
    }

    // Get a user ID (for customer)
    const userResult = await client.query('SELECT id, email FROM users LIMIT 1');
    console.log('\n👤 Available Users:');
    if (userResult.rows.length > 0) {
      console.log(`User ID: ${userResult.rows[0].id}`);
      console.log(`Email: ${userResult.rows[0].email}`);
    } else {
      console.log('No users found');
    }

    if (providerResult.rows.length > 0 && serviceResult.rows.length > 0) {
      console.log('\n📝 Sample Request Body for Testing:');
      console.log(JSON.stringify({
        providerId: providerResult.rows[0].id,
        serviceId: serviceResult.rows[0].id,
        frequency: "weekly",
        startTime: "10:30",
        durationMinutes: 60,
        nextBookingDate: "2025-01-15",
        endDate: "2025-12-31",
        maxBookings: 52,
        specialInstructions: "Please use side entrance and ring bell twice",
        autoConfirm: true,
        notificationPreferences: {
          email: true,
          sms: false,
          reminderDaysBefore: [1, 7]
        }
      }, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

getTestUUIDs();