import sqlite3
import random
from datetime import datetime, timedelta
import json

def generate_synthetic_data(db_path: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    random.seed(42)
    
    # 1. Generate Roles
    roles = [
        ("Payment Administrator", "HIGH"),
        ("Senior Payment Administrator", "HIGH"),
        ("Finance Operations Analyst", "MEDIUM"),
        ("Finance Manager", "HIGH"),
        ("Database Administrator", "HIGH"),
        ("System Administrator", "HIGH"),
        ("Security Administrator", "HIGH"),
        ("Compliance Officer", "MEDIUM"),
        ("Treasury Analyst", "MEDIUM"),
        ("Payment Approver", "HIGH"),
        ("IT Support Administrator", "MEDIUM"),
        ("Cloud Administrator", "HIGH"),
        ("Risk Analyst", "MEDIUM"),
        ("Operations Manager", "HIGH"),
        ("Service Account Manager", "MEDIUM")
    ]
    
    for i, (r_name, priv) in enumerate(roles):
        cursor.execute("INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)", 
                      (f"ROLE-{i+1:03}", r_name, priv))
    
    # 2. Generate Users
    first_names = ["Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Atharv",
                   "Ananya", "Diya", "Aditi", "Priya", "Riya", "Aanya", "Kavya", "Sneha", "Neha", "Isha"]
    last_names = ["Sharma", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Gupta", "Deshmukh", "Joshi", "Nair"]
    
    users = []
    
    # Critical EMP-1042
    cursor.execute("""
        INSERT INTO users (id, name, role, department, privilege_level, peer_group, working_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, ("EMP-1042", "Arun Kumar", "Senior Payment Administrator", "Payment Operations", "HIGH", "PAYMENT_ADMIN", "09:00-18:00"))
    users.append("EMP-1042")
    
    # Critical EMP-1098
    cursor.execute("""
        INSERT INTO users (id, name, role, department, privilege_level, peer_group, working_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, ("EMP-1098", "Priya Sharma", "Database Administrator", "IT Operations", "HIGH", "DB_ADMIN", "09:00-18:00"))
    users.append("EMP-1098")
    
    for i in range(1, 99):
        uid = f"EMP-{1000+i:04}"
        if uid in ["EMP-1042", "EMP-1098"]:
            continue
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        r_name, priv = random.choice(roles)
        dept = "Operations" if "Administrator" not in r_name else "IT Operations"
        pg = "GENERAL"
        
        cursor.execute("""
            INSERT INTO users (id, name, role, department, privilege_level, peer_group, working_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (uid, name, r_name, dept, priv, pg, "09:00-18:00"))
        users.append(uid)
        
    # 3. Generate Accounts
    accounts = []
    for i in range(200):
        aid = f"ACC-{5000+i:04}"
        uid = random.choice(users)
        cursor.execute("INSERT INTO accounts (id, user_id, balance, daily_limit, status) VALUES (?, ?, ?, ?, ?)",
                      (aid, uid, random.uniform(10000, 1000000), 50000, "ACTIVE"))
        accounts.append(aid)
        
    # 4. Generate Beneficiaries
    beneficiaries = []
    for i in range(150):
        bid = f"BEN-{700+i:04}"
        name = f"Vendor {i}"
        btype = random.choice(["DOMESTIC", "INTERNATIONAL"])
        cursor.execute("INSERT INTO beneficiaries (id, name, type, bank_details) VALUES (?, ?, ?, ?)",
                      (bid, name, btype, "BANK_DETAILS_HERE"))
        beneficiaries.append(bid)
        
    # Ensure BEN-0771 exists for Scenario 1
    cursor.execute("INSERT OR IGNORE INTO beneficiaries (id, name, type, bank_details) VALUES (?, ?, ?, ?)",
                   ("BEN-0771", "Suspicious Vendor", "INTERNATIONAL", "BANK_DETAILS_HERE"))
    if "BEN-0771" not in beneficiaries: beneficiaries.append("BEN-0771")
    
    # 5. Generate Normal Transactions, Approvals, Events
    base_time = datetime.now() - timedelta(days=30)
    
    for i in range(2000):
        tid = f"TXN-{1000+i:04}"
        aid = random.choice(accounts)
        bid = random.choice(beneficiaries)
        amt = random.uniform(5000, 50000)
        t_time = base_time + timedelta(minutes=random.randint(1, 40000))
        
        cursor.execute("INSERT INTO transactions (id, account_id, beneficiary_id, amount, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)",
                      (tid, aid, bid, amt, t_time.isoformat(), "COMPLETED"))
        
        if random.random() < 0.1: # Some need approval
            cursor.execute("INSERT INTO approvals (id, transaction_id, approver_id, status, timestamp) VALUES (?, ?, ?, ?, ?)",
                          (f"APP-{1000+i:04}", tid, random.choice(users), "APPROVED", (t_time + timedelta(minutes=5)).isoformat()))
            
    # Regular events
    for i in range(5000):
        eid = f"EVT-{10000+i:05}"
        uid = random.choice(users)
        t_time = base_time + timedelta(minutes=random.randint(1, 40000))
        action = random.choice(["LOGIN", "VIEW_ACCOUNT", "INITIATE_PAYMENT", "LOGOUT"])
        cursor.execute("INSERT INTO events (id, user_id, action, timestamp, device_id, location, details) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      (eid, uid, action, t_time.isoformat(), f"LAPTOP-{random.randint(100,999)}", "Mumbai HQ", "{}"))

    # Generate Devices
    for uid in users:
        for i in range(2):
            cursor.execute("INSERT INTO devices (id, user_id, type, last_used) VALUES (?, ?, ?, ?)",
                           (f"LAPTOP-{uid}-{random.randint(100,999)}-{i}", uid, "LAPTOP", base_time.isoformat()))
                      
    # Tickets and Incidents
    for i in range(50):
        cursor.execute("INSERT INTO tickets (id, user_id, issue, status, timestamp) VALUES (?, ?, ?, ?, ?)",
                      (f"TKT-{5000+i:04}", random.choice(users), "General Support", "CLOSED", base_time.isoformat()))
    
    for i in range(25):
        cursor.execute("INSERT INTO incidents (id, type, description, status, timestamp) VALUES (?, ?, ?, ?, ?)",
                      (f"INC-{1000+i:04}", "SYSTEM", "Minor Outage", "RESOLVED", base_time.isoformat()))

    # CRITICAL SCENARIO 1: Compromised Account (EMP-1042)
    s1_time = datetime.now().replace(hour=11, minute=42, second=0, microsecond=0)
    events_s1 = [
        ("EVT-C1-01", "EMP-1042", "LOGIN", s1_time, "LAPTOP-1042", "Mumbai HQ", {}),
        ("EVT-C1-02", "EMP-1042", "BENEFICIARY_MODIFIED", s1_time + timedelta(minutes=2), "LAPTOP-1042", "Mumbai HQ", {"beneficiary_id": "BEN-0771"}),
        ("EVT-C1-03", "EMP-1042", "TRANSACTION_LIMIT_CHANGED", s1_time + timedelta(minutes=4), "LAPTOP-1042", "Mumbai HQ", {"account_id": "ACC-5521", "new_limit": 1000000}),
        ("EVT-C1-04", "EMP-1042", "PAYMENT_INITIATED", s1_time + timedelta(minutes=7), "LAPTOP-1042", "Mumbai HQ", {"transaction_id": "TXN-9281", "amount": 850000, "beneficiary_id": "BEN-0771"}),
    ]
    for eid, uid, act, ts, dev, loc, det in events_s1:
        cursor.execute("INSERT INTO events (id, user_id, action, timestamp, device_id, location, details) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      (eid, uid, act, ts.isoformat(), dev, loc, json.dumps(det)))
    cursor.execute("INSERT OR IGNORE INTO accounts (id, user_id, balance, daily_limit, status) VALUES (?, ?, ?, ?, ?)",
                   ("ACC-5521", "EMP-1042", 2000000, 1000000, "ACTIVE"))
    cursor.execute("INSERT INTO transactions (id, account_id, beneficiary_id, amount, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)",
                   ("TXN-9281", "ACC-5521", "BEN-0771", 850000, (s1_time + timedelta(minutes=7)).isoformat(), "PENDING"))
                   
    # CRITICAL SCENARIO 2: Legitimate Emergency (EMP-1098)
    s2_time = datetime.now().replace(hour=2, minute=15, second=0, microsecond=0)
    events_s2 = [
        ("EVT-C2-01", "EMP-1098", "LOGIN", s2_time, "ADMIN-WS-01", "Remote", {}),
        ("EVT-C2-02", "EMP-1098", "DATABASE_QUERY", s2_time + timedelta(minutes=3), "ADMIN-WS-01", "Remote", {"query": "SELECT *", "rows": 10000}),
        ("EVT-C2-03", "EMP-1098", "DATABASE_QUERY", s2_time + timedelta(minutes=7), "ADMIN-WS-01", "Remote", {"query": "UPDATE", "rows": 5000}),
        ("EVT-C2-04", "EMP-1098", "PERMISSION_CHANGED", s2_time + timedelta(minutes=10), "ADMIN-WS-01", "Remote", {"target": "SYSTEM_USER"}),
    ]
    for eid, uid, act, ts, dev, loc, det in events_s2:
        cursor.execute("INSERT INTO events (id, user_id, action, timestamp, device_id, location, details) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      (eid, uid, act, ts.isoformat(), dev, loc, json.dumps(det)))
    cursor.execute("INSERT INTO tickets (id, user_id, issue, status, timestamp) VALUES (?, ?, ?, ?, ?)",
                   ("TKT-5567", "EMP-1098", "DATABASE FAILOVER", "OPEN", s2_time.isoformat()))
    cursor.execute("INSERT INTO incidents (id, type, description, status, timestamp) VALUES (?, ?, ?, ?, ?)",
                   ("INC-1029", "DATABASE", "Primary DB Down", "ACTIVE", s2_time.isoformat()))

    # Initialize demo state
    cursor.execute("INSERT OR IGNORE INTO demo_state (id, scenario, last_updated) VALUES (1, 'normal', ?)", (datetime.now().isoformat(),))
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    generate_synthetic_data("../green_pin_nexus.db")
