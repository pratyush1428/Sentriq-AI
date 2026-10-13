import re
from typing import Dict, Any, Tuple

TANGLISH_PATTERNS = [
    r"\bunga\b", r"\bungalukku\b", r"\baagidum\b", r"\baagum\b", r"\bippo\b",
    r"\bpannunga\b", r"\bpannavum\b", r"\bpanam\b", r"\banupunga\b", r"\bkattala\b",
    r"\bcurrent\s*cut\b", r"\budane\b", r"\bvetri\b", r"\bthodarpu\b", r"\bkedaikkum\b",
    r"\bkaasu\b", r"\bkelunga\b", r"\billana\b", r"\bpoturuka\b", r"\bnaalaikku\b",
    r"\bthavarinal\b", r"\bmudakkappadum\b"
]

HINGLISH_PATTERNS = [
    r"\baapka\b", r"\baapke\b", r"\bkarein\b", r"\bkaro\b", r"\bho\s*jayega\b",
    r"\bturant\b", r"\bpaise\b", r"\bpaisa\b", r"\bbhejo\b", r"\bbhejiye\b",
    r"\bbijli\b", r"\bline\s*kaat\b", r"\bkripya\b", r"\bbadhaai\b", r"\binaam\b",
    r"\bkhatra\b", r"\bband\s*hoga\b", r"\blagega\b", r"\bjaldi\b", r"\bshulk\b",
    r"\bkhata\b", r"\baavedan\b"
]

def detect_language_and_scripts(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    has_tamil_script = bool(re.search(r"[\u0B80-\u0BFF]", text))
    has_devanagari_script = bool(re.search(r"[\u0900-\u097F]", text))
    
    tanglish_matches = [p for p in TANGLISH_PATTERNS if re.search(p, text_lower)]
    hinglish_matches = [p for p in HINGLISH_PATTERNS if re.search(p, text_lower)]
    
    is_tanglish = len(tanglish_matches) >= 1
    is_hinglish = len(hinglish_matches) >= 1
    
    if has_tamil_script and (is_tanglish or re.search(r"[a-zA-Z]", text)):
        detected = "Tamil (Code-Mixed)"
        display = "தமிழ் + English (Code-mixed)"
    elif has_tamil_script:
        detected = "Tamil"
        display = "தமிழ் (Tamil)"
    elif has_devanagari_script and (is_hinglish or re.search(r"[a-zA-Z]", text)):
        detected = "Hindi (Code-Mixed)"
        display = "हिंदी + English (Code-mixed)"
    elif has_devanagari_script:
        detected = "Hindi"
        display = "हिंदी (Hindi)"
    elif is_tanglish and is_hinglish:
        detected = "Multilingual (Code-Mixed)"
        display = "Tanglish / Hinglish (Code-mixed)"
    elif is_tanglish:
        detected = "Tanglish"
        display = "Tanglish (Romanized Tamil)"
    elif is_hinglish:
        detected = "Hinglish"
        display = "Hinglish (Romanized Hindi)"
    else:
        detected = "English"
        display = "English"
        
    return {
        "detected_language": detected,
        "language_display": display,
        "has_tamil_script": has_tamil_script,
        "has_devanagari_script": has_devanagari_script,
        "is_tanglish": is_tanglish,
        "is_hinglish": is_hinglish,
        "code_mixed_matches": tanglish_matches + hinglish_matches
    }
