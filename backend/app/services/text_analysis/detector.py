import re
from typing import List, Dict, Any, Tuple
from backend.app.schemas.scans import Indicator, BehavioralFactor

# Scam category indicators
SCAM_RULES = [
    {
        "category": "Credential Solicitation",
        "title": "OTP or Password Request",
        "severity": "critical",
        "description": "Legitimate banks and government departments strictly prohibit asking for OTPs, MPINs, or passwords.",
        "patterns": [
            r"\b(otp|one[\s-]*time[\s-]*password)\b",
            r"\b(mpin|upi[\s-]*pin|atm[\s-]*pin)\b",
            r"\b(netbanking\s*password|cvv\s*number)\b",
            r"\botp\s*(share|bhejo|anupunga|kudunga|solunga)\b"
        ]
    },
    {
        "category": "Fake KYC Suspension",
        "title": "Threat of Account Suspension for KYC",
        "severity": "high",
        "description": "Scammers manufacture emergency by claiming bank accounts or SIM cards will be permanently blocked today.",
        "patterns": [
            r"\b(kyc\s*update|kyc\s*pending|verify\s*kyc)\b",
            r"\b(account\s*(will\s*be\s*)?block(ed)?|account\s*freeze)\b",
            r"\b(pan\s*card\s*link|aadhaar\s*link\s*pannu)\b",
            r"\b(khata\s*band|account\s*block\s*aagidum)\b",
            r"\b(yono\s*account\s*disabled)\b"
        ]
    },
    {
        "category": "Utility Disconnection Threat",
        "title": "Fake Electricity Bill Disconnection Alert",
        "severity": "high",
        "description": "Widespread regional scam threatening same-day power cutoff to panic citizens into calling fraud numbers.",
        "patterns": [
            r"\b(electricity|power)\s*(will\s*be\s*)?disconnect(ed)?\b",
            r"\b(bill\s*kattala|current\s*cut)\b",
            r"\b(bijli\s*bill|line\s*kaat)\b",
            r"\b(at\s*9:30\s*pm|tonight\s*power\s*cut)\b",
            r"\b(call\s*(our\s*)?officer|contact\s*electricity\s*officer)\b"
        ]
    },
    {
        "category": "Financial Temptation",
        "title": "Unrealistic Reward or Lottery Offer",
        "severity": "high",
        "description": "Promises of free rewards, lottery winnings, or cashback designed to lure users into paying upfront processing fees.",
        "patterns": [
            r"\b(won\s*(a\s*)?lottery|kbc\s*lottery|lottery\s*adichirukku)\b",
            r"\b(reward\s*points\s*expir|cashback\s*worth|inaam\s*jeeta)\b",
            r"\b(claim\s*rs\s*\d+|free\s*gift\s*voucher)\b",
            r"\b(part[\s-]*time\s*job.*earn\s*\d+|telegram\s*task)\b"
        ]
    },
    {
        "category": "Impersonation / Coercion",
        "title": "Digital Arrest or Law Enforcement Coercion",
        "severity": "critical",
        "description": "Coercive scam claiming involvement in money laundering or narcotics, demanding video call isolation.",
        "patterns": [
            r"\b(digital\s*arrest|arrest\s*warrant)\b",
            r"\b(mumbai\s*police|cbi\s*officer|customs\s*officer|trai\s*department)\b",
            r"\b(parcel\s*contains\s*drugs|illegal\s*passport)\b",
            r"\b(do\s*not\s*disconnect\s*call|keep\s*video\s*on)\b"
        ]
    },
    {
        "category": "Suspicious Money Request",
        "title": "Urgent Money Transfer Demand",
        "severity": "high",
        "description": "Demands quick transfer of funds or payment under false pretenses.",
        "patterns": [
            r"\b(panam\s*anupunga|kaasu\s*podunga)\b",
            r"\b(paise\s*bhejo|paise\s*transfer)\b",
            r"\b(send\s*money\s*urgently|transfer\s*funds\s*now)\b"
        ]
    },
    {
        "category": "Suspicious Download / Link",
        "title": "Malicious App / APK Solicitation",
        "severity": "critical",
        "description": "Urging user to install unverified APK applications outside official Google Play Store.",
        "patterns": [
            r"\b(\.apk\b|download\s*app\s*from\s*link|install\s*sbi.*\.apk)\b",
            r"\b(anydesk|teamviewer|rustdesk|quicksupport)\b"
        ]
    }
]

# Behavioral indicators
BEHAVIOR_PATTERNS = {
    "Urgency": [
        r"\b(immediately|today|tonight|within\s*\d+\s*(hours?|mins?|hours)|turant|udane|ippo|jaldi|urgent|last\s*chance)\b"
    ],
    "Fear & Threat": [
        r"\b(blocked|suspended|terminated|disconnected|arrest|police|jail|legal\s*action|seized|penalty)\b"
    ],
    "Authority Pressure": [
        r"\b(official|government|rbi|income\s*tax|police|cbi|officer|head\s*office|court|trai)\b"
    ],
    "Financial Lure": [
        r"\b(reward|lottery|prize|bonus|earn\s*daily|cashback|refund|free|crore|lakh)\b"
    ],
    "Secrecy & Isolation": [
        r"\b(do\s*not\s*tell|keep\s*confidential|secret|private\s*code|share\s*with\s*no\s*one)\b"
    ]
}

def analyze_text_indicators(text: str) -> Tuple[List[Indicator], List[BehavioralFactor]]:
    text_lower = text.lower()
    indicators: List[Indicator] = []
    
    # Check scam patterns
    for rule in SCAM_RULES:
        for pat in rule["patterns"]:
            match = re.search(pat, text_lower)
            if match:
                snippet = text[max(0, match.start() - 20) : min(len(text), match.end() + 20)]
                indicators.append(Indicator(
                    category=rule["category"],
                    title=rule["title"],
                    description=rule["description"],
                    severity=rule["severity"],
                    evidence_snippet=snippet.strip(),
                    confidence=0.88
                ))
                break # Avoid duplicate hits in same rule
                
    # Evaluate behavioral manipulation factors
    behavioral_factors: List[BehavioralFactor] = []
    for factor_name, patterns in BEHAVIOR_PATTERNS.items():
        detected = False
        evidence = None
        for p in patterns:
            match = re.search(p, text_lower)
            if match:
                detected = True
                evidence = match.group(0)
                break
        
        score = 85 if detected else 10
        behavioral_factors.append(BehavioralFactor(
            name=factor_name,
            score=score,
            detected=detected,
            evidence=evidence
        ))
        
    return indicators, behavioral_factors
