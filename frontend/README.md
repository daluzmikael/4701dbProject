# Frontend Setup

This frontend can run standalone (with demo mode) or connect to a backend API.

## Running the Frontend Standalone

You can serve the frontend using a simple HTTP server:

### Option 1: Python HTTP Server
```bash
cd frontend
python3 -m http.server 8000
```
Then open: `http://localhost:8000` in your browser

### Option 2: Node.js HTTP Server
```bash
cd frontend
npx http-server -p 8000
```

### Option 3: VS Code Live Server
If you use VS Code, you can use the Live Server extension to serve the frontend.

## Demo Mode

When the backend is not available, the frontend automatically falls back to demo mode:
- Login with any customer ID will work (using demo data)
- Login with any employee ID will work (using demo data)
- Most pages will show mock data
- This allows you to test the UI without a backend connection

## Connecting to Your Partner's Backend

1. Open `app.js` in a text editor
2. Find the line: `const API_BASE = 'http://localhost:8000';`
3. Replace with your partner's backend URL, for example:
   - `'http://192.168.1.100:8000'` (if on same network)
   - `'http://your-partner-domain.com'` (if deployed)
   - Ask your partner for their backend URL and port

4. Save the file and refresh your browser

## Testing the Connection

Once you've updated the API_BASE:
1. Make sure your partner's backend is running
2. Open the frontend in your browser
3. Try logging in with a customer ID that exists in the database
4. Check the browser console (F12) for any connection errors

## Troubleshooting

- **CORS errors**: Your partner needs to enable CORS on their backend (should already be done with `flask-cors`)
- **Connection refused**: Check that:
  - Your partner's backend is running
  - The URL and port are correct
  - You're on the same network (if using IP address)
  - Firewall isn't blocking the connection

