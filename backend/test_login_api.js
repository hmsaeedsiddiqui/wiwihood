const axios = require('axios');

async function testLogin() {
    const API_BASE = 'http://localhost:3001/api/v1';
    
    console.log('🧪 Testing Login API...\n');
    
    // Test cases with different credentials
    const testCases = [
        {
            email: 'john.doe@example.com',
            password: 'Password123!',
            description: 'Standard test user from Swagger'
        },
        {
            email: 'test@example.com',
            password: 'password123',
            description: 'Alternative test user'
        },
        {
            email: 'abc@gmail.com',
            password: '12345678',
            description: 'Admin test user'
        },
        {
            email: 'admin@example.com',
            password: 'admin123',
            description: 'Admin user'
        }
    ];
    
    // First, let's try to register a user
    console.log('🔧 Registering test user...');
    try {
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
            email: 'john.doe@example.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            userRole: 'customer',
            profilePicture: 'https://example.com/avatar.jpg'
        });
        
        console.log('✅ User registered successfully');
        console.log('Response:', registerResponse.data);
    } catch (error) {
        if (error.response?.status === 409) {
            console.log('ℹ️  User already exists, that\'s fine');
        } else {
            console.log('❌ Registration failed:', error.response?.data || error.message);
        }
    }
    
    console.log('\n🔑 Testing login with different credentials...\n');
    
    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.description}`);
            console.log(`Email: ${testCase.email}`);
            console.log(`Password: ${testCase.password}`);
            
            const response = await axios.post(`${API_BASE}/auth/login`, {
                email: testCase.email,
                password: testCase.password
            });
            
            console.log('✅ LOGIN SUCCESSFUL!');
            console.log('Access Token:', response.data.accessToken ? 'Present' : 'Missing');
            console.log('User Data:', response.data.user);
            console.log('─'.repeat(50));
            break; // Exit on first successful login
            
        } catch (error) {
            console.log('❌ Login failed');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.message || error.message);
            console.log('─'.repeat(50));
        }
    }
}

// Give the server some time to start
setTimeout(testLogin, 5000);