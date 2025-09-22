# Test Booking Creation API
Write-Host "Testing Booking Creation API..." -ForegroundColor Green

# Test data for booking creation
$bookingData = @{
    serviceId = "123e4567-e89b-12d3-a456-426614174000"
    providerId = "123e4567-e89b-12d3-a456-426614174001"
    startTime = "2024-12-15T10:00:00Z"
    endTime = "2024-12-15T11:00:00Z"
    totalPrice = 75.00
    notes = "Test booking created via API"
} | ConvertTo-Json

Write-Host "Booking Data:" -ForegroundColor Yellow
Write-Host $bookingData

# Make API call
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/bookings" -Method POST -Body $bookingData -ContentType "application/json" -Headers @{"x-user-id" = "test-user-id"}
    
    Write-Host "✅ Booking created successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
    
} catch {
    Write-Host "❌ Error creating booking:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $errorBody -ForegroundColor Yellow
    }
}

Write-Host "`nTest completed." -ForegroundColor Green