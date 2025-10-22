const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood_db',
  user: 'postgres',
  password: 'root'
});

async function checkDB() {
  try {
    console.log('🔍 Checking services table schema and data...');
    
    // Check column information
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      AND column_name IN ('isActive', 'isApproved')
      ORDER BY column_name;
    `);
    
    console.log('📋 Column information:');
    columns.rows.forEach(row => console.log(row));
    
    // Check actual data
    const services = await pool.query(`
      SELECT id, name, "isActive", "isApproved", 
             pg_typeof("isActive") as active_type, 
             pg_typeof("isApproved") as approved_type 
      FROM services 
      LIMIT 5
    `);
    
    console.log('\n📦 Sample services data:');
    services.rows.forEach(row => {
      console.log({
        id: row.id.substring(0, 8) + '...',
        name: row.name.substring(0, 25) + '...',
        isActive: row.isActive,
        activeType: row.active_type,
        isApproved: row.isApproved,
        approvedType: row.approved_type
      });
    });
    
    // Count queries
    const activeCount = await pool.query('SELECT COUNT(*) FROM services WHERE "isActive" = true');
    const approvedCount = await pool.query('SELECT COUNT(*) FROM services WHERE "isApproved" = true');
    const bothCount = await pool.query('SELECT COUNT(*) FROM services WHERE "isActive" = true AND "isApproved" = true');
    
    console.log('\n🔢 Counts:');
    console.log('Total services with isActive = true:', activeCount.rows[0].count);
    console.log('Total services with isApproved = true:', approvedCount.rows[0].count);
    console.log('Total services with BOTH true:', bothCount.rows[0].count);
    
    await pool.end();
    console.log('\n✅ Database check completed');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

checkDB();