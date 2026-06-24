"""
PhishGuard Pro — Firebase Authentication Middleware
Verifies Firebase ID tokens from the Authorization header.
"""
import functools
from flask import request, jsonify, g
import firebase_admin.auth as firebase_auth
import logging

logger = logging.getLogger(__name__)


def require_auth(f):
    """Decorator that verifies Firebase ID token and injects user info into g.user."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split("Bearer ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(token)
            g.user = {
                "uid": decoded_token["uid"],
                "email": decoded_token.get("email", ""),
                "name": decoded_token.get("name", ""),
            }
        except firebase_admin.auth.ExpiredIdTokenError:
            return jsonify({"error": "Token expired. Please log in again."}), 401
        except firebase_admin.auth.RevokedIdTokenError:
            return jsonify({"error": "Token revoked. Please log in again."}), 401
        except firebase_admin.auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid authentication token"}), 401
        except Exception as e:
            logger.error(f"Auth error: {e}")
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function


def optional_auth(f):
    """Decorator that optionally parses auth token but doesn't require it."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        g.user = None

        if auth_header.startswith("Bearer "):
            token = auth_header.split("Bearer ")[1]
            try:
                decoded_token = firebase_auth.verify_id_token(token)
                g.user = {
                    "uid": decoded_token["uid"],
                    "email": decoded_token.get("email", ""),
                    "name": decoded_token.get("name", ""),
                }
            except Exception:
                pass

        return f(*args, **kwargs)

    return decorated_function
