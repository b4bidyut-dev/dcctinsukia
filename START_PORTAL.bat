@echo off
title DCC Tinsukia Notes Portal
cd /d "%~dp0"

echo ==========================================================
echo       DISTRICT COMPUTER CENTRE, TINSUKIA - NOTES PORTAL
echo ==========================================================
echo.
echo 1. Checking Node.js environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found. Please ensure Node.js is installed.
    pause
    exit /b 1
)

echo 2. Starting Next.js Server on Port 3000...
start "DCC Next.js Server" /min cmd /c "npm run start"
timeout /t 3 /nobreak >nul

echo 3. Launching Ngrok Mobile Tunnel...
start "DCC Ngrok Tunnel" /min cmd /c "node start-ngrok.js"
timeout /t 3 /nobreak >nul

echo.
echo ==========================================================
echo   PORTAL LAUNCHED SUCCESSFULLY!
echo ==========================================================
echo   Local PC:    http://localhost:3000
echo   Mobile URL:  https://sanction-mummy-paragraph.ngrok-free.dev
echo   Admin Login: https://sanction-mummy-paragraph.ngrok-free.dev/admin/login
echo.
echo Opening browser...
start http://localhost:3000
echo ==========================================================
echo You can keep this window minimized while the portal runs.
pause
