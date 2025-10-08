const { Client } = require('pg');

async function fixRecurringExceptionSchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'reservista-dev.c9h7bjjxvlgl.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'reservista_dev',
    username: 'reservista_admin',
    password: 'Reservista2024!',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if the table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'recurring_booking_exceptions'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('Creating recurring_booking_exceptions table...');
      await client.query(`
        CREATE TABLE recurring_booking_exceptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          exception_date DATE NOT NULL,
          exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
          new_date DATE,
          new_time TIME,
          reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          recurring_booking_id UUID NOT NULL REFERENCES recurring_bookings(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Table created successfully');
    } else {
      console.log('Table exists, checking columns...');
      
      // Check current columns
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'recurring_booking_exceptions'
        ORDER BY ordinal_position
      `);
      
      console.log('Current columns:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });

      // Check if exceptionDate column exists
      const hasExceptionDate = columns.rows.some(col => col.column_name === 'exceptionDate');
      const hasExceptionDateSnake = columns.rows.some(col => col.column_name === 'exception_date');

      if (!hasExceptionDate && !hasExceptionDateSnake) {
        console.log('Adding exception_date column...');
        await client.query(`
          ALTER TABLE recurring_booking_exceptions 
          ADD COLUMN exception_date DATE NOT NULL DEFAULT CURRENT_DATE
        `);
        console.log('✅ Column added');
      } else if (hasExceptionDate && !hasExceptionDateSnake) {
        console.log('Renaming exceptionDate to exception_date...');
        await client.query(`
          ALTER TABLE recurring_booking_exceptions 
          RENAME COLUMN "exceptionDate" TO exception_date
        `);
        console.log('✅ Column renamed');
      } else {
        console.log('✅ exception_date column already exists');
      }
    }

    // Check if recurring_bookings table exists
    const recurringTableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'recurring_bookings'
    `);

    if (recurringTableCheck.rows.length === 0) {
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
          customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
          service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE
        )
      `);
      
      // Create indexes
      await client.query(`
        CREATE INDEX idx_recurring_bookings_customer ON recurring_bookings(customer_id);
        CREATE INDEX idx_recurring_bookings_provider ON recurring_bookings(provider_id);
        CREATE INDEX idx_recurring_bookings_service ON recurring_bookings(service_id);
        CREATE INDEX idx_recurring_bookings_status ON recurring_bookings(status);
        CREATE INDEX idx_recurring_bookings_next_date ON recurring_bookings(next_booking_date);
      `);
      
      console.log('✅ recurring_bookings table created successfully');
    } else {
      console.log('✅ recurring_bookings table already exists');
    }

    console.log('Schema fix completed successfully!');

  } catch (error) {
    console.error('Error fixing schema:', error.message);
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
  } finally {
    await client.end();
  }
}

fixRecurringExceptionSchema().catch(console.error);