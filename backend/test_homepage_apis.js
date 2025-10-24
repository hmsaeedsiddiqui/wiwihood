const axios = require('axios');

async function testHomepageAPIs() {
  console.log('=== TESTING HOMEPAGE API CALLS ===');
  
  const baseURL = 'http://localhost:8000/api/v1';
  const sections = [
    'new-on-vividhood',
    'popular', 
    'hot-deal',
    'best-seller',
    'limited-time',
    'premium',
    'top-rated'
  ];
  
  try {
    // Test basic services endpoint
    console.log('\n1. Testing basic services endpoint...');
    const allServices = await axios.get(`${baseURL}/services`);
    console.log(`✅ All services: ${allServices.data.length} services found`);
    
    // Test each section
    console.log('\n2. Testing section-based filtering...');
    for (const section of sections) {
      try {
        const response = await axios.get(`${baseURL}/services?type=${section}`);
        console.log(`✅ ${section}: ${response.data.length} services`);
        
        if (response.data.length > 0) {
          const service = response.data[0];
          console.log(`   - Sample: "${service.name}" (badge: ${service.adminAssignedBadge})`);
        }
      } catch (error) {
        console.log(`❌ ${section}: ${error.message}`);
      }
    }
    
    // Test category filtering
    console.log('\n3. Testing category-based filtering...');
    try {
      const categoryResponse = await axios.get(`${baseURL}/services?category=hair`);
      console.log(`✅ Category 'hair': ${categoryResponse.data.length} services`);
    } catch (error) {
      console.log(`❌ Category filtering: ${error.message}`);
    }
    
  } catch (error) {
    console.log('❌ Backend server not running or not responding');
    console.log('Please start the backend server with: npm run start:dev');
    console.log(`Error: ${error.message}`);
  }
}

testHomepageAPIs();