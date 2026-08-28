import sqlite3
import json
from datetime import datetime
from ..database import get_db, reset_db

class DemoService:
    def __init__(self):
        pass

    def get_current_scenario(self) -> str:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT scenario FROM demo_state WHERE id = 1")
        row = cursor.fetchone()
        conn.close()
        return row['scenario'] if row else 'normal'
        
    def _set_scenario(self, scenario: str):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO demo_state (id, scenario, last_updated) VALUES (1, ?, ?)",
                       (scenario, datetime.now().isoformat()))
        conn.commit()
        conn.close()
        
    def _recalculate_risks(self, scenario: str):
        conn = get_db()
        cursor = conn.cursor()
        
        # Clear old scores
        cursor.execute("DELETE FROM risk_scores")
        
        # Get all users
        cursor.execute("SELECT id, name, role, privilege_level FROM users")
        users = cursor.fetchall()
        
        for u in users:
            uid = u['id']
            
            if scenario in ['attack', 'compromised'] and uid == 'EMP-1042':
                # Critical attack scenario for Arun Kumar
                score = 96.5
                category = "CRITICAL"
                breakdown = {
                    "behavioral": 88.0,
                    "sequence": 98.0,
                    "relationship": 85.0,
                    "financial": 95.0,
                    "privilege": 90.0,
                    "context": 95.0,
                    "ml": 82.0
                }
                explanations = [
                    "Transaction amount (₹8,50,000) is 17x above user's normal baseline (₹5,000–₹50,000).",
                    "Beneficiary BEN-0771 was newly created and modified < 5 minutes prior to payment.",
                    "Transaction limit on ACC-5521 was escalated without dual-custody authorization.",
                    "Dual-custody payment authorization step is MISSING.",
                    "No matching ITSM ticket, change request, or incident window found.",
                    "Rapid escalation sequence: Login → Modify Beneficiary → Change Limit → High-Value Transfer."
                ]
            elif scenario in ['emergency', 'legitimate_exception'] and uid == 'EMP-1098':
                # Legitimate emergency scenario for Priya Sharma
                score = 38.0
                category = "MODERATE"
                breakdown = {
                    "behavioral": 65.0,
                    "sequence": 30.0,
                    "relationship": 20.0,
                    "financial": 10.0,
                    "privilege": 75.0,
                    "context": 15.0,
                    "ml": 40.0
                }
                explanations = [
                    "Off-hours authentication detected at 02:15 AM (Initial behavioral anomaly).",
                    "High database activity detected on Core Banking Cluster.",
                    "Context Validated: Active Incident INC-1029 (Production Outage).",
                    "Ticket Validated: Approved Emergency Ticket TKT-5567 (Database Failover).",
                    "Authorized Role: Senior Database Administrator during active maintenance window."
                ]
            else:
                # Normal low baseline
                base_val = 10 + (hash(uid) % 15)
                score = float(base_val)
                category = "LOW"
                breakdown = {
                    "behavioral": float(base_val),
                    "sequence": 8.0,
                    "relationship": 10.0,
                    "financial": 12.0,
                    "privilege": 15.0 if u['privilege_level'] == 'HIGH' else 8.0,
                    "context": 5.0,
                    "ml": 10.0
                }
                explanations = [
                    "Operations align with historical peer baseline.",
                    "Transactions within authorized daily limits.",
                    "Known devices and recognized corporate network access."
                ]
                
            cursor.execute("""
                INSERT INTO risk_scores (user_id, score, category, breakdown, explanations)
                VALUES (?, ?, ?, ?, ?)
            """, (uid, score, category, json.dumps(breakdown), json.dumps(explanations)))
            
        conn.commit()
        conn.close()

    def run_normal_scenario(self):
        self._set_scenario('normal')
        self._recalculate_risks('normal')
        
    def run_attack_scenario(self):
        self._set_scenario('attack')
        self._recalculate_risks('attack')
        try:
            conn = get_db()
            cursor = conn.cursor()
            now = datetime.now()
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C1-01'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C1-02'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C1-03'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C1-04'", (now.isoformat(),))
            conn.commit()
            conn.close()
        except Exception:
            pass
        
    def run_emergency_scenario(self):
        self._set_scenario('emergency')
        self._recalculate_risks('emergency')
        try:
            conn = get_db()
            cursor = conn.cursor()
            now = datetime.now()
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C2-01'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C2-02'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C2-03'", (now.isoformat(),))
            cursor.execute("UPDATE events SET timestamp = ? WHERE id = 'EVT-C2-04'", (now.isoformat(),))
            conn.commit()
            conn.close()
        except Exception:
            pass
        
    def reset_demo(self):
        reset_db()
        self.run_normal_scenario()
