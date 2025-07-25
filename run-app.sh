#\!/bin/bash

echo "Starting Restaurant Reservation System..."

# Check Java version
echo "Java version:"
java -version

# Start frontend
echo "Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$\!

# Wait for frontend to start
sleep 5

# Start backend
echo "Starting backend..."
cd ../backend
mvn spring-boot:run &
BACKEND_PID=$\!

echo ""
echo "✅ Application started\!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user interrupt
trap "kill $FRONTEND_PID $BACKEND_PID; exit" INT
wait
EOF < /dev/null