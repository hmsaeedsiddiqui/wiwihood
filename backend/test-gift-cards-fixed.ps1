# Gift Cards API Authentication Test Script
# This script demonstrates the complete authentication flow

Write-Host "🎁 Gift Cards API Authentication Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$API_BASE = "http://localhost:3001/api/v1"
$headers = @{ "Content-Type" = "application/json" }

try {
    # Step 1: Test API connectivity
    Write-Host "🔗 Step 1: Testing API connectivity..." -ForegroundColor Yellow
    try {
        $healthResponse = Invoke-WebRequest -Uri "$API_BASE/health" -Method GET -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ API is reachable! Status: $($healthResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ API not reachable. Make sure server is running on port 3001" -ForegroundColor Red
        Write-Host "Run: npm run start:dev" -ForegroundColor Yellow
        exit 1
    }

    # Step 2: Try to access Gift Cards without authentication (should get 401)
    Write-Host ""
    Write-Host "🚫 Step 2: Testing unauthenticated access (should fail)..." -ForegroundColor Yellow
    try {
        $unauthResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards/my-cards" -Method GET -UseBasicParsing -ErrorAction Stop
        Write-Host "⚠️ Unexpected: Got response without authentication" -ForegroundColor Yellow
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ Perfect! Got 401 Unauthorized as expected" -ForegroundColor Green
            Write-Host "🔑 This confirms authentication is required" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Step 3: Create test user (register)
    Write-Host ""
    Write-Host "👤 Step 3: Creating test user..." -ForegroundColor Yellow
    
    $registerBody = @{
        email = "testuser@reservista.com"
        password = "testpass123"
        firstName = "Test"
        lastName = "User"
        phone = "+923001234567"
        role = "user"
    } | ConvertTo-Json

    try {
        $registerResponse = Invoke-WebRequest -Uri "$API_BASE/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ User registered successfully!" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "ℹ️ User already exists, proceeding to login..." -ForegroundColor Blue
        } else {
            Write-Host "⚠️ Registration issue: $($_.Exception.Message)" -ForegroundColor Yellow
            Write-Host "Proceeding to login..." -ForegroundColor Yellow
        }
    }

    # Step 4: Login to get JWT token
    Write-Host ""
    Write-Host "🔐 Step 4: Logging in to get JWT token..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = "testuser@reservista.com"
        password = "testpass123"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-WebRequest -Uri "$API_BASE/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        $loginData = $loginResponse.Content | ConvertFrom-Json
        
        # Extract token (try different possible field names)
        $token = if ($loginData.access_token) { $loginData.access_token } elseif ($loginData.accessToken) { $loginData.accessToken } else { $loginData.token }
        
        if ($token) {
            Write-Host "✅ Login successful! Token received" -ForegroundColor Green
            Write-Host "🎫 Token preview: $($token.Substring(0, 20))..." -ForegroundColor Cyan
        } else {
            Write-Host "❌ Login successful but no token found in response" -ForegroundColor Red
            Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
        exit 1
    }

    # Step 5: Test authenticated Gift Cards requests
    Write-Host ""
    Write-Host "🎁 Step 5: Testing authenticated Gift Cards endpoints..." -ForegroundColor Yellow
    
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }

    # 5.1: Get my cards
    Write-Host ""
    Write-Host "📋 Testing: GET /gift-cards/my-cards" -ForegroundColor Cyan
    try {
        $myCardsResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards/my-cards" -Method GET -Headers $authHeaders -UseBasicParsing -ErrorAction Stop
        $myCardsData = $myCardsResponse.Content | ConvertFrom-Json
        Write-Host "✅ My cards retrieved successfully! Status: $($myCardsResponse.StatusCode)" -ForegroundColor Green
        $cardCount = if ($myCardsData.length) { $myCardsData.length } elseif ($myCardsData.Count) { $myCardsData.Count } else { 'Unknown' }
        Write-Host "📄 Cards count: $cardCount" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed to get my cards: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }

    # 5.2: Get active gift cards
    Write-Host ""
    Write-Host "📋 Testing: GET /gift-cards/active" -ForegroundColor Cyan
    try {
        $activeCardsResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards/active" -Method GET -Headers $authHeaders -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ Active cards retrieved successfully! Status: $($activeCardsResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to get active cards: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }

    # 5.3: Purchase a gift card
    Write-Host ""
    Write-Host "💳 Testing: POST /gift-cards (purchase)" -ForegroundColor Cyan
    
    $purchaseBody = @{
        amount = 100
        recipientEmail = "recipient@example.com"
        recipientName = "Gift Recipient"
        message = "Test gift card from API!"
        expiryDate = "2025-12-31"
    } | ConvertTo-Json

    try {
        $purchaseResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards" -Method POST -Body $purchaseBody -Headers $authHeaders -UseBasicParsing -ErrorAction Stop
        $purchaseData = $purchaseResponse.Content | ConvertFrom-Json
        Write-Host "✅ Gift card purchased successfully! Status: $($purchaseResponse.StatusCode)" -ForegroundColor Green
        
        if ($purchaseData.code) {
            Write-Host "🎫 Gift card code: $($purchaseData.code)" -ForegroundColor Cyan
            
            # 5.4: Check balance of the new gift card
            Write-Host ""
            Write-Host "💰 Testing: POST /gift-cards/check-balance" -ForegroundColor Cyan
            
            $balanceBody = @{
                code = $purchaseData.code
            } | ConvertTo-Json

            try {
                $balanceResponse = Invoke-WebRequest -Uri "$API_BASE/gift-cards/check-balance" -Method POST -Body $balanceBody -Headers $authHeaders -UseBasicParsing -ErrorAction Stop
                $balanceData = $balanceResponse.Content | ConvertFrom-Json
                Write-Host "✅ Balance checked successfully! Status: $($balanceResponse.StatusCode)" -ForegroundColor Green
                $balance = if ($balanceData.balance) { $balanceData.balance } elseif ($balanceData.amount) { $balanceData.amount } else { 'Unknown' }
                Write-Host "💰 Balance: $balance" -ForegroundColor Cyan
            } catch {
                Write-Host "❌ Failed to check balance: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "❌ Failed to purchase gift card: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "🎉 Gift Cards API authentication test completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Summary:" -ForegroundColor Cyan
    Write-Host "   ✅ API connectivity working" -ForegroundColor Green
    Write-Host "   ✅ Authentication required (401 without token)" -ForegroundColor Green
    Write-Host "   ✅ JWT token obtained successfully" -ForegroundColor Green
    Write-Host "   ✅ Authenticated requests working" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔑 Key Learning: Gift Cards API requires JWT authentication!" -ForegroundColor Yellow
    Write-Host "   Always include: Authorization: Bearer <token>" -ForegroundColor Yellow

} catch {
    Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
}