# Forms API Testing Script for PowerShell
# Use this to test Forms API endpoints quickly

$BASE_URL = "http://localhost:3000/api"
$FORMS_URL = "$BASE_URL/forms"

# Replace with your actual JWT token
$AUTH_TOKEN = "your-jwt-token-here"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $AUTH_TOKEN"
}

# Sample form template data
$sampleTemplate = @{
    title = "Hair Consultation Form"
    description = "Pre-appointment consultation for hair services"
    type = "CONSULTATION"
    fields = @(
        @{
            name = "hair_type"
            label = "Hair Type"
            type = "select"
            required = $true
            options = @("Straight", "Wavy", "Curly", "Coily")
            orderIndex = 0
        },
        @{
            name = "previous_treatments"
            label = "Previous Hair Treatments"
            type = "textarea"
            required = $false
            placeholder = "Please describe any previous treatments..."
            validation = @{ maxLength = 500 }
            orderIndex = 1
        },
        @{
            name = "allergies"
            label = "Known Allergies"
            type = "textarea"
            required = $true
            placeholder = "List any known allergies..."
            orderIndex = 2
        }
    )
    isActive = $true
} | ConvertTo-Json -Depth 10

# Sample form submission data
$sampleSubmission = @{
    customerName = "John Doe"
    customerEmail = "john.doe@example.com"
    customerPhone = "+971501234567"
    responses = @(
        @{ fieldName = "hair_type"; value = "Curly" },
        @{ fieldName = "previous_treatments"; value = "Hair coloring 6 months ago" },
        @{ fieldName = "allergies"; value = "No known allergies" }
    )
    notes = "Customer prefers morning appointments"
} | ConvertTo-Json -Depth 10

function Test-FormsAPI {
    Write-Host "🚀 Starting Forms API Tests..." -ForegroundColor Green
    
    # Check if token is set
    if ($AUTH_TOKEN -eq "your-jwt-token-here") {
        Write-Host "❌ Please set your AUTH_TOKEN first!" -ForegroundColor Red
        Write-Host "1. Login to get JWT token"
        Write-Host "2. Replace AUTH_TOKEN in this script"
        return
    }

    try {
        # Test 1: Create Form Template
        Write-Host "`n📝 Test 1: Creating Form Template..." -ForegroundColor Yellow
        $createResponse = Invoke-RestMethod -Uri "$FORMS_URL/templates" -Method POST -Body $sampleTemplate -Headers $headers
        $templateId = $createResponse.id
        Write-Host "✅ Template created with ID: $templateId" -ForegroundColor Green

        # Test 2: Get Form Templates
        Write-Host "`n📋 Test 2: Getting Form Templates..." -ForegroundColor Yellow
        $templates = Invoke-RestMethod -Uri "$FORMS_URL/templates" -Method GET -Headers $headers
        Write-Host "✅ Found $($templates.total) templates" -ForegroundColor Green

        # Test 3: Get Public Template
        Write-Host "`n🌐 Test 3: Getting Public Template..." -ForegroundColor Yellow
        $publicHeaders = @{ "Content-Type" = "application/json" }
        $publicTemplate = Invoke-RestMethod -Uri "$FORMS_URL/public/$templateId" -Method GET -Headers $publicHeaders
        Write-Host "✅ Public template retrieved successfully" -ForegroundColor Green

        # Test 4: Submit Form
        Write-Host "`n📤 Test 4: Submitting Form..." -ForegroundColor Yellow
        $submitResponse = Invoke-RestMethod -Uri "$FORMS_URL/templates/$templateId/submit" -Method POST -Body $sampleSubmission -Headers $publicHeaders
        $submissionId = $submitResponse.id
        Write-Host "✅ Form submitted with ID: $submissionId" -ForegroundColor Green

        # Test 5: Get Submissions
        Write-Host "`n📥 Test 5: Getting Form Submissions..." -ForegroundColor Yellow
        $submissions = Invoke-RestMethod -Uri "$FORMS_URL/submissions" -Method GET -Headers $headers
        Write-Host "✅ Found $($submissions.total) submissions" -ForegroundColor Green

        # Test 6: Get Statistics
        Write-Host "`n📊 Test 6: Getting Form Statistics..." -ForegroundColor Yellow
        $stats = Invoke-RestMethod -Uri "$FORMS_URL/statistics" -Method GET -Headers $headers
        Write-Host "✅ Statistics: $($stats.totalTemplates) templates, $($stats.totalSubmissions) submissions" -ForegroundColor Green

        Write-Host "`n🎉 All tests completed successfully!" -ForegroundColor Green
        Write-Host "`nTemplate ID: $templateId"
        Write-Host "Submission ID: $submissionId"

    } catch {
        Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-AuthToken {
    Write-Host "🔐 Getting Auth Token..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "provider@example.com"  # Replace with actual email
        password = "password123"        # Replace with actual password
    } | ConvertTo-Json

    $loginHeaders = @{ "Content-Type" = "application/json" }

    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -Body $loginData -Headers $loginHeaders
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "🔑 Access Token: $($response.access_token)"
        Write-Host "`n📝 Copy this token and update AUTH_TOKEN variable"
        return $response.access_token
    } catch {
        Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-Instructions {
    Write-Host @"

🔧 FORMS API TESTING INSTRUCTIONS

1. Start Backend Server:
   cd backend
   npm run start:dev

2. Get Authentication Token:
   Get-AuthToken

3. Update AUTH_TOKEN:
   Replace 'your-jwt-token-here' with actual JWT token

4. Run Tests:
   Test-FormsAPI

📋 Quick Commands:

# Get auth token
Get-AuthToken

# Run full API tests
Test-FormsAPI

# Test individual endpoints:
`$headers = @{ "Authorization" = "Bearer YOUR_TOKEN"; "Content-Type" = "application/json" }

# Get templates
Invoke-RestMethod -Uri "http://localhost:3000/api/forms/templates" -Headers `$headers

# Get statistics
Invoke-RestMethod -Uri "http://localhost:3000/api/forms/statistics" -Headers `$headers

🌐 API Endpoints Available:
- POST   /api/forms/templates (Create template)
- GET    /api/forms/templates (Get templates)
- GET    /api/forms/public/:id (Get public template)
- POST   /api/forms/templates/:id/submit (Submit form)
- GET    /api/forms/submissions (Get submissions)
- GET    /api/forms/statistics (Get statistics)

"@ -ForegroundColor Cyan
}

# Main execution
Show-Instructions