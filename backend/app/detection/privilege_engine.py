class PrivilegeEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def calculate_risk(self, user_id: str, action: str) -> float:
        cursor = self.conn.cursor()
        cursor.execute("SELECT privilege_level FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return 0.0
            
        privilege = row[0]
        score = 0.0
        
        sensitive_ops = ["PERMISSION_CHANGED", "TRANSACTION_LIMIT_CHANGED", "BENEFICIARY_MODIFIED", "PAYMENT_INITIATED"]
        
        if action in sensitive_ops:
            if privilege == "HIGH":
                score += 20.0 # High priv accounts doing sensitive things are targets
            elif privilege == "LOW":
                score += 50.0 # Low priv shouldn't typically do these without escalation
                
        return min(score, 100.0)
