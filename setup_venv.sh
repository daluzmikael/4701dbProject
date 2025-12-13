#!/bin/bash

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "Virtual environment created and dependencies installed!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run the backend, use:"
echo "  cd backend && python app.py"
echo ""
echo "To view the frontend, open frontend/index.html in your browser"

