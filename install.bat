@echo off
echo ========================================
echo   CAI DAT WEB BAN CAN HO
echo ========================================
echo.
echo [1/3] Cai dat backend...
cd backend
call npm install
echo Khoi tao database...
call node db/setup.js
cd ..

echo.
echo [2/3] Cai dat frontend...
cd frontend
call npm install
cd ..

echo.
echo [3/3] Hoan tat!
echo.
echo Chay 'start.bat' de khoi dong website.
pause
