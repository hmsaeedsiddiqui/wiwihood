#!/bin/bash

echo "🎯 Gift Card Redeem API - CORRECT Usage Examples"
echo "=============================================="
echo ""

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NDAxNDcwLCJleHAiOjE3NTk0MDUwNzB9.Ih2p0hNBsskSH8qd0pczaJY77uRzJokAPOn0ON0y5PQ"

echo "❌ WRONG (causes UUID error):"
echo 'curl -X POST "http://localhost:3001/api/v1/gift-cards/redeem" \'
echo '  -H "Authorization: Bearer $TOKEN" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"code\":\"GC2025PC8ECDU0\",\"amount\":50,\"bookingId\":\"string\"}"'
echo ""

echo "✅ CORRECT Option 1 - WITHOUT bookingId (RECOMMENDED):"
echo 'curl -X POST "http://localhost:3001/api/v1/gift-cards/redeem" \'
echo '  -H "Authorization: Bearer $TOKEN" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"code\":\"GC2025PC8ECDU0\",\"amount\":50,\"description\":\"Test redemption\"}"'
echo ""

echo "✅ CORRECT Option 2 - WITH null bookingId:"
echo 'curl -X POST "http://localhost:3001/api/v1/gift-cards/redeem" \'
echo '  -H "Authorization: Bearer $TOKEN" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"code\":\"GC2025PC8ECDU0\",\"amount\":50,\"bookingId\":null,\"description\":\"Test redemption\"}"'
echo ""

echo "✅ CORRECT Option 3 - WITH valid UUID bookingId:"
echo 'curl -X POST "http://localhost:3001/api/v1/gift-cards/redeem" \'
echo '  -H "Authorization: Bearer $TOKEN" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"code\":\"GC2025PC8ECDU0\",\"amount\":50,\"bookingId\":\"123e4567-e89b-12d3-a456-426614174000\",\"description\":\"Test redemption\"}"'
echo ""

echo "🎯 The error occurs because:"
echo "   - PostgreSQL expects UUID format for bookingId column"
echo "   - 'string' is not a valid UUID"
echo "   - Valid UUID format: 8-4-4-4-12 hexadecimal digits"
echo "   - Example: 123e4567-e89b-12d3-a456-426614174000"