const http = require('http');

// First login
console.log('🔑 Step 1: Getting login token...');

const loginData = JSON.stringify({
  email: "john.doe@example.com",
  password: "password123"
});

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let loginBody = '';
  
  loginRes.on('data', (chunk) => {
    loginBody += chunk;
  });
  
  loginRes.on('end', () => {
    if (loginRes.statusCode === 200 || loginRes.statusCode === 201) {
      const loginResponse = JSON.parse(loginBody);
      const token = loginResponse.accessToken;
      console.log('✅ Login successful! Token:', token.substring(0, 50) + '...');
      
      // Now test loyalty API
      console.log('🏆 Step 2: Testing Loyalty API...');
      
      const loyaltyOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/loyalty/account',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      };
      
      const loyaltyReq = http.request(loyaltyOptions, (loyaltyRes) => {
        let loyaltyBody = '';
        
        loyaltyRes.on('data', (chunk) => {
          loyaltyBody += chunk;
        });
        
        loyaltyRes.on('end', () => {
          console.log(`🎯 Loyalty API Response Status: ${loyaltyRes.statusCode}`);
          
          if (loyaltyRes.statusCode === 200) {
            console.log('🎉 LOYALTY API SUCCESS!');
            const loyaltyData = JSON.parse(loyaltyBody);
            console.log('📊 Loyalty Account Details:');
            console.log(JSON.stringify(loyaltyData, null, 2));
          } else {
            console.log('❌ Loyalty API Error:', loyaltyBody);
          }
        });
      });
      
      loyaltyReq.on('error', (err) => {
        console.log('❌ Loyalty API Request Error:', err.message);
      });
      
      loyaltyReq.end();
      
    } else {
      console.log('❌ Login failed:', loginBody);
    }
  });
});

loginReq.on('error', (err) => {
  console.log('❌ Login request error:', err.message);
});

loginReq.write(loginData);
loginReq.end();