const { Client } = require('pg');

async function createRecurringBookingTables() {
  const client = new Client({
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create recurring_bookings table if it doesn't exist
    console.log('Checking recurring_bookings table...');
    const recurringTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_bookings'
      );
    `);

    if (!recurringTableExists.rows[0].exists) {
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
        );
      `);
      
      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_recurring_bookings_customer ON recurring_bookings(customer_id);
        CREATE INDEX IF NOT EXISTS idx_recurring_bookings_provider ON recurring_bookings(provider_id);
        CREATE INDEX IF NOT EXISTS idx_recurring_bookings_service ON recurring_bookings(service_id);
        CREATE INDEX IF NOT EXISTS idx_recurring_bookings_status ON recurring_bookings(status);
        CREATE INDEX IF NOT EXISTS idx_recurring_bookings_next_date ON recurring_bookings(next_booking_date);
      `);
      
      console.log('✅ recurring_bookings table created successfully');
    } else {
      console.log('✅ recurring_bookings table already exists');
    }

    // Create recurring_booking_exceptions table if it doesn't exist  
    console.log('Checking recurring_booking_exceptions table...');
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
          exception_date DATE NOT NULL,
          exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
          new_date DATE,
          new_time TIME,
          reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          recurring_booking_id UUID NOT NULL REFERENCES recurring_bookings(id) ON DELETE CASCADE
        );
      `);
      
      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_recurring_exceptions_booking ON recurring_booking_exceptions(recurring_booking_id);
        CREATE INDEX IF NOT EXISTS idx_recurring_exceptions_date ON recurring_booking_exceptions(exception_date);
      `);
      
      console.log('✅ recurring_booking_exceptions table created successfully');
    } else {
      console.log('✅ recurring_booking_exceptions table already exists');
      
      // Check if all required columns exist
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'recurring_booking_exceptions'
        ORDER BY ordinal_position;
      `);
      
      console.log('Current columns in recurring_booking_exceptions:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
      
      const columnNames = columns.rows.map(col => col.column_name);
      const requiredColumns = ['exception_date', 'exception_type', 'new_date', 'new_time', 'reason', 'recurring_booking_id'];
      
      for (const requiredCol of requiredColumns) {
        if (!columnNames.includes(requiredCol)) {
          console.log(`Adding missing column: ${requiredCol}`);
          
          switch (requiredCol) {
            case 'exception_date':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN exception_date DATE NOT NULL DEFAULT CURRENT_DATE;`);
              break;
            case 'exception_type':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN exception_type VARCHAR(20) NOT NULL DEFAULT 'skip' CHECK (exception_type IN ('skip', 'reschedule', 'cancel'));`);
              break;
            case 'new_date':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN new_date DATE;`);
              break;
            case 'new_time':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN new_time TIME;`);
              break;
            case 'reason':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN reason TEXT;`);
              break;
            case 'recurring_booking_id':
              await client.query(`ALTER TABLE recurring_booking_exceptions ADD COLUMN recurring_booking_id UUID NOT NULL REFERENCES recurring_bookings(id) ON DELETE CASCADE;`);
              break;
          }
          console.log(`✅ Added column: ${requiredCol}`);
        }
      }
    }

    console.log('🎉 All recurring booking tables are ready!');

  } catch (error) {
    console.error('❌ Error setting up tables:', error.message);
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
  } finally {
    await client.end();
  }
}

createRecurringBookingTables().catch(console.error);