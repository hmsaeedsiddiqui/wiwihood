const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiwihood_db',
  password: 'root',
  port: 5432,
});

async function testAPIResponse() {
  try {
    console.log('=== TESTING API RESPONSE ===');
    
    // First verify database has services
    const dbServices = await pool.query(`
      SELECT COUNT(*) as count FROM services 
      WHERE "isActive" = true AND "isApproved" = true AND status = 'approved'
    `);
    
    console.log(`✅ Database has ${dbServices.rows[0].count} visible services`);
    
    // Test the API endpoint that frontend calls
    console.log('\n🔍 Testing API endpoint...');
    
    try {
      // Test basic services endpoint
      const response = await axios.get('http://localhost:3000/api/services', {
        timeout: 5000
      });
      
      console.log(`✅ API Response Status: ${response.status}`);
      console.log(`✅ API returned ${response.data.length} services`);
      
      if (response.data.length > 0) {
        console.log('\n📋 Services returned by API:');
        response.data.forEach((service, index) => {
          console.log(`${index + 1}. ${service.name}`);
          console.log(`   - Badge: ${service.adminAssignedBadge || 'none'}`);
          console.log(`   - Price: $${service.basePrice}`);
          console.log(`   - isActive: ${service.isActive}`);
          console.log(`   - isApproved: ${service.isApproved}`);
          console.log('');
        });
        
        console.log('✅ API is working! Frontend should receive this data.');
      } else {
        console.log('❌ API returned empty array despite database having services');
      }
      
    } catch (apiError) {
      console.log('❌ API Error:', apiError.message);
      
      if (apiError.code === 'ECONNREFUSED') {
        console.log('🔧 Backend server is not running!');
        console.log('   Please start the backend server with: npm run start:dev');
      } else if (apiError.code === 'ENOTFOUND') {
        console.log('🔧 API endpoint not found. Check the URL.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    await pool.end();
  }
}

testAPIResponse();