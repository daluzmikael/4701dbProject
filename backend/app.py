from flask import Flask, request, jsonify, g
from flask_cors import CORS
import oracledb
from datetime import datetime

app = Flask(__name__)
CORS(app)

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


def e(query, params=()):
    cur = get_db().cursor()
    cur.execute(query, params)
    get_db().commit()
    cur.close()


# -----------------------------
# HOME
# -----------------------------
@app.route("/")
def home():
    return "Car Sales API Running (DDL-Matched)"


# =============================
# CUSTOMER ROUTES
# =============================
@app.route("/customer/register", methods=["POST"])
def customer_register():
    d = request.json

    # Insert into CUSTOMER table
    e("""
        INSERT INTO Customer (
            customer_id, first, middle_i, last,
            street, city, state, zip_code,
            gender, income, marital_status, dependents,
            date_of_birth, license_num, cred_score, SSN
        )
        VALUES (
            :1, :2, :3, :4,
            :5, :6, :7, :8,
            :9, :10, :11, :12,
            TO_DATE(:13, 'YYYY-MM-DD'),
            :14, :15, :16
        )
    """, (
        d["customer_id"],
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
        d["date_of_birth"],
        d["license_num"],
        d.get("cred_score"),
        d.get("SSN")
    ))

    # Insert phone(s) if provided
    if d.get("phone_number"):
        e("""
            INSERT INTO CustomerPhone (customer_id, phone_number)
            VALUES (:1, :2)
        """, (d["customer_id"], d["phone_number"]))

    return {"message": "customer created"}


@app.route("/customer/<int:cid>", methods=["GET"])
def customer_get(cid):
    cust = q("SELECT * FROM Customer WHERE customer_id = :1", (cid,), one=True)
    phones = q("SELECT phone_number FROM CustomerPhone WHERE customer_id = :1", (cid,))
    if not cust:
        return ("not found", 404)
    cust["PHONES"] = phones
    return jsonify(cust)


@app.route("/customer/<int:cid>", methods=["DELETE"])
def customer_delete(cid):
    e("DELETE FROM CustomerPhone WHERE customer_id=:1", (cid,))
    e("DELETE FROM Customer WHERE customer_id=:1", (cid,))
    return {"message": "deleted"}


@app.route("/customer/<int:cid>/history", methods=["GET"])
def customer_history(cid):
    rows = q("""
        SELECT s.sale_id, s.sale_date, s.sale_price,
               v.vin, v.model_year, v.mileage
        FROM Sale s
        JOIN Vehicle v ON s.sale_id = v.sale_id
        WHERE s.customer_id = :1
    """, (cid,))
    return jsonify(rows)


# -----------------------------
# Run app
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
