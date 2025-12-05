#!/bin/bash

echo "🚀 Starting Chat'bruti..."
echo "=============================================================="

# Function to clean up processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Check if backend is already running
if lsof -ti:5000 &> /dev/null; then
    echo "⚠️  Port 5000 is already in use. Trying to kill existing process..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Check if frontend is already running
if lsof -ti:3000 &> /dev/null; then
    echo "⚠️  Port 3000 is already in use. Trying to kill existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "Starting backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 3

echo ""
echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "=============================================================="
echo "🎉 Chat'bruti is now running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=============================================================="

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID