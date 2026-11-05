@echo off
title Stop DCC Portal
echo ==========================================================
echo   Stopping DCC Notes Portal Servers...
echo ==========================================================
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /F /FI "WINDOWTITLE eq DCC*" >nul 2>&1
echo Done! All portal services have stopped.
timeout /t 3 >nul
