try:
    from sklearn.ensemble import IsolationForest
    import numpy as np
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
import random
import math

class MLEngine:
    def __init__(self, db_conn):
        self.conn = db_conn
        self.is_trained = False
        if SKLEARN_AVAILABLE:
            self.model = IsolationForest(n_estimators=100, random_state=42, contamination=0.05)
            self._train()
        else:
            self.is_trained = True

    def _train(self):
        if not SKLEARN_AVAILABLE:
            return
        np.random.seed(42)
        normal_data = np.random.normal(loc=0.0, scale=1.0, size=(1000, 4))
        self.model.fit(normal_data)
        self.is_trained = True

    def calculate_risk(self, user_id: str, features: list) -> float:
        if not self.is_trained:
            return 0.0
            
        if SKLEARN_AVAILABLE:
            X = np.array([features])
            score = self.model.score_samples(X)[0]
            risk = max(0, min(100, -score * 100))
            return risk
        else:
            # Mathematical distance based fallback
            norm = sum(f ** 2 for f in features) ** 0.5
            return min(100.0, norm * 20.0)
