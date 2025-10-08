// Gift Cards API Test with User Creation
const API_BASE = 'http://localhost:3001/api/v1';

async function testGiftCardsAPI() {
    console.log('🧪 Gift Cards API Test Suite');
    console.log('============================\n');

    try {
        // Step 1: Create or login user
        console.log('🔐 Step 1: Authenticating...');
        
        // Try login first
        let authResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@reservista.com',
                password: 'admin123'
            })
        });

        let authData = await authResponse.json();
        let token = authData.accessToken || authData.token || authData.access_token;

        if (!token) {
            console.log('ℹ️ Login failed, trying to register...');
            
            // Try registration if login fails
            authResponse = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test.user@reservista.com',
                    password: 'testuser123',
                    phoneNumber: '+923001234567',
                    role: 'user'
                })
            });

            authData = await authResponse.json();
            token = authData.accessToken || authData.token || authData.access_token;
        }

        if (!token) {
            console.log('❌ Authentication failed');
            console.log('Response:', authData);
            return;
        }

        console.log(`✅ Token obtained: ${token.substring(0, 20)}...`);

        // Step 2: Test Gift Cards API
        console.log('\n🎁 Step 2: Testing Gift Cards API...');
        
        const giftCardData = {
            amount: 100,
            recipientName: "John Doe",
            recipientEmail: "john@example.com", 
            message: "Happy Birthday! Enjoy your spa day!",
            expiresAt: "2025-12-31T23:59:59.000Z"
        };

        const giftCardResponse = await fetch(`${API_BASE}/gift-cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(giftCardData)
        });

        const giftCardResult = await giftCardResponse.json();

        if (giftCardResponse.ok) {
            console.log('✅ Gift Card created successfully!');
            console.log('Gift Card Details:');
            console.log(JSON.stringify(giftCardResult, null, 2));
        } else {
            console.log('❌ Gift Card creation failed');
            console.log(`Status: ${giftCardResponse.status}`);
            console.log('Error:', giftCardResult);
        }

        // Step 3: Test other gift card endpoints
        console.log('\n📋 Step 3: Testing other Gift Card endpoints...');
        
        // Get user's gift cards
        const userCardsResponse = await fetch(`${API_BASE}/gift-cards/my-cards`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userCardsResponse.ok) {
            const userCards = await userCardsResponse.json();
            console.log('✅ User gift cards retrieved:');
            console.log(JSON.stringify(userCards, null, 2));
        }

    } catch (error) {
        console.log('❌ Test failed with error:', error.message);
    }
}

// Run the test
testGiftCardsAPI();