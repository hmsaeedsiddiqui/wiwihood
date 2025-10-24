// Test different login scenarios and password verification
const axios = require('axios');
const bcrypt = require('bcrypt');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function debugLoginIssues() {
  try {
    console.log('🔍 Debugging Login Issues');
    console.log('='.repeat(50));
    
    // Test if auth endpoint exists
    console.log('🔧 Step 1: Testing auth endpoints...');
    try {
      // Try to access login endpoint with invalid data to see if it exists
      const testResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✅ Login endpoint exists (returned 401 for invalid credentials)');
      } else if (error.response?.status === 404) {
        console.log('   ❌ Login endpoint not found (404)');
        console.log('   Check if auth routes are properly configured');
        return;
      } else {
        console.log('   ⚠️  Login endpoint response:', error.response?.status, error.response?.data?.message);
      }
    }
    
    // Test different admin credentials from database
    console.log('\n🔧 Step 2: Testing admin credentials from database...');
    const adminCredentials = [
      { email: 'abc@gmail.com', password: '12345678' },
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'umar.doe@example.com', password: 'admin123' },
      { email: 'abc@gmail.com', password: 'admin123' },
      { email: 'abc@gmail.com', password: 'password' },
    ];
    
    for (const cred of adminCredentials) {
      try {
        console.log(`   Testing: ${cred.email} / ${cred.password}`);
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: cred.email,
          password: cred.password
        });
        
        console.log('   ✅ LOGIN SUCCESS!');
        console.log('   User data:', loginResponse.data.user);
        console.log('   Token present:', !!loginResponse.data.accessToken);
        
        if (loginResponse.data.accessToken) {
          // Test admin endpoint
          console.log('   🔧 Testing admin endpoint with this token...');
          try {
            const adminTest = await axios.get(`${API_BASE_URL}/admin/services/stats`, {
              headers: { 'Authorization': `Bearer ${loginResponse.data.accessToken}` }
            });
            console.log('   ✅ Admin endpoint works!', adminTest.data);
            
            console.log(`\n🎉 WORKING ADMIN CREDENTIALS FOUND:`);
            console.log(`   Email: ${cred.email}`);
            console.log(`   Password: ${cred.password}`);
            console.log('   Use these in your admin login form!');
            return;
            
          } catch (adminError) {
            console.log('   ❌ Admin endpoint failed:', adminError.response?.status, adminError.response?.data?.message);
          }
        }
        
      } catch (loginError) {
        console.log('   ❌ Failed:', loginError.response?.data?.message || loginError.message);
      }
    }
    
    console.log('\n🔧 Step 3: Testing if backend server is running correctly...');
    try {
      const healthCheck = await axios.get('http://localhost:8000');
      console.log('   ✅ Backend server is responding');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('   ❌ Backend server not running on port 8000');
        console.log('   Please start the backend server: npm run start:dev');
        return;
      }
    }
    
    console.log('\n💡 Troubleshooting Steps:');
    console.log('1. Make sure backend server is running (npm run start:dev)');
    console.log('2. Check if auth module is properly configured');
    console.log('3. Verify admin user passwords in database');
    console.log('4. Check JWT configuration in backend');
    console.log('5. Ensure CORS is properly configured');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugLoginIssues();