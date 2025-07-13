@echo off
echo Starting Personalized Ads Demo System...
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)...
echo If MongoDB is not running, please start it manually.
echo.

echo Starting Flask Backend...
cd backend
start "Flask Backend" cmd /k "python app.py"
cd ..

echo.
echo Starting React Frontend...
cd frontend
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul 