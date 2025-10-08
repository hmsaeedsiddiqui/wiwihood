const { Client } = require('pg');
require('dotenv').config();

async function createRecurringBookingsTables() {
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

    // Create enum types
    await client.query(`
      DO $$ BEGIN
          CREATE TYPE recurrence_frequency AS ENUM ('weekly', 'biweekly', 'monthly', 'quarterly');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
          CREATE TYPE recurrence_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create recurring_bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS recurring_bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          frequency recurrence_frequency NOT NULL,
          status recurrence_status NOT NULL DEFAULT 'active',
          start_time VARCHAR(5) NOT NULL,
          duration_minutes INTEGER NOT NULL,
          next_booking_date DATE NOT NULL,
          end_date DATE,
          max_bookings INTEGER,
          current_booking_count INTEGER DEFAULT 0,
          special_instructions TEXT,
          auto_confirm BOOLEAN DEFAULT false,
          notification_preferences JSONB,
          skip_dates TEXT[],
          last_booking_created TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          customer_id UUID NOT NULL,
          provider_id UUID NOT NULL,
          service_id UUID NOT NULL,
          
          CONSTRAINT fk_recurring_bookings_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_recurring_bookings_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
          CONSTRAINT fk_recurring_bookings_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      );
    `);

    // Create recurring_booking_exceptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS recurring_booking_exceptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          exception_date DATE NOT NULL,
          reason TEXT,
          is_cancelled BOOLEAN DEFAULT true,
          replacement_date DATE,
          replacement_time VARCHAR(5),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          recurring_booking_id UUID NOT NULL,
          
          CONSTRAINT fk_exceptions_recurring_booking FOREIGN KEY (recurring_booking_id) REFERENCES recurring_bookings(id) ON DELETE CASCADE
      );
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_bookings_customer_id ON recurring_bookings(customer_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_bookings_provider_id ON recurring_bookings(provider_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_bookings_service_id ON recurring_bookings(service_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_bookings_status ON recurring_bookings(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_bookings_next_booking_date ON recurring_bookings(next_booking_date);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_booking_exceptions_recurring_booking_id ON recurring_booking_exceptions(recurring_booking_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_recurring_booking_exceptions_exception_date ON recurring_booking_exceptions(exception_date);`);

    // Create update trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers
    await client.query(`DROP TRIGGER IF EXISTS update_recurring_bookings_updated_at ON recurring_bookings;`);
    await client.query(`
      CREATE TRIGGER update_recurring_bookings_updated_at
          BEFORE UPDATE ON recurring_bookings
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`DROP TRIGGER IF EXISTS update_recurring_booking_exceptions_updated_at ON recurring_booking_exceptions;`);
    await client.query(`
      CREATE TRIGGER update_recurring_booking_exceptions_updated_at
          BEFORE UPDATE ON recurring_booking_exceptions
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Recurring bookings tables created successfully!');
    console.log('✅ All indexes and triggers created!');
    console.log('✅ You can now test the recurring booking APIs.');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createRecurringBookingsTables();