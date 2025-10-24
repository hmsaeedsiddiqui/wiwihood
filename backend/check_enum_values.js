const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
  port: 5432,
});

async function checkEnumValues() {
  try {
    // Check service type enum values
    const serviceTypeEnum = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid 
        FROM pg_type 
        WHERE typname = 'services_servicetype_enum'
      );
    `);

    console.log('=== SERVICE TYPE ENUM VALUES ===');
    serviceTypeEnum.rows.forEach(row => {
      console.log(`- ${row.enumlabel}`);
    });

    // Check pricing type enum values
    const pricingTypeEnum = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid 
        FROM pg_type 
        WHERE typname = 'services_pricingtype_enum'
      );
    `);

    console.log('\n=== PRICING TYPE ENUM VALUES ===');
    pricingTypeEnum.rows.forEach(row => {
      console.log(`- ${row.enumlabel}`);
    });

    // Check status enum values
    const statusEnum = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid 
        FROM pg_type 
        WHERE typname = 'services_status_enum'
      );
    `);

    console.log('\n=== STATUS ENUM VALUES ===');
    statusEnum.rows.forEach(row => {
      console.log(`- ${row.enumlabel}`);
    });

  } catch (error) {
    console.error('Error checking enum values:', error);
  } finally {
    await pool.end();
  }
}

checkEnumValues();