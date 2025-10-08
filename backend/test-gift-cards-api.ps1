# Gift Cards API Test Script with Authentication (PowerShell)

Write-Host "🔐 Step 1: Getting JWT Token..." -ForegroundColor Yellow

# Login request (adjust credentials as needed)
$loginBody = @{
    email = "admin@reservista.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    
    # Extract token (adjust property name based on your response)
    $token = $loginResponse.accessToken
    if (-not $token) {
        $token = $loginResponse.token
    }
    if (-not $token) {
        $token = $loginResponse.access_token
    }
    
    if ($token) {
        Write-Host "✅ Token obtained: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
        
        Write-Host "`n🎁 Step 2: Testing Gift Cards API with Authentication..." -ForegroundColor Yellow
        
        # Test Gift Cards API with token
        $giftCardBody = @{
            amount = 100
            recipientName = "John Doe"
            recipientEmail = "john@example.com"
            message = "Happy Birthday! Enjoy your spa day!"
            expiresAt = "2025-12-31T23:59:59.000Z"
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }
        
        $giftCardResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/gift-cards" -Method POST -Headers $headers -Body $giftCardBody
        
        Write-Host "✅ Gift Card Created Successfully!" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Cyan
        $giftCardResponse | ConvertTo-Json -Depth 3
        
    } else {
        Write-Host "❌ No token found in login response" -ForegroundColor Red
        Write-Host "Login Response:" -ForegroundColor Yellow
        $loginResponse | ConvertTo-Json
    }
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}