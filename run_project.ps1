# VibeFrame One-Click Start Script

Write-Host "Setting up VibeFrame..." -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
cd backend
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install backend dependencies."
    exit $LASTEXITCODE
}
cd ..

# 2. Frontend Setup
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
cd frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install frontend dependencies."
    exit $LASTEXITCODE
}
cd ..

# 3. Start Servers
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "VibeFrame is running!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
