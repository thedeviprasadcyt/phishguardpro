"""
PhishGuard Pro — History Routes
GET    /api/history      — Get user's scan history
DELETE /api/history/<id> — Delete a scan record
"""
from flask import Blueprint, request, jsonify, g
from app.middleware.auth import require_auth
from app.middleware.rate_limiter import rate_limit
from app.services.firebase_service import get_user_history, delete_scan
import logging

logger = logging.getLogger(__name__)
history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
@rate_limit
@require_auth
def get_history():
    """Get authenticated user's scan history."""
    try:
        limit = request.args.get("limit", 50, type=int)
        limit = min(limit, 200)  # Cap at 200

        history = get_user_history(g.user["uid"], limit=limit)

        return jsonify({
            "history": history,
            "count": len(history),
        }), 200

    except Exception as e:
        logger.error(f"History fetch error: {e}")
        return jsonify({"error": "Failed to fetch history"}), 500


@history_bp.route("/history/<scan_id>", methods=["DELETE"])
@rate_limit
@require_auth
def delete_history(scan_id):
    """Delete a specific scan record."""
    try:
        success = delete_scan(scan_id, g.user["uid"])

        if success:
            return jsonify({"message": "Scan record deleted"}), 200
        else:
            return jsonify({"error": "Record not found or access denied"}), 404

    except Exception as e:
        logger.error(f"Delete error: {e}")
        return jsonify({"error": "Failed to delete record"}), 500
