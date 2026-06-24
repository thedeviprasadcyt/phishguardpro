"""
PhishGuard Pro — Stats Routes
GET /api/stats — Get aggregated analytics for the user
"""
from flask import Blueprint, jsonify, g
from app.middleware.auth import require_auth
from app.middleware.rate_limiter import rate_limit
from app.services.firebase_service import get_user_stats
import logging

logger = logging.getLogger(__name__)
stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/stats", methods=["GET"])
@rate_limit
@require_auth
def get_stats():
    """Get aggregated dashboard statistics."""
    try:
        stats = get_user_stats(g.user["uid"])

        return jsonify({
            "stats": stats,
            "user": {
                "email": g.user.get("email", ""),
                "uid": g.user["uid"],
            },
        }), 200

    except Exception as e:
        logger.error(f"Stats error: {e}")
        return jsonify({"error": "Failed to fetch statistics"}), 500
