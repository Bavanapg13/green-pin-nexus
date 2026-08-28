import json

class BehavioralEngine:
    def __init__(self, db_conn):
        self.conn = db_conn

    def calculate_risk(self, user_id: str, current_event: dict) -> float:
        # Dummy baseline comparison logic for MVP
        # Real implementation would query historical aggregates
        cursor = self.conn.cursor()
        
        # Check user's typical actions
        cursor.execute("SELECT action, COUNT(*) FROM events WHERE user_id = ? GROUP BY action", (user_id,))
        history = {row[0]: row[1] for row in cursor.fetchall()}
        
        score = 0.0
        
        action = current_event.get('action')
        if action not in history or history[action] < 5:
            score += 30.0
            
        # Time check (if working hours are 09:00-18:00)
        # Simplified: Check if time is unusual
        ts_str = current_event.get('timestamp')
        if ts_str:
            try:
                # Basic parsing, assume ISO
                hr = int(ts_str[11:13])
                if hr < 8 or hr > 19:
                    score += 20.0
            except:
                pass
                
        # Known device check
        device_id = current_event.get('device_id')
        cursor.execute("SELECT COUNT(*) FROM devices WHERE user_id = ? AND id = ?", (user_id, device_id))
        if cursor.fetchone()[0] == 0:
            score += 25.0
            
        return min(score, 100.0)
