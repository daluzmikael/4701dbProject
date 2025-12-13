from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
import oracledb
from datetime import datetime
import os

# Get the project root directory (parent of backend)
# __file__ is the path to this file (app.py)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)  # Go up one level from backend/
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__)
# Enable CORS for all origins (development)
# In production, specify allowed origins
CORS(app, resources={r"/*": {"origins": "*"}})

# -----------------------------
# ORACLE CONNECTION SETTINGS
# -----------------------------
DB_USER = "system"
DB_PASS = "kk90211"
DB_HOST = "localhost"
DB_PORT = 1521
DB_SERVICE = "FREE"

# -----------------------------
# DB helpers (THIN MODE)
# -----------------------------
def get_db():
    if "db" not in g:
        g.db = oracledb.connect(
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT,
            service_name=DB_SERVICE
        )
    return g.db


@app.teardown_appcontext
def close_db(e):
    db = g.pop("db", None)
    if db:
        db.close()


def q(query, params=(), one=False):
    cur = get_db().cursor()
    cur.execute(query, params)
    rows = [
        dict(zip([c[0] for c in cur.description], r))
        for r in cur.fetchall()
    ]
    cur.close()
    return rows[0] if one and rows else rows


# =============================
# CUSTOMER ROUTES
# =============================
@app.route("/customer/register", methods=["POST"])
def customer_register():
    try:
        d = request.json
        if not d:
            return jsonify({"error": "No data provided"}), 400
        
        conn = get_db()
        cur = conn.cursor()

        # holder for generated customer_id
        new_customer_id = cur.var(oracledb.NUMBER)

        # Insert customer (ID auto-generated)
        cur.execute("""
            INSERT INTO Customer (
                customer_id, first, middle_i, last,
                street, city, state, zip_code,
                gender, income, marital_status, dependents,
                date_of_birth, license_num, cred_score, SSN
            )
            VALUES (
                customer_seq.NEXTVAL,
                :1, :2, :3,
                :4, :5, :6, :7,
                :8, :9, :10, :11,
                :12, :13, :14, :15
            )
            RETURNING customer_id INTO :16
        """, (
            d["first"],
            d.get("middle_i"),
            d["last"],
            d["street"],
            d["city"],
            d["state"],
            d["zip_code"],
            d.get("gender"),
            d.get("income"),
            d.get("marital_status"),
            d.get("dependents"),
            datetime.strptime(d["date_of_birth"], "%Y-%m-%d").date(),
            d["license_num"],
            d.get("cred_score"),
            d.get("SSN"),
            new_customer_id
        ))

        customer_id = int(new_customer_id.getvalue()[0])

        # Insert phone number if provided
        if d.get("phone_number"):
            cur.execute("""
                INSERT INTO CustomerPhone (customer_id, phone_number)
                VALUES (:1, :2)
            """, (customer_id, d["phone_number"]))

        conn.commit()
        cur.close()

        return jsonify({
            "message": "customer created",
            "customer_id": customer_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/<int:cid>", methods=["GET"])
def customer_get(cid):
    try:
        cust = q("SELECT * FROM Customer WHERE customer_id=:1", (cid,), one=True)
        if not cust:
            return jsonify({"error": "Customer not found"}), 404

        phones = q(
            "SELECT phone_number FROM CustomerPhone WHERE customer_id=:1",
            (cid,)
        )
        cust["PHONES"] = phones
        return jsonify(cust)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/<int:cid>", methods=["DELETE"])
def customer_delete(cid):
    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("DELETE FROM CustomerPhone WHERE customer_id=:1", (cid,))
        cur.execute("DELETE FROM Customer WHERE customer_id=:1", (cid,))

        conn.commit()
        cur.close()

        return jsonify({"message": "customer deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/customer/<int:cid>/history", methods=["GET"])
def customer_history(cid):
    try:
        rows = q("""
            SELECT s.sale_id, s.sale_date, s.sale_price,
                   v.vin, v.model_year, v.mileage
            FROM Sale s
            JOIN Vehicle v ON s.sale_id = v.sale_id
            WHERE s.customer_id = :1
            ORDER BY s.sale_date DESC
        """, (cid,))
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# FRONTEND ROUTES (serve static files - must be last)
# -----------------------------
@app.route("/")
def index():
    """Serve the main frontend page"""
    try:
        return send_from_directory(FRONTEND_DIR, 'index.html')
    except Exception as e:
        return f"Error serving index.html: {str(e)}<br>FRONTEND_DIR: {FRONTEND_DIR}", 500

@app.route("/app.js")
def serve_app_js():
    """Serve the JavaScript file"""
    try:
        return send_from_directory(FRONTEND_DIR, 'app.js')
    except Exception as e:
        return f"Error serving app.js: {str(e)}", 500

@app.route("/<path:path>")
def serve_static(path):
    """Serve static files or fallback to index.html for SPA routing"""
    # List of API route prefixes - don't serve as static files
    api_prefixes = ['customer/', 'vehicle/', 'dealer/', 'brand/', 'model/', 'employee/', 'sale/']
    
    # Check if it's an API route
    if any(path.startswith(prefix) for prefix in api_prefixes):
        return jsonify({"error": "Not found"}), 404
    
    # Check if it's a known API endpoint (plural forms)  
    if path in ['vehicles', 'dealers', 'brands', 'models']:
        return jsonify({"error": "Not found"}), 404
    
    # Try to serve as static file first
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        try:
            return send_from_directory(FRONTEND_DIR, path)
        except Exception as e:
            return f"Error serving file: {str(e)}", 500
    
    # For SPA routing (any route not matching above), serve index.html
    # This allows the frontend router to handle the route
    try:
        return send_from_directory(FRONTEND_DIR, 'index.html')
    except Exception as e:
        return f"Error serving index.html: {str(e)}", 500


# -----------------------------
# RUN APP
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
