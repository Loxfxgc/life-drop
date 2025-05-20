#!/bin/bash

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$DIR")"

# Check if http-server is installed
if ! command -v npx &> /dev/null || ! npx --no-install http-server --version &> /dev/null; then
    echo "Installing http-server..."
    npm install --global http-server
fi

# Start http-server in the background
echo "Starting local server..."
npx http-server "$PARENT_DIR" -p 8080 &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Open the role updater in the default browser
echo "Opening role updater in browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:8080/user-role-updater.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:8080/user-role-updater.html"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows with Git Bash or Cygwin
    start "http://localhost:8080/user-role-updater.html"
else
    echo "Could not detect OS for browser opening. Please manually visit:"
    echo "http://localhost:8080/user-role-updater.html"
fi

echo "Press Ctrl+C to stop the server when you're done."

# Wait for Ctrl+C
trap "kill $SERVER_PID; echo 'Server stopped.'; exit 0" INT
wait 