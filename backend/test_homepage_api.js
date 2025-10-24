const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function testHomepageAPI() {
  try {
    console.log('=== TESTING FRONTEND API CALLS ===');
    
    // Test the API endpoint that the frontend is calling
    console.log('\n1. Testing GET /api/services (what frontend calls)...');
    try {
      const response = await axios.get('http://localhost:3000/api/services');
      console.log(`✅ API Response: ${response.data.length} services returned`);
      
      // Check each service
      response.data.forEach((service, index) => {
        const isVisible = service.isApproved === true && service.isActive === true && service.status === 'approved';
        console.log(`${index + 1}. ${service.name}`);
        console.log(`   - isApproved: ${service.isApproved}`);
        console.log(`   - isActive: ${service.isActive}`);
        console.log(`   - status: ${service.status}`);
        console.log(`   - SHOULD BE VISIBLE: ${isVisible ? 'YES' : 'NO'}`);
      });
    } catch (apiError) {
      console.log(`❌ API Error: ${apiError.message}`);
      if (apiError.response) {
        console.log(`Status: ${apiError.response.status}`);
      }
    }
    
    console.log('\n2. Checking what services SHOULD be visible...');
    const shouldBeVisible = await pool.query(`
      SELECT name, "isActive", "isApproved", status, "adminAssignedBadge"
      FROM services 
      WHERE "isApproved" = true AND "isActive" = true AND status = 'approved'
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`Database says ${shouldBeVisible.rows.length} services should be visible:`);
    shouldBeVisible.rows.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (badge: ${service.adminAssignedBadge || 'none'})`);
    });
    
    console.log('\n3. Checking what the API endpoint is actually filtering...');
    console.log('The issue might be in the backend services controller not enforcing visibility rules.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testHomepageAPI();