const axios = require('axios');

const baseURL = 'http://localhost:3000/api/v1';

// Test credentials - you should replace with valid JWT token
const authToken = 'Bearer YOUR_JWT_TOKEN_HERE'; // You'll need to get this from login

async function testReferralEndpoints() {
  try {
    console.log('🔍 Testing Referral API Endpoints with Parameters...\n');
    
    // Test 1: Get My Referral Code (the endpoint that was failing)
    console.log('1. Testing GET /referrals/my-code with parameters:');
    try {
      // Test without parameters
      const response1 = await axios.get(`${baseURL}/referrals/my-code`, {
        headers: { Authorization: authToken },
        timeout: 10000
      });
      console.log('   ✅ Without parameters:', response1.status, response1.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ Without parameters:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ Without parameters - Network/Connection error:', error.message);
      }
    }
    
    try {
      // Test with parameters
      const response2 = await axios.get(`${baseURL}/referrals/my-code?includeStats=true&format=full`, {
        headers: { Authorization: authToken },
        timeout: 10000
      });
      console.log('   ✅ With parameters (includeStats=true, format=full):', response2.status, response2.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ With parameters:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ With parameters - Network/Connection error:', error.message);
      }
    }
    
    // Test 2: Get My Referrals with filtering
    console.log('\n2. Testing GET /referrals/my-referrals with parameters:');
    try {
      const response = await axios.get(`${baseURL}/referrals/my-referrals?status=COMPLETED&limit=10&offset=0`, {
        headers: { Authorization: authToken },
        timeout: 10000
      });
      console.log('   ✅ With filtering:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ With filtering:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ With filtering - Network/Connection error:', error.message);
      }
    }
    
    // Test 3: Get Referral Stats
    console.log('\n3. Testing GET /referrals/stats with date filtering:');
    try {
      const response = await axios.get(`${baseURL}/referrals/stats?startDate=2024-01-01&endDate=2024-12-31`, {
        headers: { Authorization: authToken },
        timeout: 10000
      });
      console.log('   ✅ With date filtering:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ With date filtering:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ With date filtering - Network/Connection error:', error.message);
      }
    }
    
    // Test 4: Validate Referral Code
    console.log('\n4. Testing POST /referrals/validate with parameters:');
    try {
      const response = await axios.post(`${baseURL}/referrals/validate`, 
        { code: 'TEST123' },
        {
          headers: { 
            Authorization: authToken,
            'Content-Type': 'application/json'
          },
          params: { userId: 1 },
          timeout: 10000
        }
      );
      console.log('   ✅ With userId parameter:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ With userId parameter:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ With userId parameter - Network/Connection error:', error.message);
      }
    }
    
    // Test 5: Get Campaigns with filtering
    console.log('\n5. Testing GET /referrals/campaigns with parameters:');
    try {
      const response = await axios.get(`${baseURL}/referrals/campaigns?isActive=true&rewardType=DISCOUNT`, {
        headers: { Authorization: authToken },
        timeout: 10000
      });
      console.log('   ✅ With filtering:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        console.log('   ❌ With filtering:', error.response.status, error.response.data);
      } else {
        console.log('   ❌ With filtering - Network/Connection error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ General error testing endpoints:', error.message);
  }
}

// Also test without authentication to see what happens
async function testWithoutAuth() {
  console.log('\n🔓 Testing endpoints without authentication:');
  try {
    const response = await axios.get(`${baseURL}/referrals/my-code`, {
      timeout: 10000
    });
    console.log('   ✅ No auth:', response.status, response.data);
  } catch (error) {
    if (error.response) {
      console.log('   ❌ No auth (expected):', error.response.status, error.response.data?.message || error.response.data);
    } else {
      console.log('   ❌ No auth - Network error:', error.message);
    }
  }
}

console.log('📝 Note: You need to replace YOUR_JWT_TOKEN_HERE with a valid JWT token');
console.log('   You can get this by logging in through /api/v1/auth/login\n');

testReferralEndpoints();
testWithoutAuth();