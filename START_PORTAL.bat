@echo off
title District Computer Centre - Notes Portal
cd /d "C:\Users\Bidyut\Desktop\dcc notes web"

echo ================================================================
echo        DISTRICT COMPUTER CENTRE, TINSUKIA - NOTES PORTAL
echo ================================================================
echo.
echo [1/3] Verifying Node.js environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found. Please install Node.js.
    pause
    exit /b 1
)

echo [2/3] Launching Next.js Production Web Server...
start "DCC Next.js Server" /min cmd /c "npm run start"
timeout /t 3 /nobreak >nul

echo [3/3] Launching Ngrok Mobile Tunnel...
start "DCC Ngrok Tunnel" /min cmd /c "node start-ngrok.js"
timeout /t 3 /nobreak >nul

echo.
echo ================================================================
echo               PORTAL IS NOW LIVE & RUNNING!
echo ================================================================
echo.
echo   * Local PC Access:    http://localhost:3000
echo   * Mobile Phone Access: https://sanction-mummy-paragraph.ngrok-free.dev
echo   * Admin Dashboard:    http://localhost:3000/admin/login
echo.
echo Opening portal in your default browser...
start http://localhost:3000
echo ================================================================
echo   Keep this window open while using the portal.
echo   Press ANY KEY to gracefully STOP the portal when finished.
echo ================================================================
pause >nul

echo.
echo Shutting down DCC Portal and Ngrok tunnel...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /F /FI "WINDOWTITLE eq DCC*" >nul 2>&1
echo Done! All services have been stopped safely.
timeout /t 2 >nul
