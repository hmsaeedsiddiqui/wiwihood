# Test Gift Card Redeem API with correct format
$authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NDAxNDcwLCJleHAiOjE3NTk0MDUwNzB9.Ih2p0hNBsskSH8qd0pczaJY77uRzJokAPOn0ON0y5PQ"

$headers = @{
    'accept' = 'application/json'
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

Write-Host "🎯 Testing Gift Card REDEEM API with CORRECT format..." -ForegroundColor Cyan
Write-Host "❌ WRONG: 'bookingId': 'string' (literal string causes UUID error)" -ForegroundColor Red
Write-Host "✅ CORRECT: Remove bookingId field OR use valid UUID OR null" -ForegroundColor Green
Write-Host ""

# Test 1: WITHOUT bookingId field (RECOMMENDED)
Write-Host "🧪 Test 1: WITHOUT bookingId (recommended approach)" -ForegroundColor Yellow
$body1 = @{
    code = "GC2025PC8ECDU0"
    amount = 50
    description = "Test redemption without bookingId"
} | ConvertTo-Json

try {
    $response1 = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/gift-cards/redeem" -Method POST -Headers $headers -Body $body1 -UseBasicParsing
    Write-Host "✅ SUCCESS! Status Code: $($response1.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response1.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n" + "="*60 + "`n"

# Test 2: WITH null bookingId
Write-Host "🧪 Test 2: WITH null bookingId" -ForegroundColor Yellow
$body2 = @{
    code = "GC2025PC8ECDU0"
    amount = 25
    bookingId = $null
    description = "Test redemption with null bookingId"
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/gift-cards/redeem" -Method POST -Headers $headers -Body $body2 -UseBasicParsing
    Write-Host "✅ SUCCESS! Status Code: $($response2.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response2.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n" + "="*60 + "`n"

# Test 3: WITH valid UUID bookingId
Write-Host "🧪 Test 3: WITH valid UUID bookingId" -ForegroundColor Yellow
$body3 = @{
    code = "GC2025PC8ECDU0"
    amount = 15
    bookingId = "123e4567-e89b-12d3-a456-426614174000"
    description = "Test redemption with valid UUID bookingId"
} | ConvertTo-Json

try {
    $response3 = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/gift-cards/redeem" -Method POST -Headers $headers -Body $body3 -UseBasicParsing
    Write-Host "✅ SUCCESS! Status Code: $($response3.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response3.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 SUMMARY:" -ForegroundColor Cyan
Write-Host "The error you encountered was caused by sending:" -ForegroundColor White
Write-Host "  'bookingId': 'string'" -ForegroundColor Red
Write-Host "Instead, use one of these correct formats:" -ForegroundColor White
Write-Host "  1. Omit bookingId field completely (recommended)" -ForegroundColor Green
Write-Host "  2. 'bookingId': null" -ForegroundColor Green  
Write-Host "  3. 'bookingId': 'valid-uuid-format'" -ForegroundColor Green