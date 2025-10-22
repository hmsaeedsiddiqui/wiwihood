const { Client } = require('pg');

async function checkServicesStatus() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'wiwihood_db',
    user: 'postgres',
    password: 'root'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check all services with their status
    const result = await client.query(`
      SELECT 
        id, 
        name, 
        "isActive", 
        "isApproved", 
        "approvalStatus",
        status,
        "adminAssignedBadge",
        "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);

    console.log('\n=== ALL SERVICES ===');
    console.log(`Total services: ${result.rows.length}`);
    
    if (result.rows.length === 0) {
      console.log('No services found in database!');
      return;
    }

    result.rows.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.name}`);
      console.log(`   ID: ${service.id}`);
      console.log(`   isActive: ${service.isActive}`);
      console.log(`   isApproved: ${service.isApproved}`);
      console.log(`   approvalStatus: ${service.approvalStatus}`);
      console.log(`   status: ${service.status}`);
      console.log(`   Badge: ${service.adminAssignedBadge || 'None'}`);
      console.log(`   Created: ${service.createdAt}`);
    });

    // Check homepage-ready services
    const homepageResult = await client.query(`
      SELECT COUNT(*) as count
      FROM services 
      WHERE "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
    `);

    console.log(`\n=== HOMEPAGE READY SERVICES ===`);
    console.log(`Count: ${homepageResult.rows[0].count}`);

    // Check by individual criteria
    const activeCount = await client.query(`SELECT COUNT(*) as count FROM services WHERE "isActive" = true`);
    const approvedCount = await client.query(`SELECT COUNT(*) as count FROM services WHERE "isApproved" = true`);
    const statusApprovedCount = await client.query(`SELECT COUNT(*) as count FROM services WHERE "approvalStatus" = 'approved'`);

    console.log(`\n=== BREAKDOWN ===`);
    console.log(`Active (isActive=true): ${activeCount.rows[0].count}`);
    console.log(`Approved (isApproved=true): ${approvedCount.rows[0].count}`);
    console.log(`Status approved (approvalStatus='approved'): ${statusApprovedCount.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkServicesStatus();