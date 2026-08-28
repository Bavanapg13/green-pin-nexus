class SequenceEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def calculate_risk(self, user_id: str) -> float:
        cursor = self.conn.cursor()
        cursor.execute("SELECT action FROM events WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5", (user_id,))
        recent_actions = [r[0] for r in cursor.fetchall()]
        
        recent_actions.reverse()
        seq = "->".join(recent_actions)
        
        score = 0.0
        
        # Suspicious rapid modifications
        if "BENEFICIARY_MODIFIED->TRANSACTION_LIMIT_CHANGED->PAYMENT_INITIATED" in seq:
            score += 80.0
            
        if "DATABASE_QUERY->DATABASE_QUERY->PERMISSION_CHANGED" in seq:
            score += 60.0
            
        return min(score, 100.0)
