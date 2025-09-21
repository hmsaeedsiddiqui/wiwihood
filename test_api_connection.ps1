# Simple API Test
Write-Host "Testing API Connection..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method GET
    Write-Host "✅ API is accessible!" -ForegroundColor Green
    Write-Host "Health check response: $response" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API connection failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Test bookings endpoint
Write-Host "`nTesting bookings endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/bookings/my-bookings" -Method GET -Headers @{"x-user-id" = "test-user-id"}
    Write-Host "✅ Bookings endpoint accessible!" -ForegroundColor Green
    Write-Host "Bookings response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Bookings endpoint error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}