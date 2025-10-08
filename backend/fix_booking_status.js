// Fix Database Status Values
const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: 'database-1.clu7ue5qlbfn.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'reservista',
  password: 'Reservista12345',
  ssl: {
    rejectUnauthorized: false
  }
};

async function fixBookingStatusValues() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database successfully\n');

    // Check current invalid status values
    console.log('=== CHECKING INVALID STATUS VALUES ===');
    const invalidStatuses = await client.query(`
      SELECT id, status, customer_id, provider_id, start_date_time 
      FROM bookings 
      WHERE status NOT IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')
      LIMIT 10
    `);

    if (invalidStatuses.rows.length > 0) {
      console.log('Found invalid status values:');
      invalidStatuses.rows.forEach(row => {
        console.log(`ID: ${row.id}, Status: "${row.status}", Date: ${row.start_date_time}`);
      });

      // Fix numeric status values
      console.log('\n=== FIXING STATUS VALUES ===');
      
      // Update numeric "5" to "pending" (or appropriate status)
      const updateResult = await client.query(`
        UPDATE bookings 
        SET status = 'pending' 
        WHERE status ~ '^[0-9]+$'
        RETURNING id, status
      `);

      console.log(`Fixed ${updateResult.rowCount} rows with numeric status values`);
      
      if (updateResult.rows.length > 0) {
        console.log('Updated booking IDs:');
        updateResult.rows.forEach(row => {
          console.log(`- ${row.id}: status = "${row.status}"`);
        });
      }
    } else {
      console.log('No invalid status values found! ✅');
    }

    // Show current status distribution
    console.log('\n=== CURRENT STATUS DISTRIBUTION ===');
    const statusCount = await client.query(`
      SELECT status, COUNT(*) as count 
      FROM bookings 
      GROUP BY status 
      ORDER BY count DESC
    `);

    statusCount.rows.forEach(row => {
      console.log(`${row.status}: ${row.count} bookings`);
    });

    console.log('\n✅ Database status values check completed!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

fixBookingStatusValues();