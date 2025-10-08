const { DataSource } = require('typeorm');
const { RecurringBooking, RecurringBookingException } = require('./dist/entities/recurring-booking.entity');

async function createRecurringBookingTables() {
  // Create DataSource with same config as the app
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    entities: [RecurringBooking, RecurringBookingException],
    synchronize: false,
    logging: true
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Create tables using TypeORM's synchronize functionality
    console.log('Creating tables...');
    
    // Check if tables exist
    const recurringBookingsTable = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_bookings'
      );
    `);

    const recurringExceptionsTable = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_booking_exceptions'
      );
    `);

    console.log('Recurring bookings table exists:', recurringBookingsTable[0].exists);
    console.log('Recurring exceptions table exists:', recurringExceptionsTable[0].exists);

    if (!recurringBookingsTable[0].exists) {
      console.log('Creating recurring_bookings table...');
      await dataSource.query(`
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
    }

    if (!recurringExceptionsTable[0].exists) {
      console.log('Creating recurring_booking_exceptions table...');
      await dataSource.query(`
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

      // Add indexes
      await dataSource.query(`
        CREATE INDEX idx_recurring_exceptions_booking_id ON recurring_booking_exceptions(recurring_booking_id);
      `);
      
      await dataSource.query(`
        CREATE INDEX idx_recurring_exceptions_date ON recurring_booking_exceptions(exception_date);
      `);
      
      console.log('✅ Created indexes');
    }

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error('Full error:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

createRecurringBookingTables();