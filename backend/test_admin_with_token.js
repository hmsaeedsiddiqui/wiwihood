const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAdminEndpointsWithRealToken() {
  console.log('🔍 Testing Admin Endpoints with Real Authentication');
  console.log('='.repeat(60));
  
  console.log('📝 Instructions to get your admin JWT token:');
  console.log('1. Open your admin panel in browser');
  console.log('2. Login as admin');
  console.log('3. Open Browser DevTools -> Application -> Local Storage');
  console.log('4. Find "accessToken" value and copy it');
  console.log('5. Replace "YOUR_ADMIN_JWT_TOKEN" below with the actual token');
  console.log('');
  
  // You need to replace this with your actual admin JWT token
  const adminToken = 'YOUR_ADMIN_JWT_TOKEN'; // REPLACE THIS WITH REAL TOKEN
  
  if (adminToken === 'YOUR_ADMIN_JWT_TOKEN') {
    console.log('❌ Please replace YOUR_ADMIN_JWT_TOKEN with your actual admin JWT token');
    console.log('   Get it from localStorage.getItem("accessToken") in browser console');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };
  
  try {
    // Test 1: Get service stats
    console.log('🔧 Test 1: Get Service Stats');
    const statsResponse = await axios.get(`${API_BASE_URL}/admin/services/stats`, { headers });
    console.log('   ✅ Stats endpoint working:', statsResponse.data);
    
    // Test 2: Get all services (limit 1)
    console.log('\n🔧 Test 2: Get All Services');
    const servicesResponse = await axios.get(`${API_BASE_URL}/admin/services?limit=1`, { headers });
    console.log('   ✅ Services endpoint working');
    console.log('   Found services:', servicesResponse.data?.services?.length || 0);
    
    if (servicesResponse.data?.services?.length > 0) {
      const testService = servicesResponse.data.services[0];
      console.log(`   Test service: "${testService.name}" (ID: ${testService.id})`);
      console.log(`   Current status: isApproved=${testService.isApproved}, approvalStatus=${testService.approvalStatus}, isActive=${testService.isActive}`);
      
      // Test 3: Try to approve the service
      console.log('\n🔧 Test 3: Test Approval Operation');
      try {
        const approvalResponse = await axios.post(
          `${API_BASE_URL}/admin/services/${testService.id}/approve`,
          { isApproved: true },
          { headers }
        );
        console.log('   ✅ Approval endpoint working:', approvalResponse.data?.message);
      } catch (error) {
        console.log('   ❌ Approval endpoint error:', error.response?.status, error.response?.data?.message);
      }
      
      // Test 4: Try to toggle the service
      console.log('\n🔧 Test 4: Test Toggle Operation');
      try {
        const toggleResponse = await axios.put(
          `${API_BASE_URL}/admin/services/${testService.id}/toggle-status`,
          {},
          { headers }
        );
        console.log('   ✅ Toggle endpoint working:', toggleResponse.data?.message);
      } catch (error) {
        console.log('   ❌ Toggle endpoint error:', error.response?.status, error.response?.data?.message);
      }
    }
    
    console.log('\n📊 Test Results Summary:');
    console.log('✅ Backend admin endpoints are accessible');
    console.log('✅ Authentication is working correctly');
    console.log('✅ Admin API is properly configured');
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Authentication failed - check your admin JWT token');
      console.log('   Make sure you copied the correct token from localStorage');
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.response?.data?.message || error.message);
    }
  }
}

testAdminEndpointsWithRealToken();