# Setup Instructions for Group Members

This guide will help you get the application running on your machine.

## Prerequisites

- Python 3.7+ installed
- Oracle Database installed and running (for backend)
- Git (to clone the repository)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd 4701dbProject
```

## Step 2: Set Up Python Environment

### Option A: Automated Setup (Recommended)
```bash
chmod +x setup_venv.sh
./setup_venv.sh
```

### Option B: Manual Setup
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Step 3: Configure Oracle Database (Backend Only)

If you're running the backend, update the database connection in `backend/app.py`:

```python
DB_USER = "your_username"
DB_PASS = "your_password"
DB_HOST = "localhost"
DB_PORT = 1521
DB_SERVICE = "YOUR_SERVICE_NAME"  # e.g., "FREE", "XEPDB1", etc.
```

## Step 4: Run the Application

### To Run Both Backend and Frontend:

1. **Terminal 1 - Start Backend:**
   ```bash
   source venv/bin/activate  # If not already activated
   cd backend
   python app.py
   ```
   You should see: `Running on http://0.0.0.0:8000`

2. **Terminal 2 - Start Frontend:**
   ```bash
   cd frontend
   python3 -m http.server 8001
   ```
   Or use the script:
   ```bash
   cd frontend
   chmod +x start_server.sh
   ./start_server.sh
   ```

3. **Open Browser:**
   - Go to `http://localhost:8001`
   - The frontend will automatically connect to the backend at `http://localhost:8000`

### To Run Frontend Only (Demo Mode):

If you don't have Oracle Database or just want to see the UI:

```bash
cd frontend
python3 -m http.server 8001
```

Then open `http://localhost:8001` in your browser. The frontend will work with demo/mock data.

## Troubleshooting

### Port Already in Use
If port 8000 or 8001 is already in use, you can:
- Kill the process using the port: `lsof -ti:8000 | xargs kill -9`
- Or change the port in the code

### Backend Won't Start
- Check that Oracle Database is running
- Verify database credentials in `backend/app.py`
- Make sure the virtual environment is activated

### Frontend Can't Connect to Backend
- Verify backend is running on port 8000
- Check browser console (F12) for errors
- Ensure `API_BASE` in `frontend/app.js` points to correct URL

### CORS Errors
- The backend has CORS enabled, so this shouldn't happen
- If it does, check that the backend is running and accessible

## Default Configuration

- **Backend URL**: `http://localhost:8000`
- **Frontend URL**: `http://localhost:8001`
- **Backend Port**: 8000
- **Frontend Port**: 8001

## Need Help?

- Check the main `README.md` for more details
- Review `BACKEND_API_REQUIREMENTS.md` for API documentation
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors

