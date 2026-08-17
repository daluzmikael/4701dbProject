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

1. **Activate the virtual environment** (if not already activated):
   ```bash
   source venv/bin/activate
   ```

2. **Start the backend server**:
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:5001`

3. **Open the frontend**:
   - Open `frontend/index.html` in your web browser
   - Or use a simple HTTP server:
     ```bash
     cd frontend
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your browser

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

