const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function createRecurringBookingExceptionsTable() {
  try {
    console.log('Creating recurring_booking_exceptions table...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "recurring_booking_exceptions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "exception_date" DATE NOT NULL,
        "exception_type" varchar(20) NOT NULL CHECK (exception_type IN ('skip', 'reschedule', 'cancel')),
        "new_date" DATE,
        "new_time" TIME,
        "reason" varchar(500),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "recurring_booking_id" uuid NOT NULL,
        CONSTRAINT "FK_recurring_booking_exceptions_recurring_booking" 
          FOREIGN KEY ("recurring_booking_id") 
          REFERENCES "recurring_bookings"("id") 
          ON DELETE CASCADE
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Table recurring_booking_exceptions created successfully');
    
    // Create index for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_exceptions_recurring_booking_id" ON "recurring_booking_exceptions" ("recurring_booking_id");');
    console.log('✅ Index created successfully');
    
    // Check if table exists and show structure
    const checkResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'recurring_booking_exceptions' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Table structure:');
    checkResult.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  } finally {
    await pool.end();
  }
}

createRecurringBookingExceptionsTable();