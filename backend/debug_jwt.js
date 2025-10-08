const axios = require('axios');

async function debugJwtIssue() {
  const baseURL = 'http://localhost:3001/api/v1';
  
  console.log('🔧 Debugging JWT Authentication Issue\n');
  
  try {
    // First, login and inspect the response
    console.log('1. Attempting login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'abc@gmail.com',
      password: '12345678'
    });
    
    console.log('✅ Login Response:');
    console.log('Status:', loginResponse.status);
    console.log('Data:', JSON.stringify(loginResponse.data, null, 2));
    
    const token = loginResponse.data.accessToken;
    console.log('\n📝 Token preview:', token.substring(0, 50) + '...');
    
    // Test with a simpler endpoint first (user profile)
    console.log('\n2. Testing JWT with /auth/profile endpoint...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      const profileResponse = await axios.get(`${baseURL}/auth/profile`, { headers });
      console.log('✅ Profile endpoint works:');
      console.log('Status:', profileResponse.status);
      console.log('User:', profileResponse.data);
      
      // Now test referral endpoint
      console.log('\n3. Testing referral endpoint with same token...');
      const referralResponse = await axios.get(`${baseURL}/referrals/my-code`, { headers });
      console.log('✅ Referral endpoint works:');
      console.log('Status:', referralResponse.status);
      console.log('Data:', JSON.stringify(referralResponse.data, null, 2));
      
    } catch (error) {
      console.log('❌ Authentication error:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Error details:', error.response?.data);
      
      // Let's also check what headers are being sent
      console.log('\n📋 Request headers being sent:');
      console.log(JSON.stringify(headers, null, 2));
    }
    
  } catch (loginError) {
    console.log('❌ Login error:', loginError.response?.data || loginError.message);
  }
}

debugJwtIssue();