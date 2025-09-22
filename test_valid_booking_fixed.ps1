# Test with Valid Service IDs - Fixed
Write-Host "Getting valid service IDs..." -ForegroundColor Green

try {
    $services = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/services" -Method GET -Headers @{"x-user-id" = "test-user-id"}
    
    if ($services -and $services.Count -gt 0) {
        $firstService = $services[0]
        Write-Host "`nCreating booking with valid IDs..." -ForegroundColor Yellow
        
        $serviceId = $firstService.id
        $providerId = $firstService.providerId
        
        Write-Host "Using Service ID: $serviceId" -ForegroundColor Green
        Write-Host "Using Provider ID: $providerId" -ForegroundColor Green
        
        $bookingData = @{
            serviceId = $serviceId
            providerId = $providerId
            startTime = "2024-12-15T10:00:00Z"
            endTime = "2024-12-15T11:00:00Z"
            totalPrice = 75.00
            notes = "Test booking with valid IDs"
        } | ConvertTo-Json
        
        Write-Host "Booking Data JSON:" -ForegroundColor Cyan
        Write-Host $bookingData
        
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/bookings" -Method POST -Body $bookingData -ContentType "application/json" -Headers @{"x-user-id" = "test-user-id"}
        
        Write-Host "✅ Booking created successfully!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3 | Write-Host
    } else {
        Write-Host "❌ No services found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
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