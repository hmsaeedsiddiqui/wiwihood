const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function debugAdminAuth() {
  try {
    console.log('🔍 Debugging Admin Authentication');
    console.log('='.repeat(50));
    
    console.log('📝 To debug admin authentication, we need your JWT token:');
    console.log('1. Open your admin panel in browser');
    console.log('2. Login as admin');
    console.log('3. Open Browser DevTools -> Console');
    console.log('4. Run: localStorage.getItem("accessToken")');
    console.log('5. Copy the token (without quotes) and replace YOUR_TOKEN below');
    console.log('');
    
    // You need to replace this with your actual admin JWT token
    const adminToken = 'YOUR_TOKEN_HERE'; // REPLACE THIS
    
    if (adminToken === 'YOUR_TOKEN_HERE') {
      console.log('❌ Please replace YOUR_TOKEN_HERE with your actual JWT token');
      console.log('   Get it from localStorage.getItem("accessToken") in browser console');
      return;
    }
    
    // Test 1: Check token format
    console.log('🔧 Step 1: Analyzing JWT Token');
    try {
      const parts = adminToken.split('.');
      if (parts.length !== 3) {
        console.log('   ❌ Invalid JWT format (should have 3 parts separated by dots)');
        return;
      }
      
      // Decode payload (note: this is just base64 decoding, not verification)
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log('   ✅ JWT Token Payload:', JSON.stringify(payload, null, 2));
      
      console.log('   🔍 Checking admin fields:');
      console.log(`      role: ${payload.role}`);
      console.log(`      userType: ${payload.userType || 'not present'}`);
      console.log(`      sub (user id): ${payload.sub}`);
      console.log(`      email: ${payload.email}`);
      
    } catch (error) {
      console.log('   ❌ Error decoding JWT:', error.message);
      console.log('   Check if the token is valid and complete');
      return;
    }
    
    // Test 2: Test admin endpoint with token
    console.log('\n🔧 Step 2: Testing Admin Endpoint with Token');
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/services/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ✅ Admin endpoint successful:', response.data);
    } catch (error) {
      console.log('   ❌ Admin endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        console.log('   🔍 401 Unauthorized - JWT token is invalid or expired');
      } else if (error.response?.status === 403) {
        console.log('   🔍 403 Forbidden - User authenticated but not authorized as admin');
        console.log('   This usually means the user role is not "admin"');
      }
    }
    
    console.log('\n💡 Common Issues:');
    console.log('1. Token expired - try logging in again');
    console.log('2. User role is not "admin" - check user data in database');
    console.log('3. Token missing or malformed - check localStorage');
    console.log('4. Backend expects different role field name');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugAdminAuth();