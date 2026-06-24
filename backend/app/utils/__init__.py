"""
PhishGuard Pro — Logging Configuration
"""
import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger(app):
    """Configure structured logging with file rotation."""
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")
    os.makedirs(log_dir, exist_ok=True)

    log_file = os.path.join(log_dir, "phishguard.log")

    # File handler with rotation
    file_handler = RotatingFileHandler(
        log_file, maxBytes=5 * 1024 * 1024, backupCount=5
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    ))

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if app.debug else logging.INFO)
    console_handler.setFormatter(logging.Formatter(
        "%(levelname)s: %(message)s"
    ))

    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    app.logger.setLevel(logging.DEBUG if app.debug else logging.INFO)
    app.logger.info("PhishGuard Pro logger initialized")
