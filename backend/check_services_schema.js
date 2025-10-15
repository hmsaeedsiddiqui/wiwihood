const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood',
  user: 'postgres',
  password: 'admin',
});

async function checkServicesSchema() {
  try {
    await client.connect();
    
    // Get services table schema
    const servicesSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'services'
      ORDER BY ordinal_position;
    `);
    
    console.log('=== SERVICES TABLE SCHEMA ===');
    servicesSchema.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : '(NULL)'} ${row.column_default ? 'DEFAULT: ' + row.column_default : ''}`);
    });

    // Also check if there are any sample services
    const sampleServices = await client.query('SELECT * FROM services LIMIT 3');
    console.log('\n=== SAMPLE SERVICES DATA ===');
    console.log('Total services count:', sampleServices.rowCount);
    if (sampleServices.rows.length > 0) {
      console.log('Sample service:', JSON.stringify(sampleServices.rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkServicesSchema();