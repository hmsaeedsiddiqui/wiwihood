const { Client } = require('pg');

async function createTables() {
  // Use the exact same connection details the app would use
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Check if recurring_bookings table exists
    console.log('Checking if recurring_bookings table exists...');
    const bookingsTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_bookings'
      );
    `);

    if (!bookingsTableExists.rows[0].exists) {
      console.log('Creating recurring_bookings table...');
      await client.query(`
        CREATE TABLE recurring_bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
          status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
          start_time VARCHAR(5) NOT NULL,
          duration_minutes INTEGER NOT NULL,
          next_booking_date DATE NOT NULL,
          end_date DATE,
          max_bookings INTEGER,
          current_booking_count INTEGER DEFAULT 0,
          special_instructions TEXT,
          auto_confirm BOOLEAN DEFAULT true,
          notification_preferences JSONB,
          skip_dates JSON,
          last_booking_created TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          customer_id UUID NOT NULL,
          provider_id UUID NOT NULL,
          service_id UUID NOT NULL
        );
      `);
      console.log('✅ Created recurring_bookings table');
    } else {
      console.log('recurring_bookings table already exists');
    }

    // Check if recurring_booking_exceptions table exists
    console.log('Checking if recurring_booking_exceptions table exists...');
    const exceptionsTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_booking_exceptions'
      );
    `);

    if (!exceptionsTableExists.rows[0].exists) {
      console.log('Creating recurring_booking_exceptions table...');
      await client.query(`
        CREATE TABLE recurring_booking_exceptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          recurring_booking_id UUID NOT NULL,
          exception_date DATE NOT NULL,
          exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
          new_date DATE,
          new_time VARCHAR(5),
          reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Created recurring_booking_exceptions table');

      // Create indexes
      console.log('Creating indexes...');
      await client.query(`
        CREATE INDEX idx_recurring_exceptions_booking_id ON recurring_booking_exceptions(recurring_booking_id);
      `);
      
      await client.query(`
        CREATE INDEX idx_recurring_exceptions_date ON recurring_booking_exceptions(exception_date);
      `);
      
      console.log('✅ Created indexes');
    } else {
      console.log('recurring_booking_exceptions table already exists');
    }

    console.log('🎉 All tables are ready!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createTables();