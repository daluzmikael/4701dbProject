#!/bin/bash
# Start the frontend server accessible from the network
# Note: Uses port 8001 to avoid conflict with backend on port 8000

PORT=8001
cd "$(dirname "$0")"

echo "Starting frontend server on port $PORT..."
echo "Frontend will be accessible at:"
echo "  - http://localhost:$PORT (from this machine)"
echo "  - http://$(hostname -I | awk '{print $1}' 2>/dev/null || ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):$PORT (from other machines on your network)"
echo ""
echo "Make sure the backend is running on port 8000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server $PORT

