import re
import ipaddress
from urllib.parse import urlparse
from typing import Dict, Any, List, Optional
import httpx
from backend.app.core.config import settings
from backend.app.core.logging import logger

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl",
    "rb.gy", "buff.ly", "ow.ly", "qr.ae", "v.gd"
}

SUSPICIOUS_TLDS = {
    "xyz", "top", "online", "site", "vip", "icu", "club", "tk", "ml", "ga", "cf", "gq", "work", "loan", "click"
}

DISALLOWED_PRIVATE_NETS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def extract_urls(text: str) -> List[str]:
    url_pattern = r"(?:https?:\/\/|www\.)[^\s<>'\"`]+|[a-zA-Z0-9.-]+\.(?:com|org|net|in|gov\.in|co\.in|xyz|top|online|site|vip|info|biz|me|app)\b[^\s<>'\"`]*"
    found = re.findall(url_pattern, text, re.IGNORECASE)
    normalized = []
    for u in found:
        # Strip trailing punctuation often found in text
        u = u.rstrip(".,;:!?)")
        if not u.startswith("http://") and not u.startswith("https://"):
            u = "https://" + u
        normalized.append(u)
    return list(dict.fromkeys(normalized))

def is_private_or_internal_host(hostname: str) -> bool:
    if hostname.lower() in ("localhost", "127.0.0.1", "::1", "metadata.google.internal"):
        return True
    try:
        ip = ipaddress.ip_address(hostname)
        for net in DISALLOWED_PRIVATE_NETS:
            if ip in net:
                return True
    except ValueError:
        pass
    return False

def analyze_url(url: str, claimed_brand: Optional[str] = None) -> Dict[str, Any]:
    risk_factors = []
    
    # Prepend scheme if missing
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        hostname = (parsed.hostname or "").lower()
    except Exception as e:
        return {
            "target_url": url,
            "domain": "invalid",
            "is_shortener": False,
            "has_homoglyph_or_punycode": False,
            "brand_domain_mismatch": True,
            "reputation_status": "malicious",
            "risk_factors": ["Malformed URL syntax"]
        }

    # SSRF verification
    if is_private_or_internal_host(hostname):
        return {
            "target_url": url,
            "domain": hostname,
            "is_shortener": False,
            "has_homoglyph_or_punycode": False,
            "brand_domain_mismatch": True,
            "reputation_status": "malicious",
            "risk_factors": ["Restricted internal network host or SSRF attempt detected"]
        }

    # Shortener check
    is_shortener = hostname in SHORTENER_DOMAINS
    if is_shortener:
        risk_factors.append("URL shortener obscures destination address")

    # Punycode / Homoglyph check
    has_homoglyph_or_punycode = hostname.startswith("xn--") or bool(re.search(r"[^\x00-\x7F]", hostname))
    if has_homoglyph_or_punycode:
        risk_factors.append("Punycode / non-ASCII homoglyph character detected in domain name")

    # TLD checks
    parts = hostname.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    if tld in SUSPICIOUS_TLDS:
        risk_factors.append(f"Domain uses high-abuse generic TLD (.{tld})")

    # Brand domain mismatch
    brand_domain_mismatch = False
    if claimed_brand:
        claimed_lower = claimed_brand.lower()
        if claimed_lower in ("sbi", "state bank") and not (hostname.endswith("sbi.co.in") or hostname.endswith("onlinesbi.sbi") or hostname.endswith("onlinesbi.com")):
            brand_domain_mismatch = True
            risk_factors.append("Domain does not match verified State Bank of India infrastructure")
        elif claimed_lower == "hdfc" and not hostname.endswith("hdfcbank.com"):
            brand_domain_mismatch = True
            risk_factors.append("Domain does not match verified HDFC Bank domain")
        elif claimed_lower == "icici" and not hostname.endswith("icicibank.com"):
            brand_domain_mismatch = True
            risk_factors.append("Domain does not match verified ICICI Bank domain")
        elif claimed_lower in ("tneb", "tangedco") and not (hostname.endswith("tangedco.org") or hostname.endswith("tnebltd.gov.in")):
            brand_domain_mismatch = True
            risk_factors.append("Domain does not match verified TNEB / TANGEDCO portal")
        elif claimed_lower == "incometax" and not (hostname.endswith("incometax.gov.in") or hostname.endswith("incometaxindia.gov.in")):
            brand_domain_mismatch = True
            risk_factors.append("Domain does not match verified Government Income Tax portal")
    
    # Generic brand keywords in suspicious subdomains
    bank_keywords = ["sbi", "hdfc", "icici", "axis", "pnb", "yono", "kyc-update", "eb-bill", "electricity", "refund"]
    for kw in bank_keywords:
        if kw in hostname and not any(hostname.endswith(allowed) for allowed in ["sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com", "pnbindia.in", "gov.in"]):
            brand_domain_mismatch = True
            risk_factors.append(f"Suspicious impersonation keyword '{kw}' found in unverified domain '{hostname}'")

    # Reputation status
    if brand_domain_mismatch or has_homoglyph_or_punycode or len(risk_factors) >= 2:
        reputation_status = "malicious"
    elif is_shortener or len(risk_factors) >= 1:
        reputation_status = "suspicious"
    elif hostname.endswith(".gov.in") or hostname.endswith(".edu") or hostname.endswith("sbi.co.in") or hostname.endswith("hdfcbank.com"):
        reputation_status = "safe"
    else:
        reputation_status = "unverified"

    return {
        "target_url": url,
        "domain": hostname,
        "is_shortener": is_shortener,
        "has_homoglyph_or_punycode": has_homoglyph_or_punycode,
        "brand_domain_mismatch": brand_domain_mismatch,
        "reputation_status": reputation_status,
        "risk_factors": risk_factors
    }
