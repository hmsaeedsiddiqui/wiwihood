const axios = require('axios');

async function testReferralEndpoint() {
  const baseURL = 'http://localhost:3001/api/v1';
  
  console.log('🔍 Testing Referral my-code endpoint...\n');
  
  try {
    // Test without authentication first to see if the endpoint responds
    console.log('Testing without authentication:');
    const response = await axios.get(`${baseURL}/referrals/my-code`, {
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.data);
    
    if (response.status === 401) {
      console.log('✅ Endpoint is working! Getting 401 Unauthorized as expected.');
      console.log('The 500 Internal Server Error has been fixed!');
    } else if (response.status === 500) {
      console.log('❌ Still getting 500 Internal Server Error');
      console.log('Error details:', response.data);
    } else {
      console.log(`✅ Endpoint responded with status ${response.status}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - server is not running on port 3000');
    } else if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response:`, error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
  
  // Test with parameters
  try {
    console.log('\nTesting with parameters (includeStats=true&format=full):');
    const response = await axios.get(`${baseURL}/referrals/my-code?includeStats=true&format=full`, {
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.data);
    
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response:`, error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testReferralEndpoint();