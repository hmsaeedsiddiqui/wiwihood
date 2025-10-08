const http = require('http');

async function testLoyaltyAPI() {
  console.log('🔑 Step 1: Getting login token...');
  
  // Login first
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

  return new Promise((resolve, reject) => {
    const loginReq = http.request(loginOptions, (loginRes) => {
      let loginBody = '';
      
      loginRes.on('data', (chunk) => {
        loginBody += chunk;
      });
      
      loginRes.on('end', () => {
        try {
          if (loginRes.statusCode === 200 || loginRes.statusCode === 201) {
            const loginResponse = JSON.parse(loginBody);
            const token = loginResponse.accessToken;
            console.log('✅ Login successful! Token received.');
            
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
                  try {
                    const loyaltyData = JSON.parse(loyaltyBody);
                    console.log('📊 Loyalty Account Details:');
                    console.log('  Current Points:', loyaltyData.currentPoints);
                    console.log('  Tier:', loyaltyData.tier);
                    console.log('  Total Earned:', loyaltyData.totalPointsEarned);
                    console.log('  User ID:', loyaltyData.userId);
                    resolve('SUCCESS');
                  } catch (e) {
                    console.log('📊 Raw Response:', loyaltyBody);
                    resolve('SUCCESS_WITH_PARSING_ERROR');
                  }
                } else {
                  console.log('❌ Loyalty API Error:', loyaltyBody);
                  resolve('LOYALTY_API_ERROR');
                }
              });
            });
            
            loyaltyReq.on('error', (err) => {
              console.log('❌ Loyalty API Request Error:', err.message);
              resolve('LOYALTY_API_REQUEST_ERROR');
            });
            
            loyaltyReq.end();
            
          } else {
            console.log('❌ Login failed:', loginBody);
            resolve('LOGIN_FAILED');
          }
        } catch (e) {
          console.log('❌ Login response parsing error:', e.message);
          resolve('LOGIN_PARSING_ERROR');
        }
      });
    });
    
    loginReq.on('error', (err) => {
      console.log('❌ Login request error:', err.message);
      resolve('LOGIN_REQUEST_ERROR');
    });
    
    loginReq.write(loginData);
    loginReq.end();
  });
}

async function waitForServer() {
  console.log('⏳ Waiting for server to be ready...');
  
  for (let i = 0; i < 20; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3001,
          path: '/',
          method: 'GET',
          timeout: 2000
        }, (res) => {
          console.log('✅ Server is ready!');
          resolve();
        });
        
        req.on('error', () => {
          reject();
        });
        
        req.on('timeout', () => {
          reject();
        });
        
        req.end();
      });
      
      // Server is ready, test the API
      return await testLoyaltyAPI();
      
    } catch (e) {
      console.log(`⏳ Attempt ${i + 1}/20: Server not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('❌ Server did not start within timeout period');
  return 'TIMEOUT';
}

waitForServer().then(result => {
  console.log(`\n🏁 Final Result: ${result}`);
  process.exit(0);
});