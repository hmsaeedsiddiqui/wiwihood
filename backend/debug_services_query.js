const { Pool } = require('pg');

async function debugServicesQuery() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'wiwihood_db',
  });

  try {
    console.log('=== RAW DATABASE QUERY ===');
    
    // Check what the raw database contains
    const rawResult = await pool.query(`
      SELECT 
        id, name, "isActive", "isApproved", status, "approvalStatus",
        "providerId", "categoryId", "createdAt"
      FROM services 
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Total services in DB: ${rawResult.rows.length}`);
    rawResult.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.name}:`);
      console.log(`   isActive: ${row.isActive}`);
      console.log(`   isApproved: ${row.isApproved}`);
      console.log(`   status: ${row.status}`);
      console.log(`   approvalStatus: ${row.approvalStatus}`);
      console.log(`   providerId: ${row.providerId}`);
      console.log(`   categoryId: ${row.categoryId}`);
      console.log('');
    });

    console.log('=== FILTERED QUERY (isActive=true AND isApproved=true) ===');
    const filteredResult = await pool.query(`
      SELECT 
        id, name, "isActive", "isApproved", status, "approvalStatus"
      FROM services 
      WHERE "isActive" = true AND "isApproved" = true
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Filtered services count: ${filteredResult.rows.length}`);
    filteredResult.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.name} - Active: ${row.isActive}, Approved: ${row.isApproved}`);
    });

    console.log('=== JOIN QUERY (with provider and category) ===');
    const joinResult = await pool.query(`
      SELECT 
        s.id, s.name, s."isActive", s."isApproved", s.status, s."approvalStatus",
        p.id as provider_id, p."businessName",
        c.id as category_id, c.name as category_name
      FROM services s
      LEFT JOIN providers p ON s."providerId" = p.id
      LEFT JOIN categories c ON s."categoryId" = c.id
      WHERE s."isActive" = true AND s."isApproved" = true
      ORDER BY s."createdAt" DESC
    `);
    
    console.log(`Join query services count: ${joinResult.rows.length}`);
    joinResult.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.name}`);
      console.log(`   Provider: ${row.provider_id} (${row.businessName})`);
      console.log(`   Category: ${row.category_id} (${row.category_name})`);
      console.log('');
    });

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
}

debugServicesQuery();