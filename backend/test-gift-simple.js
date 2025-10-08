const http = require('http');

console.log('🧪 Simple Gift Cards API Test');
console.log('==============================\n');

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            data: parsedData,
            raw: responseData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            raw: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  try {
    // Test 1: Check basic API
    console.log('🔗 Testing basic API connection...');
    const healthRes = await makeRequest('/health');
    console.log(`Status: ${healthRes.status}`);
    console.log(`Response: ${JSON.stringify(healthRes.data)}\n`);
    
    // Test 2: Test unauthenticated gift cards call (should get 401)
    console.log('🎁 Testing Gift Cards endpoint (no auth)...');
    const giftRes = await makeRequest('/gift-cards/my-cards');
    console.log(`Status: ${giftRes.status} (Expected: 401 Unauthorized)`);
    console.log(`Response: ${JSON.stringify(giftRes.data)}\n`);
    
    if (giftRes.status === 401) {
      console.log('✅ Perfect! This confirms the 401 error you saw.');
      console.log('🔑 The Gift Cards API requires JWT authentication.');
      console.log('💡 To fix this, you need to:');
      console.log('   1. Register/Login to get a JWT token');
      console.log('   2. Include the token in Authorization header');
      console.log('   3. Format: "Authorization: Bearer <your-jwt-token>"');
    }
    
    // Test 3: Try to login with dummy user
    console.log('🔐 Testing login with test credentials...');
    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: 'admin@reservista.com',
      password: 'admin123'
    });
    console.log(`Login Status: ${loginRes.status}`);
    console.log(`Login Response: ${JSON.stringify(loginRes.data)}\n`);
    
    if (loginRes.status === 200 && loginRes.data.access_token) {
      console.log('🎉 Login successful! Testing authenticated request...');
      
      const token = loginRes.data.access_token;
      const authHeaders = { 'Authorization': `Bearer ${token}` };
      
      // Test authenticated gift cards call
      const authGiftRes = await makeRequest('/gift-cards/my-cards', 'GET', null, authHeaders);
      console.log(`Authenticated Status: ${authGiftRes.status}`);
      console.log(`Authenticated Response: ${JSON.stringify(authGiftRes.data)}\n`);
      
      if (authGiftRes.status === 200) {
        console.log('✅ Gift Cards API working with authentication!');
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();