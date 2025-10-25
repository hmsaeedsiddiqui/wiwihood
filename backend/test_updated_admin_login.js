// Test the updated admin credentials
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testUpdatedAdminLogin() {
  try {
    console.log('🔍 Testing Updated Admin Login Credentials');
    console.log('='.repeat(50));
    
    // Test the credentials we just updated
    const credentialsToTest = [
      { email: 'abc@gmail.com', password: 'admin123' },
      { email: 'admin@admin.com', password: 'admin123' },
      { email: 'admin@wiwihood.com', password: 'admin123' }, // Original request
    ];
    
    for (const cred of credentialsToTest) {
      console.log(`\n🔐 Testing: ${cred.email} / ${cred.password}`);
      
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: cred.email,
          password: cred.password
        });
        
        console.log('   ✅ LOGIN SUCCESSFUL!');
        console.log('   Status:', loginResponse.status);
        console.log('   User data:', loginResponse.data.user);
        console.log('   Token present:', !!loginResponse.data.accessToken);
        
        if (loginResponse.data.accessToken) {
          // Test admin endpoint
          console.log('   🔧 Testing admin endpoint...');
          try {
            const adminTest = await axios.get(`${API_BASE_URL}/admin/services/stats`, {
              headers: { 'Authorization': `Bearer ${loginResponse.data.accessToken}` }
            });
            console.log('   ✅ Admin endpoint works!');
            
            console.log(`\n🎉 WORKING ADMIN CREDENTIALS:`);
            console.log(`   Email: ${cred.email}`);
            console.log(`   Password: ${cred.password}`);
            console.log('   ✅ Login successful');
            console.log('   ✅ Admin access verified');
            console.log('\n   Use these credentials to login to the admin dashboard!');
            return;
            
          } catch (adminError) {
            console.log('   ❌ Admin endpoint failed:', adminError.response?.status, adminError.response?.data?.message);
          }
        }
        
      } catch (loginError) {
        console.log('   ❌ Login failed:', loginError.response?.data?.message || loginError.message);
      }
    }
    
    console.log('\n❌ No working credentials found');
    console.log('💡 Try starting the backend server if it\'s not running:');
    console.log('   cd backend && npm run start:dev');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testUpdatedAdminLogin();