// Test admin login and JWT token generation
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAdminLogin() {
  try {
    console.log('🔍 Testing Admin Login Process');
    console.log('='.repeat(50));
    
    // Step 1: Login as admin
    console.log('🔐 Step 1: Attempting admin login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'abc@gmail.com',
        password: '12345678'
      });
      
      console.log('   ✅ Login successful!');
      console.log('   Response status:', loginResponse.status);
      
      const loginData = loginResponse.data;
      console.log('   Login data:', {
        accessToken: loginData.accessToken ? 'Present' : 'Missing',
        user: loginData.user
      });
      
      if (!loginData.accessToken) {
        console.log('   ❌ No access token received');
        return;
      }
      
      // Step 2: Decode JWT to check contents
      console.log('\n🔍 Step 2: Analyzing JWT Token...');
      const token = loginData.accessToken;
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      console.log('   JWT Payload:', JSON.stringify(payload, null, 2));
      console.log('   User role in JWT:', payload.role);
      console.log('   User ID in JWT:', payload.sub);
      
      // Step 3: Test admin endpoint with token
      console.log('\n🔧 Step 3: Testing admin endpoint with token...');
      try {
        const adminResponse = await axios.get(`${API_BASE_URL}/admin/services/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('   ✅ Admin endpoint successful!');
        console.log('   Response:', adminResponse.data);
        
        // Step 4: Test getting services
        console.log('\n📋 Step 4: Testing get all admin services...');
        const servicesResponse = await axios.get(`${API_BASE_URL}/admin/services?page=1&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('   ✅ Admin services endpoint successful!');
        console.log(`   Found ${servicesResponse.data.services?.length || 0} services`);
        
      } catch (adminError) {
        console.log('   ❌ Admin endpoint failed:', adminError.response?.status, adminError.response?.data?.message || adminError.message);
        
        if (adminError.response?.status === 403) {
          console.log('   🔍 403 Forbidden - This means:');
          console.log('      - JWT token is valid (passed JwtAuthGuard)');
          console.log('      - But user is not authorized as admin (failed AdminGuard)');
          console.log('      - Check if user.role === "admin" in the JWT payload above');
        }
      }
      
    } catch (loginError) {
      console.log('   ❌ Login failed:', loginError.response?.status, loginError.response?.data?.message || loginError.message);
    }
    
    console.log('\n💡 Instructions for frontend:');
    console.log('1. Use these credentials in your admin login form:');
    console.log('   Email: abc@gmail.com');
    console.log('   Password: 12345678');
    console.log('2. The login should provide an accessToken');
    console.log('3. Store the token in localStorage as "accessToken"');
    console.log('4. The admin panel should then work with this token');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminLogin();