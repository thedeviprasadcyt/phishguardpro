"""
PhishGuard Pro — Report Routes
POST /api/export-report — Generate and download a PDF security report
"""
from flask import Blueprint, request, jsonify, send_file, g
from app.middleware.auth import optional_auth
from app.middleware.rate_limiter import rate_limit
from app.services.report_generator import generate_report
import logging

logger = logging.getLogger(__name__)
report_bp = Blueprint("report", __name__)


@report_bp.route("/export-report", methods=["POST"])
@rate_limit
@optional_auth
def export_report():
    """Generate a PDF security report for a scan result."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Scan data required"}), 400

    required_fields = ["url", "category", "risk_score"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        pdf_buffer = generate_report(data)

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"phishguard_report_{data.get('risk_score', 0)}.pdf",
        )

    except Exception as e:
        logger.error(f"Report generation error: {e}")
        return jsonify({"error": "Failed to generate report"}), 500
