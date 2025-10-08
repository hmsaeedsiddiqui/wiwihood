const { Pool } = require('pg');

async function fixDatabaseSchema() {
  const pool = new Pool({
    user: 'postgres',
    host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'eYKpRl8juRsTqeUPp3bg',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔧 Starting database schema fix...');
    
    // 1. Add staffId column to bookings table (camelCase to match TypeORM entity)
    try {
      await pool.query(`
        ALTER TABLE bookings ADD COLUMN "staffId" UUID NULL;
      `);
      console.log('✅ Added staffId column to bookings table');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ staffId column already exists in bookings table');
      } else {
        console.error('❌ Error adding staffId column:', error.message);
      }
    }

    // 2. Copy data from staff_id to staffId if both columns exist
    try {
      await pool.query(`
        UPDATE bookings SET "staffId" = staff_id WHERE staff_id IS NOT NULL;
      `);
      console.log('✅ Copied data from staff_id to staffId');
    } catch (error) {
      console.log('⚠️ Could not copy staff_id data:', error.message);
    }

    // 3. Add payout_method column to providers table
    try {
      await pool.query(`
        ALTER TABLE providers ADD COLUMN payout_method VARCHAR(50) DEFAULT 'bank_transfer';
      `);
      console.log('✅ Added payout_method column to providers table');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ payout_method column already exists in providers table');
      } else {
        console.error('❌ Error adding payout_method column:', error.message);
      }
    }

    // 4. Add bank_account_details column to providers table
    try {
      await pool.query(`
        ALTER TABLE providers ADD COLUMN bank_account_details JSONB NULL;
      `);
      console.log('✅ Added bank_account_details column to providers table');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ bank_account_details column already exists in providers table');
      } else {
        console.error('❌ Error adding bank_account_details column:', error.message);
      }
    }

    // 5. Create foreign key constraint for staffId if staff table exists
    try {
      const staffTableExists = await pool.query(`
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'staff' AND table_schema = 'public';
      `);
      
      if (staffTableExists.rows.length > 0) {
        await pool.query(`
          ALTER TABLE bookings 
          ADD CONSTRAINT "FK_bookings_staffId" 
          FOREIGN KEY ("staffId") 
          REFERENCES staff(id) 
          ON DELETE SET NULL;
        `);
        console.log('✅ Added foreign key constraint for staffId');
      } else {
        console.log('⚠️ Staff table does not exist, skipping foreign key constraint');
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ Foreign key constraint already exists');
      } else {
        console.error('❌ Error adding foreign key constraint:', error.message);
      }
    }

    // 6. Create indexes
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS "IDX_bookings_staffId" ON bookings("staffId");`);
      console.log('✅ Created index for staffId');
    } catch (error) {
      console.log('⚠️ Could not create staffId index:', error.message);
    }

    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS "IDX_providers_payout_method" ON providers(payout_method);`);
      console.log('✅ Created index for payout_method');
    } catch (error) {
      console.log('⚠️ Could not create payout_method index:', error.message);
    }

    // 7. Verify the changes
    console.log('\n📊 Verifying database schema...');
    
    const bookingColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('staffId', 'staff_id', 'customerId', 'providerId', 'serviceId')
      AND table_schema = 'public'
      ORDER BY column_name;
    `);
    
    console.log('Booking columns:');
    console.table(bookingColumns.rows);

    const providerColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      AND column_name IN ('payout_method', 'bank_account_details', 'userId')
      AND table_schema = 'public'
      ORDER BY column_name;
    `);
    
    console.log('Provider columns:');
    console.table(providerColumns.rows);
    
    console.log('\n✅ Database schema fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixDatabaseSchema();