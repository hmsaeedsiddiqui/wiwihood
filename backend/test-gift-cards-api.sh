#!/bin/bash
# Gift Cards API Test Script with Authentication

# First, login to get JWT token
echo "🔐 Step 1: Getting JWT Token..."

# Login request (adjust credentials as needed)
LOGIN_RESPONSE=$(curl -s -X POST \
  'http://localhost:3001/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@reservista.com",
    "password": "admin123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token from response (adjust based on your response structure)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken // .token // .access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token. Check credentials."
    exit 1
fi

echo "✅ Token obtained: ${TOKEN:0:20}..."

# Now test Gift Cards API with token
echo ""
echo "🎁 Step 2: Testing Gift Cards API with Authentication..."

curl -X POST \
  'http://localhost:3001/api/v1/gift-cards' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 100,
    "recipientName": "John Doe",
    "recipientEmail": "john@example.com",
    "message": "Happy Birthday! Enjoy your spa day!",
    "expiresAt": "2025-12-31T23:59:59.000Z"
  }' | jq .

echo ""
echo "✅ Gift Card API Test Complete!"