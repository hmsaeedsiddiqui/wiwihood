const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function updateExceptionTableSchema() {
  try {
    console.log('Updating recurring_booking_exceptions table schema...');
    
    // Drop the old table completely and recreate with correct schema
    await pool.query('DROP TABLE IF EXISTS "recurring_booking_exceptions" CASCADE;');
    console.log('✅ Dropped old table');
    
    // Create new table with correct schema matching the entity
    const createTableQuery = `
      CREATE TABLE "recurring_booking_exceptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "exception_date" DATE NOT NULL,
        "exception_type" varchar(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
        "new_date" DATE,
        "new_time" TIME,
        "reason" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "recurring_booking_id" uuid NOT NULL,
        CONSTRAINT "FK_recurring_booking_exceptions_recurring_booking" 
          FOREIGN KEY ("recurring_booking_id") 
          REFERENCES "recurring_bookings"("id") 
          ON DELETE CASCADE
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Created new table with correct schema');
    
    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_exceptions_recurring_booking_id" ON "recurring_booking_exceptions" ("recurring_booking_id");');
    await pool.query('CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_exceptions_exception_date" ON "recurring_booking_exceptions" ("exception_date");');
    console.log('✅ Created indexes');
    
    // Check final table structure
    const checkResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'recurring_booking_exceptions' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Final table structure:');
    checkResult.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating table:', error.message);
  } finally {
    await pool.end();
  }
}

updateExceptionTableSchema();