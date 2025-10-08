const axios = require('axios');

async function testRedeemGiftCard() {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NDAxNDcwLCJleHAiOjE3NTk0MDUwNzB9.Ih2p0hNBsskSH8qd0pczaJY77uRzJokAPOn0ON0y5PQ';
    
    console.log('🎯 Testing Gift Card REDEEM API with correct format...\n');
    
    // Test 1: Without bookingId (recommended)
    try {
        const response1 = await axios.post('http://localhost:3001/api/v1/gift-cards/redeem', {
            code: "GC2025PC8ECDU0",
            amount: 50,
            description: "Test redemption without booking"
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SUCCESS (without bookingId)!');
        console.log('Status:', response1.status);
        console.log('Response:', JSON.stringify(response1.data, null, 2));
    } catch (error) {
        console.log('❌ Test 1 Failed:', error.response?.data || error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: With valid UUID bookingId
    try {
        const response2 = await axios.post('http://localhost:3001/api/v1/gift-cards/redeem', {
            code: "GC2025PC8ECDU0", // Same code - should work for partial redemption
            amount: 25,
            bookingId: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID format
            description: "Test redemption with valid booking UUID"
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SUCCESS (with valid UUID)!');
        console.log('Status:', response2.status);
        console.log('Response:', JSON.stringify(response2.data, null, 2));
    } catch (error) {
        console.log('❌ Test 2 Failed:', error.response?.data || error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: With null bookingId
    try {
        const response3 = await axios.post('http://localhost:3001/api/v1/gift-cards/redeem', {
            code: "GC2025PC8ECDU0",
            amount: 10,
            bookingId: null, // Explicitly null
            description: "Test redemption with null booking"
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SUCCESS (with null bookingId)!');
        console.log('Status:', response3.status);
        console.log('Response:', JSON.stringify(response3.data, null, 2));
    } catch (error) {
        console.log('❌ Test 3 Failed:', error.response?.data || error.message);
    }
}

testRedeemGiftCard();