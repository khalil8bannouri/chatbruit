#!/bin/bash

echo "🚀 Setting up Chat'bruti - The Delightfully Unhelpful Philosopher-Bot"
echo "=============================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "📦 Setting up Python backend..."
cd backend

# Create virtual environment
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "❌ Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed successfully!"

echo ""
echo "📦 Setting up React frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed successfully!"

# Go back to project root
cd ..

echo ""
echo "🎉 Setup complete!"
echo "=============================================================="
echo ""
echo "To run the application:"
echo ""
echo "Option 1: Run both backend and frontend together:"
echo "   ./run_all.sh"
echo ""
echo "Option 2: Run separately:"
echo "   1. Start backend:"
echo "      cd backend"
echo "      source venv/bin/activate"
echo "      python app.py"
echo ""
echo "   2. Start frontend (in a new terminal):"
echo "      cd frontend"
echo "      npm start"
echo ""
echo "🌐 Application will be available at http://localhost:3000"
echo "🔧 Backend API at http://localhost:5000"
echo ""