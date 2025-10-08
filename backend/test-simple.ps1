# Simple Gift Cards API Test
Write-Host "Gift Cards API Authentication Test" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3001/api/v1"

# Step 1: Test unauthenticated call (should get 401)
Write-Host ""
Write-Host "Step 1: Testing without authentication..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/gift-cards/my-cards" -Method GET -UseBasicParsing
    Write-Host "Unexpected: Got status $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "Perfect! Got 401 Unauthorized as expected" -ForegroundColor Green
        Write-Host "This confirms Gift Cards API requires authentication" -ForegroundColor Cyan
    } else {
        Write-Host "Got status code: $statusCode" -ForegroundColor Red
    }
}

# Step 2: Register test user
Write-Host ""
Write-Host "Step 2: Registering test user..." -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@reservista.com"
    password = "testpass123"
    firstName = "Test"
    lastName = "User"
    phone = "+923001234567"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$API_BASE/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing
    Write-Host "User registered successfully" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "User already exists, continuing..." -ForegroundColor Blue
    } else {
        Write-Host "Registration error: $statusCode" -ForegroundColor Yellow
    }
}

# Step 3: Login to get token
Write-Host ""
Write-Host "Step 3: Logging in..." -ForegroundColor Yellow
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
        $tokenPreview = $token.Substring(0, [Math]::Min(20, $token.Length))
        Write-Host "Token preview: $tokenPreview..." -ForegroundColor Cyan
        
        # Step 4: Test authenticated request
        Write-Host ""
        Write-Host "Step 4: Testing authenticated request..." -ForegroundColor Yellow
        
        $authHeaders = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $authResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards/my-cards" -Method GET -Headers $authHeaders -UseBasicParsing
            Write-Host "SUCCESS! Authenticated request worked!" -ForegroundColor Green
            Write-Host "Status: $($authResponse.StatusCode)" -ForegroundColor Cyan
            
            $cardsData = $authResponse.Content | ConvertFrom-Json
            if ($cardsData -is [array]) {
                Write-Host "Found $($cardsData.Count) gift cards" -ForegroundColor Cyan
            } else {
                Write-Host "Gift cards data received" -ForegroundColor Cyan
            }
            
        } catch {
            Write-Host "Authenticated request failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "No token found in login response" -ForegroundColor Red
        Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "CONCLUSION:" -ForegroundColor Green
Write-Host "Your 401 error happens because Gift Cards API requires JWT authentication" -ForegroundColor Yellow
Write-Host "Always include: Authorization: Bearer <your-jwt-token>" -ForegroundColor Cyan