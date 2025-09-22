# Test Cart API
Write-Host "Testing Cart API..." -ForegroundColor Green

try {
    # Test getting cart
    Write-Host "Getting cart..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/cart" -Method GET -Headers @{"x-user-id" = "test-user-id"}
    Write-Host "✅ Cart GET successful!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3 | Write-Host
    
    # Test adding to cart
    Write-Host "`nAdding item to cart..." -ForegroundColor Yellow
    $cartData = @{
        serviceId = "006d3ed6-3b1d-4b08-8795-7724a0aa59de"
        quantity = 1
    } | ConvertTo-Json
    
    $addResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/cart" -Method POST -Body $cartData -ContentType "application/json" -Headers @{"x-user-id" = "test-user-id"}
    Write-Host "✅ Cart POST successful!" -ForegroundColor Green
    $addResponse | ConvertTo-Json -Depth 3 | Write-Host
    
} catch {
    Write-Host "❌ Cart API Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        
        try {
            $errorDetails = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorDetails)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Details:" -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor Yellow
        } catch {
            Write-Host "Could not read error details" -ForegroundColor Red
        }
    }
}