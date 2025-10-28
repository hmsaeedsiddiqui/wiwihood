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

async function fixAvailabilityTables() {
  const client = await pool.connect();
  
  try {
    console.log('Fixing availability tables with correct names...');
    
    // Drop incorrectly named tables
    console.log('Dropping incorrect tables...');
    await client.query(`DROP TABLE IF EXISTS provider_time_slot CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS provider_blocked_time CASCADE;`);
    
    // Create provider_blocked_times table (plural as per entity)
    console.log('Creating provider_blocked_times table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_blocked_times (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "providerId" UUID NOT NULL,
        "blockDate" DATE NOT NULL,
        "startTime" TIME,
        "endTime" TIME,
        "isAllDay" BOOLEAN DEFAULT false,
        "blockType" VARCHAR(50) DEFAULT 'personal',
        reason VARCHAR(500) NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "isRecurring" BOOLEAN DEFAULT false,
        "recurringPattern" VARCHAR(50),
        "recurringEndDate" DATE,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_provider_blocked_times_provider" FOREIGN KEY ("providerId") REFERENCES providers(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ provider_blocked_times table created');

    // Create provider_time_slots table (plural as per entity)
    console.log('Creating provider_time_slots table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_time_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "providerId" UUID NOT NULL,
        "serviceId" UUID,
        "slotDate" DATE NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "durationMinutes" INTEGER DEFAULT 30,
        status VARCHAR(50) DEFAULT 'available',
        "maxBookings" INTEGER DEFAULT 1,
        "currentBookings" INTEGER DEFAULT 0,
        "bufferTimeMinutes" INTEGER DEFAULT 0,
        "isManuallyCreated" BOOLEAN DEFAULT false,
        "isBreakSlot" BOOLEAN DEFAULT false,
        "customPrice" DECIMAL(10,2),
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_provider_time_slots_provider" FOREIGN KEY ("providerId") REFERENCES providers(id) ON DELETE CASCADE,
        CONSTRAINT "FK_provider_time_slots_service" FOREIGN KEY ("serviceId") REFERENCES services(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ provider_time_slots table created');

    // Create indexes for better performance
    console.log('Creating indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_blocked_times_providerId" ON provider_blocked_times("providerId");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_blocked_times_blockDate" ON provider_blocked_times("blockDate");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_blocked_times_isActive" ON provider_blocked_times("isActive");`);
    
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_time_slots_providerId" ON provider_time_slots("providerId");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_time_slots_slotDate" ON provider_time_slots("slotDate");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_time_slots_startTime" ON provider_time_slots("startTime");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_time_slots_status" ON provider_time_slots(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_provider_time_slots_serviceId" ON provider_time_slots("serviceId");`);
    console.log('✅ Indexes created');

    // Check if tables were created successfully
    const blockedTimeCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'provider_blocked_times';
    `);
    
    const timeSlotsCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'provider_time_slots';
    `);

    console.log('Table verification:');
    console.log('- provider_blocked_times exists:', blockedTimeCheck.rows.length > 0);
    console.log('- provider_time_slots exists:', timeSlotsCheck.rows.length > 0);

    // Check table columns to make sure they match entity definitions
    console.log('\nVerifying table structure...');
    const blockedTimesColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'provider_blocked_times' 
      ORDER BY ordinal_position;
    `);
    
    const timeSlotsColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'provider_time_slots' 
      ORDER BY ordinal_position;
    `);

    console.log('\nprovider_blocked_times columns:');
    blockedTimesColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\nprovider_time_slots columns:');
    timeSlotsColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n🎉 Availability tables fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing availability tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
fixAvailabilityTables();