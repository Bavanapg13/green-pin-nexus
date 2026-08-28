import json
from .behavioral import BehavioralEngine
from .ml_engine import MLEngine
from .sequence_engine import SequenceEngine
from .financial_engine import FinancialEngine
from .privilege_engine import PrivilegeEngine
from .relationship_engine import RelationshipEngine
from .context_engine import ContextEngine

class RiskEngine:
    def __init__(self, db_conn):
        self.conn = db_conn
        self.behavioral = BehavioralEngine(db_conn)
        self.ml = MLEngine(db_conn)
        self.sequence = SequenceEngine(db_conn)
        self.financial = FinancialEngine(db_conn)
        self.privilege = PrivilegeEngine(db_conn)
        self.relationship = RelationshipEngine(db_conn)
        self.context = ContextEngine(db_conn)

    def assess_event(self, event: dict) -> dict:
        user_id = event['user_id']
        action = event['action']
        ts = event['timestamp']
        details = json.loads(event.get('details', '{}'))
        
        # Calculate component risks
        b_risk = self.behavioral.calculate_risk(user_id, event)
        
        # Dummy features for ML (normally derived properly)
        ml_features = [0.5, 0.2, 0.8, 0.1]
        m_risk = self.ml.calculate_risk(user_id, ml_features)
        
        s_risk = self.sequence.calculate_risk(user_id)
        
        amount = details.get('amount', 0.0)
        account_id = details.get('account_id')
        f_risk = self.financial.calculate_risk(amount, account_id, event)
        
        p_risk = self.privilege.calculate_risk(user_id, action)
        
        target = details.get('beneficiary_id')
        r_risk = self.relationship.calculate_risk(user_id, target)
        
        c_risk = self.context.calculate_risk(user_id, action, ts)
        
        # Weights: Behavior=20%, Sequence=25%, Relationship=15%, Financial=15%, Privilege=10%, Context=10%, Historical=5%
        # (Assuming ML maps to historical or supplements behavioral)
        final_score = (
            b_risk * 0.20 +
            s_risk * 0.25 +
            r_risk * 0.15 +
            f_risk * 0.15 +
            p_risk * 0.10 +
            c_risk * 0.10 +
            m_risk * 0.05
        )
        
        if final_score < 30: category = "LOW"
        elif final_score < 60: category = "MODERATE"
        elif final_score < 80: category = "HIGH"
        else: category = "CRITICAL"
        
        explanations = []
        if b_risk > 50: explanations.append("High behavioral anomaly detected.")
        if s_risk > 50: explanations.append("Suspicious sequence of operations.")
        if f_risk > 50: explanations.append("Unusual financial amount or deviation.")
        if c_risk > 50: explanations.append("Lacking legitimate business context.")
        
        return {
            "score": round(final_score, 2),
            "category": category,
            "breakdown": {
                "behavioral": round(b_risk, 2),
                "sequence": round(s_risk, 2),
                "relationship": round(r_risk, 2),
                "financial": round(f_risk, 2),
                "privilege": round(p_risk, 2),
                "context": round(c_risk, 2),
                "ml": round(m_risk, 2)
            },
            "explanations": explanations,
            "recommended_response": "BLOCK" if category == "CRITICAL" else ("INVESTIGATE" if category == "HIGH" else "LOG")
        }
