class FinancialEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def calculate_risk(self, amount: float, account_id: str, current_event: dict) -> float:
        if amount is None or amount <= 0:
            return 0.0
            
        cursor = self.conn.cursor()
        
        # Get historical average for account
        cursor.execute("SELECT AVG(amount), MAX(amount) FROM transactions WHERE account_id = ?", (account_id,))
        row = cursor.fetchone()
        avg_amt, max_amt = row if row[0] is not None else (0, 0)
        
        score = 0.0
        
        if avg_amt > 0:
            if amount > max_amt * 2:
                score += 50.0
            elif amount > avg_amt * 5:
                score += 30.0
                
        # High value check absolute
        if amount > 500000:
            score += 20.0
            
        return min(score, 100.0)
