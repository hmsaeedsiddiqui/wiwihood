const { Client } = require('pg');

async function approveServices() {
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

    // Update services to approved status - make sure all conditions are met
    const result = await client.query(`
      UPDATE services 
      SET 
        "approvalStatus" = 'approved',
        "isActive" = true,
        "isApproved" = true,
        status = 'approved'
      WHERE id IN (
        SELECT id FROM services 
        WHERE "isActive" = true 
        LIMIT 3
      )
      RETURNING id, name, "isActive", "isApproved", "approvalStatus", status
    `);

    console.log('Updated services:');
    result.rows.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   isActive: ${service.isActive}`);
      console.log(`   isApproved: ${service.isApproved}`);
      console.log(`   approvalStatus: ${service.approvalStatus}`);
      console.log(`   status: ${service.status}`);
      console.log('');
    });

    // Verify homepage ready services count
    const countResult = await client.query(`
      SELECT COUNT(*) as count
      FROM services 
      WHERE "isActive" = true 
        AND "isApproved" = true 
        AND "approvalStatus" = 'approved'
    `);

    console.log(`Homepage ready services: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

approveServices();