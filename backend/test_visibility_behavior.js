const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testServiceVisibilityRules() {
  try {
    console.log('🔍 Testing Service Visibility Rules');
    console.log('='.repeat(50));
    
    // Test 1: Get all services (should return all approved + active services)
    console.log('📋 Test 1: GET /services (all approved + active services)');
    try {
      const allServicesResponse = await axios.get(`${API_BASE_URL}/services`);
      const allServices = allServicesResponse.data;
      console.log(`   ✅ Found ${allServices.length} services`);
      
      allServices.forEach((service, index) => {
        console.log(`   ${index + 1}. "${service.name.substring(0, 30)}..." - Badge: ${service.adminAssignedBadge || 'none'}`);
      });
    } catch (error) {
      console.log('   ❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Test 2: Get services by badge type (should only return services with that specific badge)
    console.log('\n🏷️ Test 2: GET /services?type=popular (only services with Popular badge)');
    try {
      const popularResponse = await axios.get(`${API_BASE_URL}/services?type=popular`);
      const popularServices = popularResponse.data;
      console.log(`   ✅ Found ${popularServices.length} services with 'Popular' badge`);
      
      popularServices.forEach((service, index) => {
        console.log(`   ${index + 1}. "${service.name.substring(0, 30)}..." - Badge: ${service.adminAssignedBadge}`);
      });
    } catch (error) {
      console.log('   ❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    console.log('\n📊 Expected Behavior:');
    console.log('✅ All services query should return ALL approved + active services');
    console.log('✅ Badge type queries should return ONLY services with that specific badge');
    console.log('✅ Category queries should return ALL approved + active services in that category (with or without badges)');
    console.log('✅ Services without badges should appear in category listings but NOT in badge sections');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testServiceVisibilityRules();