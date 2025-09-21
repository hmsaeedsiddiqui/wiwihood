# Check Database Data via API
Write-Host "Checking services..." -ForegroundColor Green

try {
    $services = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/services" -Method GET
    Write-Host "✅ Services found!" -ForegroundColor Green
    Write-Host "Number of services: $($services.services.Count)" -ForegroundColor Cyan
    if ($services.services.Count -gt 0) {
        Write-Host "First service:" -ForegroundColor Yellow
        $services.services[0] | Select-Object id, name, providerId | ConvertTo-Json | Write-Host
    }
} catch {
    Write-Host "❌ Error getting services:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nChecking providers..." -ForegroundColor Green
try {
    $providers = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/providers" -Method GET
    Write-Host "✅ Providers found!" -ForegroundColor Green
    Write-Host "Number of providers: $($providers.providers.Count)" -ForegroundColor Cyan
    if ($providers.providers.Count -gt 0) {
        Write-Host "First provider:" -ForegroundColor Yellow
        $providers.providers[0] | Select-Object id, businessName | ConvertTo-Json | Write-Host
    }
} catch {
    Write-Host "❌ Error getting providers:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}