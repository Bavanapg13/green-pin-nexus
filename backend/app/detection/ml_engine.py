from sklearn.ensemble import IsolationForest
import numpy as np
import random

class MLEngine:
    def __init__(self, db_conn):
        self.conn = db_conn
        self.model = IsolationForest(n_estimators=100, random_state=42, contamination=0.05)
        self.is_trained = False
        self._train()

    def _train(self):
        # Extract features from historical data to train
        # Features: [transaction_amount_deviation, transaction_frequency, hour_deviation, privileged_action_frequency]
        # Using dummy training data representing normal behavior
        np.random.seed(42)
        normal_data = np.random.normal(loc=0.0, scale=1.0, size=(1000, 4))
        self.model.fit(normal_data)
        self.is_trained = True

    def calculate_risk(self, user_id: str, features: list) -> float:
        if not self.is_trained:
            return 0.0
            
        # Features passed should be a list of 4 floats
        # Predict returns 1 for inliers, -1 for outliers
        # score_samples returns opposite of anomaly score (lower means more anomalous)
        X = np.array([features])
        score = self.model.score_samples(X)[0]
        
        # Convert to 0-100 scale. score_samples typically ranges from -1 to 0 (sometimes lower)
        # We map it so that lower score -> higher risk
        risk = max(0, min(100, -score * 100))
        return risk
