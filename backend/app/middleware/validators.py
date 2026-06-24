"""
PhishGuard Pro — Input Validation & Sanitization
"""
import re
from urllib.parse import urlparse
import bleach


def sanitize_string(text):
    """Remove HTML tags and dangerous characters."""
    if not isinstance(text, str):
        return ""
    return bleach.clean(text, tags=[], attributes={}, strip=True).strip()


def validate_url(url):
    """
    Validate and normalize a URL.
    Returns (is_valid, cleaned_url, error_message).
    """
    if not url or not isinstance(url, str):
        return False, "", "URL is required"

    url = url.strip()

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    # Length check
    if len(url) > 2048:
        return False, "", "URL is too long (max 2048 characters)"

    try:
        parsed = urlparse(url)
        if not parsed.netloc:
            return False, "", "Invalid URL format"
        # Basic domain validation
        if not re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', parsed.netloc.split(':')[0]):
            # Allow IP addresses
            if not re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', parsed.netloc.split(':')[0]):
                return False, "", "Invalid domain in URL"
    except Exception:
        return False, "", "Could not parse URL"

    return True, url, ""


def validate_scan_request(data):
    """Validate scan request body."""
    errors = []

    if not data:
        return False, ["Request body is required"]

    url = data.get("url", "")
    is_valid, cleaned_url, error = validate_url(url)
    if not is_valid:
        errors.append(error)

    return len(errors) == 0, errors if errors else cleaned_url
