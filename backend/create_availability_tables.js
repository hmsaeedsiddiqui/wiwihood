const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'wiwihood_db',
});

async function createAvailabilityTables() {
  const client = await pool.connect();
  
  try {
    console.log('Creating availability tables...');
    
    // Create provider_blocked_time table
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_blocked_time (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider_id UUID NOT NULL,
        title VARCHAR(255),
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        is_all_day BOOLEAN DEFAULT false,
        blocked_type VARCHAR(50) DEFAULT 'manual',
        is_recurring BOOLEAN DEFAULT false,
        recurring_pattern VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ provider_blocked_time table created');

    // Create provider_time_slot table  
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_time_slot (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider_id UUID NOT NULL,
        service_id UUID,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duration INTEGER DEFAULT 30,
        status VARCHAR(50) DEFAULT 'available',
        is_booked BOOLEAN DEFAULT false,
        booking_id UUID,
        custom_price DECIMAL(10,2),
        buffer_time INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ provider_time_slot table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_provider_id ON provider_blocked_time(provider_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_date_range ON provider_blocked_time(start_date, end_date);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_blocked_time_active ON provider_blocked_time(is_active);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_time_slot_provider_id ON provider_time_slot(provider_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_time_slot_date ON provider_time_slot(date);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_time_slot_status ON provider_time_slot(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_time_slot_booked ON provider_time_slot(is_booked);
    `);
    console.log('✅ Indexes created');

    // Check if tables were created successfully
    const blockedTimeCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'provider_blocked_time';
    `);
    
    const timeSlotsCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'provider_time_slot';
    `);

    console.log('Table verification:');
    console.log('- provider_blocked_time exists:', blockedTimeCheck.rows.length > 0);
    console.log('- provider_time_slot exists:', timeSlotsCheck.rows.length > 0);

    console.log('🎉 Availability tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating availability tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
createAvailabilityTables();