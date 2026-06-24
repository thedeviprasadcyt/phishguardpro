"""
PhishGuard Pro — Firebase Service
Handles Firestore CRUD operations and Firebase Admin initialization.
"""
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

_db = None
_initialized = False


def init_firebase():
    """Initialize Firebase Admin SDK."""
    global _db, _initialized

    if _initialized:
        return

    _initialized = True  # Prevent re-entry

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        key_path = os.getenv("FIREBASE_ADMIN_KEY_PATH", "firebase-admin-key.json")

        # Check if already initialized (handles werkzeug reloader)
        try:
            firebase_admin.get_app()
            logger.info("Firebase app already initialized (reloader)")
            try:
                _db = firestore.client()
                logger.info("Firestore client ready")
            except Exception:
                logger.warning("Firestore client unavailable")
            return
        except ValueError:
            pass  # Not yet initialized, continue

        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized with service account key")
        else:
            logger.warning(
                "Firebase Admin key not found at '%s'. "
                "Firestore features will be disabled. "
                "Scan results will not be saved. "
                "See README.md for Firebase setup instructions.", key_path
            )
            return

        _db = firestore.client()
        logger.info("Firestore client ready")

    except Exception as e:
        logger.warning(f"Firebase init skipped: {e}")
        logger.warning("App will run without Firestore. Scans still work but won't be saved.")


def get_db():
    """Get Firestore client. Returns None if not initialized."""
    return _db


def save_scan(user_uid, scan_data):
    """Save a scan result to Firestore."""
    db = get_db()
    if not db:
        logger.warning("Firestore unavailable — scan not saved")
        return None

    try:
        doc_ref = db.collection("scans").document()
        record = {
            "id": doc_ref.id,
            "user_uid": user_uid,
            "url": scan_data.get("url", ""),
            "category": scan_data.get("category", "Unknown"),
            "risk_score": scan_data.get("risk_score", 0),
            "confidence": scan_data.get("confidence", 0),
            "indicators": scan_data.get("indicators", []),
            "probabilities": scan_data.get("probabilities", {}),
            "scanned_at": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow(),
        }
        doc_ref.set(record)
        logger.info(f"Scan saved: {doc_ref.id}")
        return record
    except Exception as e:
        logger.error(f"Error saving scan: {e}")
        return None


def get_user_history(user_uid, limit=50):
    """Get scan history for a user."""
    db = get_db()
    if not db:
        return []

    try:
        query = (
            db.collection("scans")
            .where("user_uid", "==", user_uid)
            .order_by("created_at", direction="DESCENDING")
            .limit(limit)
        )
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            # Convert Firestore timestamp to string
            if hasattr(data.get("created_at"), "isoformat"):
                data["created_at"] = data["created_at"].isoformat()
            results.append(data)
        return results
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        return []


def delete_scan(scan_id, user_uid):
    """Delete a scan record. Returns True if successful."""
    db = get_db()
    if not db:
        return False

    try:
        doc_ref = db.collection("scans").document(scan_id)
        doc = doc_ref.get()

        if not doc.exists:
            return False

        data = doc.to_dict()
        if data.get("user_uid") != user_uid:
            return False

        doc_ref.delete()
        logger.info(f"Scan deleted: {scan_id}")
        return True
    except Exception as e:
        logger.error(f"Error deleting scan: {e}")
        return False


def get_user_stats(user_uid):
    """Get aggregated statistics for a user."""
    db = get_db()
    if not db:
        return _default_stats()

    try:
        query = (
            db.collection("scans")
            .where("user_uid", "==", user_uid)
        )
        docs = list(query.stream())

        total = len(docs)
        safe = sum(1 for d in docs if d.to_dict().get("category") == "Safe")
        suspicious = sum(1 for d in docs if d.to_dict().get("category") == "Suspicious")
        phishing = sum(1 for d in docs if d.to_dict().get("category") == "Phishing")

        # Weekly trend (last 7 entries grouped by date)
        weekly = {}
        for doc in docs:
            data = doc.to_dict()
            date_str = data.get("scanned_at", "")[:10]
            if date_str:
                weekly[date_str] = weekly.get(date_str, 0) + 1

        # Sort and take last 7 days
        sorted_weekly = sorted(weekly.items())[-7:]

        return {
            "total_scans": total,
            "safe_count": safe,
            "suspicious_count": suspicious,
            "phishing_count": phishing,
            "weekly_trend": [
                {"date": d, "count": c} for d, c in sorted_weekly
            ],
            "risk_distribution": {
                "safe": safe,
                "suspicious": suspicious,
                "phishing": phishing,
            },
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return _default_stats()


def _default_stats():
    """Return default stats when Firestore is unavailable."""
    return {
        "total_scans": 0,
        "safe_count": 0,
        "suspicious_count": 0,
        "phishing_count": 0,
        "weekly_trend": [],
        "risk_distribution": {"safe": 0, "suspicious": 0, "phishing": 0},
    }
