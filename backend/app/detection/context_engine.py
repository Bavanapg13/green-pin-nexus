import sqlite3
from datetime import datetime, timedelta

class ContextEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def calculate_risk(self, user_id: str, action: str, timestamp: str) -> float:
        cursor = self.conn.cursor()
        
        try:
            event_time = datetime.fromisoformat(timestamp)
        except:
            event_time = datetime.now()
            
        # Check for active tickets or incidents
        cursor.execute("SELECT COUNT(*) FROM tickets WHERE user_id = ? AND status IN ('OPEN', 'ACTIVE')", (user_id,))
        active_tickets = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM incidents WHERE status IN ('ACTIVE', 'OPEN')")
        active_incidents = cursor.fetchone()[0]
        
        score = 0.0
        
        # If sensitive action but no active context
        sensitive_ops = ["DATABASE_QUERY", "PERMISSION_CHANGED", "SYSTEM_RESTART"]
        
        if action in sensitive_ops:
            if active_tickets == 0 and active_incidents == 0:
                score += 50.0 # High risk: No business context
            else:
                score -= 30.0 # Risk reduction: Legitimate context exists
                
        return max(0.0, min(score, 100.0))
