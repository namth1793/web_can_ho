@echo off
echo ========================================
echo   KHOI DONG WEB BAN CAN HO
echo ========================================
echo.
echo Backend : http://localhost:5021
echo Frontend: http://localhost:5174
echo.
start cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Da mo 2 cua so lenh.
echo Truy cap: http://localhost:5174
pause
