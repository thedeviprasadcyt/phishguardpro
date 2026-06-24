"""
PhishGuard Pro — Scan Routes
POST /api/scan    — Scan a single URL
POST /api/predict — Detailed prediction with feature breakdown
"""
from flask import Blueprint, request, jsonify, current_app, g
from app.middleware.auth import optional_auth
from app.middleware.rate_limiter import rate_limit
from app.middleware.validators import validate_url, sanitize_string
from app.services.url_analyzer import extract_features, get_threat_indicators
from app.services.firebase_service import save_scan
import logging

logger = logging.getLogger(__name__)
scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/scan", methods=["POST"])
@rate_limit
@optional_auth
def scan_url():
    """Scan a URL for phishing indicators."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body required"}), 400

    raw_url = sanitize_string(data.get("url", ""))
    is_valid, cleaned_url, error = validate_url(raw_url)

    if not is_valid:
        return jsonify({"error": error}), 400

    try:
        # Extract features
        features = extract_features(cleaned_url)

        # ML prediction
        detector = current_app.phishing_detector
        prediction = detector.predict(features)

        # Threat indicators
        indicators = get_threat_indicators(features, cleaned_url)

        result = {
            "url": cleaned_url,
            "category": prediction["category"],
            "risk_score": prediction["risk_score"],
            "confidence": prediction["confidence"],
            "probabilities": prediction["probabilities"],
            "indicators": indicators,
            "features": features,
        }

        # Save to Firestore if user is authenticated
        if g.user:
            saved = save_scan(g.user["uid"], result)
            if saved:
                result["scan_id"] = saved["id"]
                result["scanned_at"] = saved["scanned_at"]

        logger.info(f"URL scanned: {cleaned_url} -> {prediction['category']}")
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Scan error: {e}")
        return jsonify({"error": "Scan failed", "message": str(e)}), 500


@scan_bp.route("/predict", methods=["POST"])
@rate_limit
@optional_auth
def predict_url():
    """Detailed prediction with full feature breakdown."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body required"}), 400

    raw_url = sanitize_string(data.get("url", ""))
    is_valid, cleaned_url, error = validate_url(raw_url)

    if not is_valid:
        return jsonify({"error": error}), 400

    try:
        features = extract_features(cleaned_url)
        detector = current_app.phishing_detector
        prediction = detector.predict(features)
        indicators = get_threat_indicators(features, cleaned_url)

        result = {
            "url": cleaned_url,
            "prediction": prediction,
            "indicators": indicators,
            "feature_analysis": features,
            "summary": _generate_summary(prediction, indicators),
        }

        # Save to Firestore if authenticated
        if g.user:
            scan_data = {
                "url": cleaned_url,
                "category": prediction["category"],
                "risk_score": prediction["risk_score"],
                "confidence": prediction["confidence"],
                "indicators": indicators,
                "probabilities": prediction["probabilities"],
            }
            saved = save_scan(g.user["uid"], scan_data)
            if saved:
                result["scan_id"] = saved["id"]

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Predict error: {e}")
        return jsonify({"error": "Prediction failed", "message": str(e)}), 500


def _generate_summary(prediction, indicators):
    """Generate a human-readable summary."""
    category = prediction["category"]
    confidence = prediction["confidence"]
    risk_score = prediction["risk_score"]

    if category == "Safe":
        return (
            f"This URL appears to be safe with {confidence}% confidence. "
            f"Risk score: {risk_score}/100. No significant phishing indicators were detected."
        )
    elif category == "Suspicious":
        return (
            f"This URL shows suspicious characteristics with {confidence}% confidence. "
            f"Risk score: {risk_score}/100. Exercise caution before proceeding."
        )
    else:
        critical_count = sum(1 for i in indicators if i["type"] == "critical")
        return (
            f"⚠️ This URL is classified as PHISHING with {confidence}% confidence. "
            f"Risk score: {risk_score}/100. {critical_count} critical indicator(s) detected. "
            f"Do NOT enter any personal information."
        )
