# Loyalty API Authentication Test
Write-Host "Loyalty API Authentication Test" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3001/api/v1"

# Step 1: Test loyalty endpoint without authentication (should get 401)
Write-Host ""
Write-Host "Step 1: Testing loyalty endpoint without authentication..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/loyalty/account" -Method GET -UseBasicParsing
    Write-Host "Unexpected: Got status $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "Perfect! Got 401 Unauthorized as expected" -ForegroundColor Green
        Write-Host "This confirms Loyalty API requires authentication" -ForegroundColor Cyan
    } else {
        Write-Host "Got status code: $statusCode" -ForegroundColor Red
    }
}

# Step 2: Login to get token
Write-Host ""
Write-Host "Step 2: Logging in to get JWT token..." -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@reservista.com"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$API_BASE/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    $token = $null
    if ($loginData.access_token) {
        $token = $loginData.access_token
    } elseif ($loginData.accessToken) {
        $token = $loginData.accessToken
    } elseif ($loginData.token) {
        $token = $loginData.token
    }
    
    if ($token) {
        Write-Host "Login successful! Token received" -ForegroundColor Green
        
        # Step 3: Test authenticated loyalty request
        Write-Host ""
        Write-Host "Step 3: Testing authenticated loyalty request..." -ForegroundColor Yellow
        
        $authHeaders = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $loyaltyResponse = Invoke-WebRequest -Uri "$API_BASE/loyalty/account" -Method GET -Headers $authHeaders -UseBasicParsing
            Write-Host "SUCCESS! Authenticated loyalty request worked!" -ForegroundColor Green
            Write-Host "Status: $($loyaltyResponse.StatusCode)" -ForegroundColor Cyan
            
            $loyaltyData = $loyaltyResponse.Content | ConvertFrom-Json
            Write-Host "Loyalty Account Data:" -ForegroundColor Cyan
            Write-Host "Current Points: $($loyaltyData.currentPoints)" -ForegroundColor White
            Write-Host "Tier: $($loyaltyData.tier)" -ForegroundColor White
            Write-Host "Total Points Earned: $($loyaltyData.totalPointsEarned)" -ForegroundColor White
            
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Authenticated request failed with status: $statusCode" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "No token found in login response" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "SWAGGER UI FIX:" -ForegroundColor Green
Write-Host "1. First call /api/v1/auth/login to get JWT token" -ForegroundColor Yellow
Write-Host "2. In Swagger UI, click 'Authorize' button" -ForegroundColor Yellow
Write-Host "3. Enter: Bearer <your-jwt-token>" -ForegroundColor Yellow
Write-Host "4. Then try the loyalty endpoint again" -ForegroundColor Yellow