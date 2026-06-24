"""
PhishGuard Pro — ML Phishing Detection Model
Random Forest classifier trained on synthetic URL features.
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

FEATURE_ORDER = [
    "url_length", "domain_length", "dot_count", "hyphen_count",
    "has_at_symbol", "has_ip_address", "is_https", "subdomain_count",
    "suspicious_tld", "suspicious_keyword_count", "path_depth",
    "query_param_count", "has_fragment", "special_char_ratio",
    "digit_ratio", "url_entropy", "double_slash_in_path", "is_shortened",
]


class PhishingDetector:
    """ML-powered phishing URL detector using Random Forest."""

    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self._train_model()

    def _train_model(self):
        """Train the model on synthetic feature data at startup."""
        logger.info("Training phishing detection model...")
        np.random.seed(42)
        n_samples = 3000

        # ── Generate synthetic training data ──────────────
        # Safe URLs (label=0)
        safe = self._generate_safe_samples(n_samples // 3)
        # Suspicious URLs (label=1)
        suspicious = self._generate_suspicious_samples(n_samples // 3)
        # Phishing URLs (label=2)
        phishing = self._generate_phishing_samples(n_samples // 3)

        X = np.vstack([safe, suspicious, phishing])
        y = np.array(
            [0] * (n_samples // 3) +
            [1] * (n_samples // 3) +
            [2] * (n_samples // 3)
        )

        # Shuffle
        indices = np.random.permutation(len(X))
        X, y = X[indices], y[indices]

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1,
        )
        self.model.fit(X_scaled, y)
        logger.info("Model trained successfully with %d samples", len(X))

    def predict(self, features_dict):
        """
        Predict phishing category from features dict.
        Returns: { category, confidence, risk_score }
        """
        feature_vector = np.array(
            [[features_dict.get(f, 0) for f in FEATURE_ORDER]]
        )
        feature_scaled = self.scaler.transform(feature_vector)

        prediction = self.model.predict(feature_scaled)[0]
        probabilities = self.model.predict_proba(feature_scaled)[0]

        categories = {0: "Safe", 1: "Suspicious", 2: "Phishing"}
        category = categories.get(prediction, "Unknown")
        confidence = round(float(max(probabilities)) * 100, 1)

        # Risk score: weighted combination of probabilities
        risk_score = int(round(
            probabilities[1] * 50 + probabilities[2] * 100
        ))
        risk_score = max(0, min(100, risk_score))

        return {
            "category": category,
            "confidence": confidence,
            "risk_score": risk_score,
            "probabilities": {
                "safe": round(float(probabilities[0]) * 100, 1),
                "suspicious": round(float(probabilities[1]) * 100, 1),
                "phishing": round(float(probabilities[2]) * 100, 1),
            }
        }

    # ── Synthetic Data Generators ─────────────────────────

    def _generate_safe_samples(self, n):
        """Generate feature vectors for safe URLs."""
        return np.column_stack([
            np.random.normal(40, 15, n).clip(10, 80),      # url_length
            np.random.normal(12, 4, n).clip(4, 25),         # domain_length
            np.random.normal(2, 0.8, n).clip(1, 4),         # dot_count
            np.random.normal(0.3, 0.5, n).clip(0, 2),       # hyphen_count
            np.zeros(n),                                     # has_at_symbol
            np.zeros(n),                                     # has_ip_address
            np.ones(n),                                      # is_https
            np.random.choice([0, 1], n, p=[0.7, 0.3]),      # subdomain_count
            np.zeros(n),                                     # suspicious_tld
            np.zeros(n),                                     # suspicious_keyword_count
            np.random.normal(1.5, 1, n).clip(0, 4),         # path_depth
            np.random.normal(0.5, 0.8, n).clip(0, 3),       # query_param_count
            np.random.choice([0, 1], n, p=[0.8, 0.2]),      # has_fragment
            np.random.normal(0.04, 0.02, n).clip(0, 0.1),   # special_char_ratio
            np.random.normal(0.03, 0.02, n).clip(0, 0.08),  # digit_ratio
            np.random.normal(3.5, 0.5, n).clip(2, 4.5),     # url_entropy
            np.zeros(n),                                     # double_slash_in_path
            np.zeros(n),                                     # is_shortened
        ])

    def _generate_suspicious_samples(self, n):
        """Generate feature vectors for suspicious URLs."""
        return np.column_stack([
            np.random.normal(70, 20, n).clip(30, 120),      # url_length
            np.random.normal(18, 6, n).clip(8, 35),         # domain_length
            np.random.normal(3.5, 1.2, n).clip(2, 7),       # dot_count
            np.random.normal(1.5, 1, n).clip(0, 4),         # hyphen_count
            np.random.choice([0, 1], n, p=[0.85, 0.15]),    # has_at_symbol
            np.random.choice([0, 1], n, p=[0.8, 0.2]),      # has_ip_address
            np.random.choice([0, 1], n, p=[0.4, 0.6]),      # is_https
            np.random.normal(1.5, 1, n).clip(0, 4),         # subdomain_count
            np.random.choice([0, 1], n, p=[0.6, 0.4]),      # suspicious_tld
            np.random.normal(1, 0.8, n).clip(0, 3),         # suspicious_keyword_count
            np.random.normal(3, 1.5, n).clip(1, 7),         # path_depth
            np.random.normal(2, 1.5, n).clip(0, 6),         # query_param_count
            np.random.choice([0, 1], n, p=[0.5, 0.5]),      # has_fragment
            np.random.normal(0.08, 0.03, n).clip(0.02, 0.18), # special_char_ratio
            np.random.normal(0.08, 0.04, n).clip(0.01, 0.2),  # digit_ratio
            np.random.normal(4.2, 0.4, n).clip(3.5, 5.0),   # url_entropy
            np.random.choice([0, 1], n, p=[0.7, 0.3]),      # double_slash_in_path
            np.random.choice([0, 1], n, p=[0.7, 0.3]),      # is_shortened
        ])

    def _generate_phishing_samples(self, n):
        """Generate feature vectors for phishing URLs."""
        return np.column_stack([
            np.random.normal(110, 30, n).clip(50, 200),     # url_length
            np.random.normal(25, 8, n).clip(10, 50),        # domain_length
            np.random.normal(5, 1.5, n).clip(3, 10),        # dot_count
            np.random.normal(3, 1.5, n).clip(1, 7),         # hyphen_count
            np.random.choice([0, 1], n, p=[0.5, 0.5]),      # has_at_symbol
            np.random.choice([0, 1], n, p=[0.4, 0.6]),      # has_ip_address
            np.random.choice([0, 1], n, p=[0.7, 0.3]),      # is_https
            np.random.normal(3, 1.2, n).clip(1, 6),         # subdomain_count
            np.random.choice([0, 1], n, p=[0.3, 0.7]),      # suspicious_tld
            np.random.normal(2.5, 1, n).clip(1, 5),         # suspicious_keyword_count
            np.random.normal(4.5, 2, n).clip(2, 10),        # path_depth
            np.random.normal(4, 2, n).clip(1, 10),          # query_param_count
            np.random.choice([0, 1], n, p=[0.3, 0.7]),      # has_fragment
            np.random.normal(0.15, 0.05, n).clip(0.05, 0.3), # special_char_ratio
            np.random.normal(0.15, 0.06, n).clip(0.03, 0.3),  # digit_ratio
            np.random.normal(4.8, 0.3, n).clip(4, 5.5),     # url_entropy
            np.random.choice([0, 1], n, p=[0.4, 0.6]),      # double_slash_in_path
            np.random.choice([0, 1], n, p=[0.5, 0.5]),      # is_shortened
        ])
