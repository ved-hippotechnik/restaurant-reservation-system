#\!/bin/bash

echo "Starting Restaurant Reservation System..."

# Start frontend in new terminal
echo "Starting frontend in new terminal..."
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/frontend\" && npm start"'

# Wait a bit for frontend to start
sleep 3

# Start backend in new terminal
echo "Starting backend in new terminal..."
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/backend\" && mvn spring-boot:run"'

echo ""
echo "✅ Applications starting in separate terminals\!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo ""
echo "Close the terminal windows to stop the services"
EOF < /dev/null