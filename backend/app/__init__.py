"""
PhishGuard Pro — Flask Application Factory
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.utils.logger import setup_logger


def create_app():
    app = Flask(__name__)

    # ── Configuration ──────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-fallback-key")
    app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1 MB

    # ── CORS ───────────────────────────────────────────────
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(app, resources={
        r"/api/*": {
            "origins": [frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    })

    # ── Logging ────────────────────────────────────────────
    setup_logger(app)

    # ── Initialize Firebase ────────────────────────────────
    from app.services.firebase_service import init_firebase
    init_firebase()

    # ── Initialize ML Model ────────────────────────────────
    from app.services.ml_model import PhishingDetector
    app.phishing_detector = PhishingDetector()

    # ── Register Blueprints ────────────────────────────────
    from app.routes.scan import scan_bp
    from app.routes.history import history_bp
    from app.routes.stats import stats_bp
    from app.routes.report import report_bp

    app.register_blueprint(scan_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(stats_bp, url_prefix="/api")
    app.register_blueprint(report_bp, url_prefix="/api")

    # ── Health Check ───────────────────────────────────────
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "PhishGuard Pro API"}), 200

    # ── Error Handlers ─────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Forbidden", "message": "Access denied"}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found", "message": "Resource not found"}), 404

    @app.errorhandler(429)
    def rate_limited(e):
        return jsonify({"error": "Rate limited", "message": "Too many requests"}), 429

    @app.errorhandler(500)
    def internal_error(e):
        app.logger.error(f"Internal server error: {e}")
        return jsonify({"error": "Internal server error", "message": "Something went wrong"}), 500

    return app
