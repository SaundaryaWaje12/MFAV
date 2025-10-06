# Kill any existing Node processes
Write-Host "🔍 Checking for existing Node processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "⚠️  Found $($nodeProcesses.Count) Node process(es). Killing them..." -ForegroundColor Yellow
    Stop-Process -Name node -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Node processes killed" -ForegroundColor Green
} else {
    Write-Host "✅ No existing Node processes found" -ForegroundColor Green
}

# Check if port 5000 is free
Write-Host "`n🔍 Checking if port 5000 is available..." -ForegroundColor Cyan
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "⚠️  Port 5000 is in use by process ID: $($port5000.OwningProcess)" -ForegroundColor Yellow
    Write-Host "Attempting to kill process..." -ForegroundColor Yellow
    Stop-Process -Id $port5000.OwningProcess -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Process killed" -ForegroundColor Green
} else {
    Write-Host "✅ Port 5000 is available" -ForegroundColor Green
}

# Start the server
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Cyan
Write-Host "📂 Directory: $PWD" -ForegroundColor Gray
Write-Host "`n" -NoNewline

npm run dev