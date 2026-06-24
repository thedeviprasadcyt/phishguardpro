"""
PhishGuard Pro — Rate Limiter Middleware
In-memory rate limiting by IP address.
"""
import time
import functools
import os
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)

# In-memory store: { ip: [timestamp, timestamp, ...] }
_request_log = {}
_RATE_LIMIT = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))
_WINDOW_SECONDS = 60


def _cleanup_old_entries(ip, now):
    """Remove entries older than the window."""
    if ip in _request_log:
        _request_log[ip] = [
            ts for ts in _request_log[ip] if now - ts < _WINDOW_SECONDS
        ]


def rate_limit(f):
    """Decorator to enforce per-IP rate limiting."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        ip = request.remote_addr or "unknown"
        now = time.time()

        _cleanup_old_entries(ip, now)

        if ip not in _request_log:
            _request_log[ip] = []

        if len(_request_log[ip]) >= _RATE_LIMIT:
            logger.warning(f"Rate limit exceeded for IP: {ip}")
            return jsonify({
                "error": "Rate limit exceeded",
                "message": f"Maximum {_RATE_LIMIT} requests per minute. Try again shortly.",
            }), 429

        _request_log[ip].append(now)
        return f(*args, **kwargs)

    return decorated_function
