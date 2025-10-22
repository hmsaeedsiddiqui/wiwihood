const { Client } = require('pg');

async function approveNewOnVividhoodService() {
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

    // Update the "New on vividhood" service
    const result = await client.query(`
      UPDATE services 
      SET 
        "approvalStatus" = 'approved',
        "isActive" = true,
        "isApproved" = true,
        status = 'approved'
      WHERE "adminAssignedBadge" = 'New on vividhood'
      RETURNING id, name, "isActive", "isApproved", "approvalStatus", status, "adminAssignedBadge"
    `);

    if (result.rows.length > 0) {
      console.log('Updated "New on vividhood" service:');
      result.rows.forEach((service) => {
        console.log(`   Name: ${service.name}`);
        console.log(`   ID: ${service.id}`);
        console.log(`   isActive: ${service.isActive}`);
        console.log(`   isApproved: ${service.isApproved}`);
        console.log(`   approvalStatus: ${service.approvalStatus}`);
        console.log(`   status: ${service.status}`);
        console.log(`   Badge: ${service.adminAssignedBadge}`);
      });
    } else {
      console.log('No "New on vividhood" service found to update');
    }

    // Verify total homepage ready services count
    const countResult = await client.query(`
      SELECT COUNT(*) as count
      FROM services 
      WHERE "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
    `);

    console.log(`\nTotal homepage ready services now: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

approveNewOnVividhoodService();