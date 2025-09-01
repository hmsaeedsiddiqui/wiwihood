# PowerShell script to test the enhanced booking API endpoints
$baseUrl = "http://localhost:3001/api/v1"

Write-Host "Testing Enhanced Booking API Endpoints" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Test 1: Get all bookings
Write-Host "`n1. Testing GET /bookings..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bookings" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /bookings - Success" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)"
} catch {
    Write-Host "❌ GET /bookings - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get booking stats
Write-Host "`n2. Testing GET /bookings/stats..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bookings/stats" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /bookings/stats - Success" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)"
} catch {
    Write-Host "❌ GET /bookings/stats - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get availability (example with dummy IDs)
Write-Host "`n3. Testing GET /bookings/availability/1/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bookings/availability/1/1?date=2024-01-15" -Method GET -ContentType "application/json"
    Write-Host "✅ GET /bookings/availability - Success" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)"
} catch {
    Write-Host "❌ GET /bookings/availability - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create a test booking
Write-Host "`n4. Testing POST /bookings..." -ForegroundColor Yellow
$newBooking = @{
    serviceId = 1
    providerId = 1
    customerId = 1
    bookingDate = "2024-01-15"
    startTime = "10:00"
    endTime = "11:00"
    totalAmount = 100.00
    notes = "Test booking via PowerShell"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bookings" -Method POST -Body $newBooking -ContentType "application/json"
    Write-Host "✅ POST /bookings - Success" -ForegroundColor Green
    Write-Host "Created booking ID: $($response.id)"
    $bookingId = $response.id
} catch {
    Write-Host "❌ POST /bookings - Error: $($_.Exception.Message)" -ForegroundColor Red
    $bookingId = $null
}

# Test 5: Reschedule booking (if we created one)
if ($bookingId) {
    Write-Host "`n5. Testing PATCH /bookings/$bookingId/reschedule..." -ForegroundColor Yellow
    $rescheduleData = @{
        newDate = "2024-01-16"
        newStartTime = "14:00"
        newEndTime = "15:00"
        reason = "Customer requested change"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/bookings/$bookingId/reschedule" -Method PATCH -Body $rescheduleData -ContentType "application/json"
        Write-Host "✅ PATCH /bookings/reschedule - Success" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 2)"
    } catch {
        Write-Host "❌ PATCH /bookings/reschedule - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host "Access Swagger UI at: http://localhost:3001/api/docs" -ForegroundColor Cyan
