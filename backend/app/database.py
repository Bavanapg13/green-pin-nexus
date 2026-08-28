import sqlite3
import os
from .data.generate_data import generate_synthetic_data

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "green_pin_nexus.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    # Only initialize if it doesn't exist
    if os.path.exists(DB_PATH):
        return

    conn = get_db()
    cursor = conn.cursor()

    # Create tables
    cursor.executescript("""
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            name TEXT,
            role TEXT,
            department TEXT,
            privilege_level TEXT,
            peer_group TEXT,
            working_hours TEXT
        );

        CREATE TABLE roles (
            id TEXT PRIMARY KEY,
            name TEXT,
            permissions TEXT
        );

        CREATE TABLE accounts (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            balance REAL,
            daily_limit REAL,
            status TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE beneficiaries (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            bank_details TEXT
        );

        CREATE TABLE transactions (
            id TEXT PRIMARY KEY,
            account_id TEXT,
            beneficiary_id TEXT,
            amount REAL,
            timestamp TEXT,
            status TEXT,
            FOREIGN KEY (account_id) REFERENCES accounts (id),
            FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries (id)
        );

        CREATE TABLE approvals (
            id TEXT PRIMARY KEY,
            transaction_id TEXT,
            approver_id TEXT,
            status TEXT,
            timestamp TEXT,
            FOREIGN KEY (transaction_id) REFERENCES transactions (id),
            FOREIGN KEY (approver_id) REFERENCES users (id)
        );

        CREATE TABLE tickets (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            issue TEXT,
            status TEXT,
            timestamp TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE incidents (
            id TEXT PRIMARY KEY,
            type TEXT,
            description TEXT,
            status TEXT,
            timestamp TEXT
        );

        CREATE TABLE events (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            action TEXT,
            timestamp TEXT,
            device_id TEXT,
            location TEXT,
            details TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE devices (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            type TEXT,
            last_used TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE risk_scores (
            user_id TEXT PRIMARY KEY,
            score REAL,
            category TEXT,
            breakdown TEXT,
            explanations TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE responses (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            action TEXT,
            timestamp TEXT,
            FOREIGN KEY (event_id) REFERENCES events (id)
        );

        CREATE TABLE analyst_feedback (
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

        CREATE TABLE demo_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            scenario TEXT,
            last_updated TEXT
        );
    """)

    conn.commit()
    conn.close()

    # Generate synthetic data
    generate_synthetic_data(DB_PATH)

def reset_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    init_db()
