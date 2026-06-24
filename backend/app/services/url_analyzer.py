"""
PhishGuard Pro — URL Feature Extraction
Extracts 18 features from a URL for ML-based phishing detection.
"""
import re
import math
from urllib.parse import urlparse, parse_qs
import logging

logger = logging.getLogger(__name__)

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "confirm",
    "bank", "paypal", "signin", "password", "credential", "suspend",
    "alert", "expire", "restore", "unlock", "wallet", "billing",
]

SUSPICIOUS_TLDS = [
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club",
    ".work", ".buzz", ".icu", ".cam", ".rest", ".surf",
]


def extract_features(url):
    """
    Extract numerical features from a URL.
    Returns a dict of feature_name -> value.
    """
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.split(":")[0].lower()
        path = parsed.path
        query = parsed.query
        fragment = parsed.fragment

        features = {}

        # 1. URL length
        features["url_length"] = len(url)

        # 2. Domain length
        features["domain_length"] = len(domain)

        # 3. Number of dots in URL
        features["dot_count"] = url.count(".")

        # 4. Number of hyphens in domain
        features["hyphen_count"] = domain.count("-")

        # 5. Has @ symbol (common in phishing)
        features["has_at_symbol"] = 1 if "@" in url else 0

        # 6. Uses IP address instead of domain
        features["has_ip_address"] = 1 if re.match(
            r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain
        ) else 0

        # 7. Uses HTTPS
        features["is_https"] = 1 if parsed.scheme == "https" else 0

        # 8. Number of subdomains
        subdomain_parts = domain.split(".")
        features["subdomain_count"] = max(0, len(subdomain_parts) - 2)

        # 9. Suspicious TLD
        features["suspicious_tld"] = 1 if any(
            domain.endswith(tld) for tld in SUSPICIOUS_TLDS
        ) else 0

        # 10. Number of suspicious keywords
        url_lower = url.lower()
        features["suspicious_keyword_count"] = sum(
            1 for kw in SUSPICIOUS_KEYWORDS if kw in url_lower
        )

        # 11. Path depth
        features["path_depth"] = len([p for p in path.split("/") if p])

        # 12. Query parameter count
        features["query_param_count"] = len(parse_qs(query))

        # 13. Has fragment
        features["has_fragment"] = 1 if fragment else 0

        # 14. Special character ratio
        special = sum(1 for c in url if c in "!@#$%^&*()_+-=[]{}|;':\",./<>?")
        features["special_char_ratio"] = round(special / max(len(url), 1), 4)

        # 15. Digit ratio
        digits = sum(1 for c in url if c.isdigit())
        features["digit_ratio"] = round(digits / max(len(url), 1), 4)

        # 16. URL entropy (Shannon entropy)
        features["url_entropy"] = _calculate_entropy(url)

        # 17. Has double slash in path
        features["double_slash_in_path"] = 1 if "//" in path else 0

        # 18. URL shortening service
        shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "is.gd", "ow.ly"]
        features["is_shortened"] = 1 if any(s in domain for s in shorteners) else 0

        return features

    except Exception as e:
        logger.error(f"Feature extraction error: {e}")
        return _default_features()


def get_threat_indicators(features, url):
    """Generate human-readable threat indicators based on extracted features."""
    indicators = []

    if features.get("has_ip_address"):
        indicators.append({
            "type": "critical",
            "message": "URL uses an IP address instead of a domain name",
        })

    if not features.get("is_https"):
        indicators.append({
            "type": "warning",
            "message": "Connection is not encrypted (no HTTPS)",
        })

    if features.get("has_at_symbol"):
        indicators.append({
            "type": "critical",
            "message": "URL contains @ symbol — possible credential harvesting",
        })

    if features.get("suspicious_keyword_count", 0) >= 2:
        indicators.append({
            "type": "critical",
            "message": f"Multiple suspicious keywords detected ({features['suspicious_keyword_count']})",
        })
    elif features.get("suspicious_keyword_count", 0) == 1:
        indicators.append({
            "type": "warning",
            "message": "Suspicious keyword detected in URL",
        })

    if features.get("subdomain_count", 0) >= 3:
        indicators.append({
            "type": "warning",
            "message": f"Excessive subdomain depth ({features['subdomain_count']} subdomains)",
        })

    if features.get("url_length", 0) > 100:
        indicators.append({
            "type": "warning",
            "message": "Unusually long URL — may be obfuscating destination",
        })

    if features.get("suspicious_tld"):
        indicators.append({
            "type": "warning",
            "message": "Domain uses a suspicious top-level domain",
        })

    if features.get("is_shortened"):
        indicators.append({
            "type": "info",
            "message": "URL uses a shortening service — actual destination is hidden",
        })

    if features.get("special_char_ratio", 0) > 0.15:
        indicators.append({
            "type": "warning",
            "message": "High ratio of special characters in URL",
        })

    if features.get("double_slash_in_path"):
        indicators.append({
            "type": "info",
            "message": "Double slash found in URL path",
        })

    if features.get("url_entropy", 0) > 4.5:
        indicators.append({
            "type": "info",
            "message": "High URL entropy — may indicate randomly generated URL",
        })

    # If no issues found
    if not indicators:
        indicators.append({
            "type": "safe",
            "message": "No immediate phishing indicators detected",
        })

    return indicators


def _calculate_entropy(text):
    """Calculate Shannon entropy of a string."""
    if not text:
        return 0.0
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    length = len(text)
    entropy = -sum(
        (count / length) * math.log2(count / length)
        for count in freq.values()
    )
    return round(entropy, 4)


def _default_features():
    """Return default features in case of extraction error."""
    return {
        "url_length": 0, "domain_length": 0, "dot_count": 0,
        "hyphen_count": 0, "has_at_symbol": 0, "has_ip_address": 0,
        "is_https": 0, "subdomain_count": 0, "suspicious_tld": 0,
        "suspicious_keyword_count": 0, "path_depth": 0,
        "query_param_count": 0, "has_fragment": 0,
        "special_char_ratio": 0, "digit_ratio": 0,
        "url_entropy": 0, "double_slash_in_path": 0, "is_shortened": 0,
    }
