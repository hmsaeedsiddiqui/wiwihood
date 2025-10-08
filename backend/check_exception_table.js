const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cnqwck6k2gik.eu-north-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'eYKpRl8juRsTqeUPp3bg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkExceptionTable() {
  try {
    console.log('Checking recurring_booking_exceptions table structure...');
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recurring_booking_exceptions'
      );
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'recurring_booking_exceptions' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 Current table structure:');
      structure.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
      });
      
      // Test if we can select from table
      const testSelect = await pool.query('SELECT COUNT(*) FROM recurring_booking_exceptions;');
      console.log(`\n✅ Table is accessible, current record count: ${testSelect.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking table:', error.message);
  } finally {
    await pool.end();
  }
}

checkExceptionTable();