# Backend API Requirements

This document lists all the API endpoints that need to be implemented in the backend for the frontend to work properly.

## Base URL
The frontend is configured to use: `http://localhost:5000`

Update the `API_BASE` constant in `frontend/app.js` if your backend runs on a different URL.

## Required Endpoints

### Customer Endpoints (Already Implemented)
- `GET /customer/:id` - Get customer by ID
- `POST /customer/register` - Create new customer
- `GET /customer/:id/history` - Get customer purchase history
- `DELETE /customer/:id` - Delete customer

### Vehicle Endpoints (Need Implementation)
- `POST /vehicles` - Get vehicles with filters
  - Request body: `{ brand_id?, model_id?, body_style?, year_from?, year_to?, max_mileage?, dealer_id?, sort_by? }`
  - Response: Array of vehicles with joins to Brand, Model, Dealer
  - Filter: Only vehicles where `sale_id IS NULL` (unsold)
  
- `GET /vehicle/:vin` - Get vehicle details by VIN
  - Response: Vehicle with joins to Brand, Model, Options, Dealer, Factory

### Dealer Endpoints (Need Implementation)
- `GET /dealers` - Get all dealers
  - Response: Array of dealers with current_stock and max_stock
  
- `GET /dealer/:id` - Get dealer details
  - Response: Dealer information
  
- `GET /dealer/:id/vehicles` - Get vehicles for a dealer
  - Response: Array of vehicles (unsold only)

### Brand Endpoints (Need Implementation)
- `GET /brands` - Get all brands
  - Response: Array of brands with optional Company name
  
- `GET /brand/:id` - Get brand details
  - Response: Brand info with related Models and available Vehicle counts

### Model Endpoints (Need Implementation)
- `GET /models` - Get all models
  - Response: Array of models (name, body_style)
  
- `GET /model/:id` - Get model details
  - Response: Model info with Options (weak entity) and available Vehicle counts

### Employee Endpoints (Need Implementation)
- `GET /employee/:id` - Get employee by ID
  - Response: Employee info with dealer_id
  
- `GET /employee/:id/dealer` - Get employee's dealer
  - Response: Dealer information for the employee
  
- `GET /employee/:id/sales` - Get sales for an employee
  - Response: Array of sales with Customer, Vehicle info

### Sale Endpoints (Need Implementation)
- `GET /sale/:id` - Get sale details
  - Response: Sale info with Customer, Vehicle, Employee
  
- `GET /sale/:id/payments` - Get payments for a sale
  - Response: Array of payments (weak entity by sale_id, payment_no)

## Data Structure Notes

### Vehicle Filtering
- Only return vehicles where `sale_id IS NULL` for customer browsing
- Employees can see all vehicles for their dealer (both sold and unsold)

### Joins Required
- Vehicle → Brand, Model, Dealer, Factory
- Sale → Customer, Vehicle, Employee
- Payment → Sale (weak entity)
- Options → Model (weak entity)
- Brand → Company
- Employee → Dealer

## Error Handling
All endpoints should return JSON with error messages:
```json
{
  "error": "Error message here"
}
```

Use appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## CORS
Ensure CORS is enabled for the frontend origin (likely `http://localhost:8000` or file://).

