const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'wiwihood_db',
  user: 'postgres',
  password: 'root'
});

async function activateAllServices() {
  try {
    console.log('=== ACTIVATING ALL SERVICES ===\n');
    
    // Set all services to active
    const result = await pool.query(`
      UPDATE services 
      SET "isActive" = true, "updatedAt" = NOW()
      WHERE "isApproved" = true
      RETURNING id, name, "adminAssignedBadge", "isActive", "isApproved"
    `);
    
    console.log(`Updated ${result.rows.length} services to active:\n`);
    result.rows.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   Badge: "${service.adminAssignedBadge}"`);
      console.log(`   Active: ${service.isActive}, Approved: ${service.isApproved}\n`);
    });
    
    await pool.end();
    console.log('✅ All services are now active!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

activateAllServices();