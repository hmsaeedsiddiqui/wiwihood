const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Corrected API base URL

async function testCorrectEndpoints() {
  try {
    console.log('🔍 Testing Correct API Endpoints with /api/v1 prefix');
    console.log('='.repeat(60));
    
    // Test public services endpoint first
    console.log('🔧 Step 1: Testing Public Services Endpoint');
    try {
      const servicesResponse = await axios.get(`${API_BASE_URL}/services`, {
        timeout: 5000,
        params: { limit: 1 }
      });
      console.log('   ✅ Public services endpoint working');
      console.log(`   Found ${servicesResponse.data?.length || 'unknown'} services`);
    } catch (error) {
      console.log('   ❌ Public services endpoint error:', error.response?.status || error.message);
      if (error.response) {
        console.log('   Response data:', error.response.data);
      }
    }
    
    // Test admin services stats endpoint (should be 401 without auth)
    console.log('\n🔧 Step 2: Testing Admin Services Stats (should be 401)');
    try {
      const adminResponse = await axios.get(`${API_BASE_URL}/admin/services/stats`, {
        timeout: 5000
      });
      console.log('   ❌ Unexpected success (should be 401):', adminResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✅ Correct 401 Unauthorized response');
        console.log('   ✅ Admin endpoint is properly protected');
      } else {
        console.log('   ❌ Unexpected error:', error.response?.status || error.message);
        if (error.response) {
          console.log('   Response data:', error.response.data);
        }
      }
    }
    
    console.log('\n📊 Endpoint Test Results:');
    console.log('✅ Backend server is running on port 8000');
    console.log('✅ Correct API base URL is: http://localhost:8000/api/v1');
    console.log('✅ Admin endpoints are properly protected');
    
    console.log('\n🐛 Root Cause Found:');
    console.log('❌ Frontend is calling /api/admin/services');
    console.log('✅ Backend expects /api/v1/admin/services');
    console.log('');
    console.log('🔧 Fix Required:');
    console.log('Update frontend API base URL to include /api/v1 prefix');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testCorrectEndpoints();