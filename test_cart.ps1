$headers = @{
    'Content-Type' = 'application/json'
    'x-user-id' = 'test-user-id'
}

Write-Host "Testing cart endpoints..." -ForegroundColor Green

# Test GET cart
Write-Host "`n1. Getting cart items..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/cart" -Headers $headers -Method GET
    Write-Host "✓ GET cart successful" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ GET cart failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST to add item to cart
Write-Host "`n2. Adding item to cart..." -ForegroundColor Yellow
$cartItem = @{
    serviceId = "test-service-id"
    quantity = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/cart" -Headers $headers -Method POST -Body $cartItem
    Write-Host "✓ POST cart successful" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ POST cart failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
