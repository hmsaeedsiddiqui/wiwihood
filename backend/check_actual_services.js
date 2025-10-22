const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood_db',
  user: 'postgres',
  password: 'root'
});

async function checkActualServices() {
  try {
    console.log('=== CHECKING ACTUAL SERVICES IN DATABASE ===\n');
    
    // Total count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM services');
    console.log(`Total services in database: ${totalResult.rows[0].total}\n`);
    
    // Status breakdown
    const statusResult = await pool.query(`
      SELECT 
        status,
        "isActive",
        "isApproved",
        COUNT(*) as count
      FROM services 
      GROUP BY status, "isActive", "isApproved"
      ORDER BY count DESC
    `);
    
    console.log('=== STATUS BREAKDOWN ===');
    statusResult.rows.forEach(row => {
      console.log(`Status: ${row.status || 'NULL'}, Active: ${row.isActive}, Approved: ${row.isApproved}, Count: ${row.count}`);
    });
    
    // Latest services
    const latestResult = await pool.query(`
      SELECT 
        id,
        name,
        status,
        "isActive",
        "isApproved",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `);
    
    console.log('\n=== LATEST 10 SERVICES ===');
    latestResult.rows.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (ID: ${service.id})`);
      console.log(`   Status: ${service.status || 'NULL'}, Active: ${service.isActive}, Approved: ${service.isApproved}`);
      console.log(`   Created: ${service.createdAt}\n`);
    });
    
    await pool.end();
    
  } catch (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }
}

checkActualServices();