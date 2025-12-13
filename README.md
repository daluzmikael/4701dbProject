# Car Sales Application

## Project Structure

```
project/
├── backend/           # Flask backend application
│   └── app.py        # Main backend server
├── frontend/          # Frontend HTML/JavaScript
│   ├── index.html    # Main frontend interface (SPA)
│   └── app.js        # Frontend application logic and routing
├── database/          # Database-related files
│   ├── rel_sch.sql   # Relational schema SQL
│   └── carsales.erd.json  # ERD diagram
├── docs/              # Documentation
│   ├── CSE_4701_Project (1).pdf
│   └── Topics.pdf
├── venv/              # Virtual environment (created by setup)
├── requirements.txt   # Python dependencies
├── setup_venv.sh      # Setup script
├── BACKEND_API_REQUIREMENTS.md  # API endpoints needed for frontend
└── README.md          # This file
```

## Setup

### Option 1: Automated Setup (Recommended)
Run the setup script:
```bash
./setup_venv.sh
```

### Option 2: Manual Setup
1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## Running the Application

### Quick Start (Both Backend and Frontend)

1. **Activate the virtual environment** (if not already activated):
   ```bash
   source venv/bin/activate
   ```

2. **Start the backend server** (Terminal 1):
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:8000`
   - Make sure Oracle Database is running and configured in `backend/app.py`

3. **Start the frontend server** (Terminal 2 - new terminal window):
   ```bash
   cd frontend
   python3 -m http.server 8001
   ```
   Or use the provided script:
   ```bash
   cd frontend
   ./start_server.sh
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:8001` (or `http://localhost:8000` if using the script)
   - The frontend is pre-configured to connect to the backend at `http://localhost:8000`

### Running Frontend Only (Demo Mode)

If you just want to see the frontend UI without the backend:
```bash
cd frontend
python3 -m http.server 8001
```
Then open `http://localhost:8001` in your browser. The frontend will work in demo mode with mock data.

## Deactivating the Virtual Environment

When you're done, deactivate the virtual environment:
```bash
deactivate
```

## Frontend Features

The frontend is a single-page application (SPA) with the following features:

### Customer-Facing Pages
- **Login / Create Account** - Customer authentication
- **Browse Vehicles** - View available inventory with filters (Brand, Model, Body Style, Year, Mileage, Dealer)
- **Vehicle Details** - Detailed view of a vehicle with options
- **Dealers** - List of all dealers with stock information
- **Dealer Detail** - Dealer information and their available vehicles
- **Brands** - List of all brands
- **Brand Detail** - Brand information with models and vehicle counts
- **Models** - List of all models
- **Model Detail** - Model information with options and available vehicles
- **My Account** - Customer profile information
- **My Purchases** - Purchase history with links to sale details
- **Sale Detail / Payments** - Detailed sale information and payment breakdown

### Employee-Facing Pages
- **Employee Login** - Employee authentication
- **Employee Dashboard** - KPIs and quick actions
- **Inventory (My Dealer)** - View all vehicles for employee's dealer (sold/unsold)
- **Vehicle Detail (Admin)** - Vehicle details with sale information
- **Customers** - Search and browse customers (read-only)
- **Sales (My Dealer)** - List of sales with customer and vehicle info
- **Sale Detail / Payments** - Detailed sale and payment information

## Backend API Requirements

See `BACKEND_API_REQUIREMENTS.md` for a complete list of API endpoints that need to be implemented in the backend for the frontend to work fully.

**Note:** The frontend currently uses mock data for some features. Once the backend endpoints are implemented, update the `API_BASE` constant in `frontend/app.js` to point to your backend URL.

## Configuration

### Backend Configuration
- The backend runs on port **8000** by default
- Database connection settings are in `backend/app.py` (lines 19-23)
- Update the Oracle connection settings if needed:
  ```python
  DB_USER = "system"
  DB_PASS = "your_password"
  DB_HOST = "localhost"
  DB_PORT = 1521
  DB_SERVICE = "FREE"  # Change to match your Oracle service name
  ```

### Frontend Configuration
- The frontend is configured to connect to `http://localhost:8000` by default
- To change the backend URL, edit `frontend/app.js` (line 15):
  ```javascript
  const API_BASE = 'http://localhost:8000'; // Change if backend is on different machine/port
  ```

## Notes

- **Oracle Database Required**: The backend requires Oracle Database to be installed and running
- **Ports**: 
  - Backend: Port 8000
  - Frontend: Port 8001 (or 8000 if using start_server.sh)
- **Demo Mode**: The frontend can run without the backend using demo mode (see "Running Frontend Only" above)
- **Database Connection**: If you encounter database connection errors:
  - Ensure Oracle Database is running
  - Verify connection settings in `backend/app.py`
  - Check that the service name matches your Oracle installation

