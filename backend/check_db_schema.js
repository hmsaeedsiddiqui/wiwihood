console.log('🔍 Checking database schema for services table...');

const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'wiwihood_db',
});

async function checkSchema() {
  try {
    // Get table schema
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Services table schema:');
    schemaResult.rows.forEach(row => {
      console.log(`   ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Get sample data to understand current field values
    const dataResult = await pool.query(`
      SELECT 
        "isActive", "isApproved", 
        status, "approvalStatus",
        "adminAssignedBadge"
      FROM services 
      LIMIT 1
    `);
    
    if (dataResult.rows.length > 0) {
      console.log('\n📋 Sample service data:');
      Object.keys(dataResult.rows[0]).forEach(key => {
        console.log(`   ${key}: ${dataResult.rows[0][key]}`);
      });
    }

    // Check if there are any inconsistencies
    const inconsistencyResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN "isActive" = true AND "isApproved" = true AND status = 'approved' THEN 1 END) as consistent_approved,
        COUNT(CASE WHEN "isActive" = false OR "isApproved" = false OR status != 'approved' THEN 1 END) as not_visible
      FROM services
    `);

    console.log('\n📈 Visibility status analysis:');
    const stats = inconsistencyResult.rows[0];
    console.log(`   Total services: ${stats.total}`);
    console.log(`   Properly visible (active + approved): ${stats.consistent_approved}`);
    console.log(`   Not visible: ${stats.not_visible}`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();