@echo off
echo 🚀 Setting up Chat'bruti - The Delightfully Unhelpful Philosopher-Bot
echo ==============================================================

echo.
echo 📦 Setting up Python backend...
cd backend

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH.
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

:: Create virtual environment
python -m venv venv
if errorlevel 1 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)

:: Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed successfully!

echo.
echo 📦 Setting up React frontend...
cd ..\frontend

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)

:: Install Node.js dependencies
npm install

if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed successfully!

cd ..
echo.
echo 🎉 Setup complete!
echo ==============================================================
echo.
echo To run the application:
echo.
echo Option 1: Run both backend and frontend together:
echo    run_all.bat
echo.
echo Option 2: Run separately:
echo    1. Start backend:
echo       cd backend
echo       venv\Scripts\activate.bat
echo       python app.py
echo.
echo    2. Start frontend (in a new terminal):
echo       cd frontend
echo       npm start
echo.
echo 🌐 Application will be available at http://localhost:3000
echo 🔧 Backend API at http://localhost:5000
echo.
pause