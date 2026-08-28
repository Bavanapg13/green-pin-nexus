import sqlite3
import os
from .data.generate_data import generate_synthetic_data

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_PATH = "/tmp/green_pin_nexus.db"
else:
    DB_PATH = os.path.join(BASE_DIR, "green_pin_nexus.db")

def get_db():
    if not os.path.exists(DB_PATH):
        init_db()
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    # Check if database file exists before any connection creates it
    db_existed = os.path.exists(DB_PATH)

    conn = get_db()
    cursor = conn.cursor()

    # Create tables
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            role TEXT,
            department TEXT,
            privilege_level TEXT,
            peer_group TEXT,
            working_hours TEXT
        );

        CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            name TEXT,
            permissions TEXT
        );

        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            balance REAL,
            daily_limit REAL,
            status TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS beneficiaries (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            bank_details TEXT
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            account_id TEXT,
            beneficiary_id TEXT,
            amount REAL,
            timestamp TEXT,
            status TEXT,
            FOREIGN KEY (account_id) REFERENCES accounts (id),
            FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries (id)
        );

        CREATE TABLE IF NOT EXISTS approvals (
            id TEXT PRIMARY KEY,
            transaction_id TEXT,
            approver_id TEXT,
            status TEXT,
            timestamp TEXT,
            FOREIGN KEY (transaction_id) REFERENCES transactions (id),
            FOREIGN KEY (approver_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            issue TEXT,
            status TEXT,
            timestamp TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            type TEXT,
            description TEXT,
            status TEXT,
            timestamp TEXT
        );

        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            action TEXT,
            timestamp TEXT,
            device_id TEXT,
            location TEXT,
            details TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            type TEXT,
            last_used TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS risk_scores (
            user_id TEXT PRIMARY KEY,
            score REAL,
            category TEXT,
            breakdown TEXT,
            explanations TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS responses (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            action TEXT,
            timestamp TEXT,
            FOREIGN KEY (event_id) REFERENCES events (id)
        );

        CREATE TABLE IF NOT EXISTS analyst_feedback (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            user_id TEXT,
            analyst TEXT,
            verdict TEXT,
            notes TEXT,
            timestamp TEXT,
            FOREIGN KEY (event_id) REFERENCES events (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS demo_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            scenario TEXT,
            last_updated TEXT
        );

        CREATE TABLE IF NOT EXISTS supervisors (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            name TEXT,
            role TEXT,
            password_hash TEXT
        );

        CREATE TABLE IF NOT EXISTS login_attempts (
            email TEXT PRIMARY KEY,
            attempts INTEGER DEFAULT 0,
            last_attempt TEXT,
            locked_until TEXT
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            supervisor_id TEXT,
            action TEXT,
            target TEXT,
            timestamp TEXT,
            details TEXT
        );
    """)

    conn.commit()

    # Seed supervisor if supervisors table is empty
    cursor.execute("SELECT COUNT(*) FROM supervisors")
    if cursor.fetchone()[0] == 0:
        import bcrypt
        pw_hash = bcrypt.hashpw(b"Demo@2026", bcrypt.gensalt()).decode('utf-8')
        cursor.execute("""
            INSERT INTO supervisors (id, email, name, role, password_hash)
            VALUES (?, ?, ?, ?, ?)
        """, ("SUP-001", "supervisor@greenpinnexus.local", "Ananya Rao", "Security Supervisor", pw_hash))
        conn.commit()

    conn.close()

    # Generate synthetic data if the database didn't exist before
    if not db_existed:
        generate_synthetic_data(DB_PATH)

def reset_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    init_db()
