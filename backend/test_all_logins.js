const axios = require('axios');

async function testAllLogins() {
    const API_BASE = 'http://localhost:3001/api/v1';
    
    console.log('🧪 Testing all login credentials...\n');
    
    const testUsers = [
        {
            email: 'john.doe@example.com',
            password: 'Password123!',
            expectedRole: 'customer',
            description: 'Main Swagger test user'
        },
        {
            email: 'admin@example.com',
            password: 'admin123',
            expectedRole: 'admin',
            description: 'Admin user'
        },
        {
            email: 'provider@example.com',
            password: 'provider123',
            expectedRole: 'provider',
            description: 'Provider user'
        },
        {
            email: 'test@example.com',
            password: 'password123',
            expectedRole: 'customer',
            description: 'Alternative test user'
        }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    for (const user of testUsers) {
        try {
            console.log(`\n🔐 Testing: ${user.description}`);
            console.log(`📧 Email: ${user.email}`);
            console.log(`🔑 Password: ${user.password}`);
            
            const response = await axios.post(`${API_BASE}/auth/login`, {
                email: user.email,
                password: user.password
            });
            
            if (response.data && response.data.accessToken) {
                console.log('✅ LOGIN SUCCESSFUL!');
                console.log(`👤 User Role: ${response.data.user.role}`);
                console.log(`🆔 User ID: ${response.data.user.id}`);
                console.log(`📊 Status: ${response.data.user.status}`);
                
                if (response.data.user.role === user.expectedRole) {
                    console.log('✅ Role matches expected');
                } else {
                    console.log(`⚠️  Role mismatch - Expected: ${user.expectedRole}, Got: ${response.data.user.role}`);
                }
                
                successCount++;
            } else {
                console.log('❌ No access token received');
                failCount++;
            }
            
        } catch (error) {
            console.log('❌ LOGIN FAILED');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.message || error.message);
            failCount++;
        }
        
        console.log('─'.repeat(60));
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Successful logins: ${successCount}`);
    console.log(`❌ Failed logins: ${failCount}`);
    console.log(`🎯 Success rate: ${Math.round((successCount / testUsers.length) * 100)}%`);
    
    if (successCount === testUsers.length) {
        console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED!');
        console.log('✅ Your Swagger API should now work correctly with these credentials.');
    }
}

testAllLogins();