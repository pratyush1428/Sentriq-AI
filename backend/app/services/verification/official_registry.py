from typing import Dict, Any, Optional, List

OFFICIAL_REGISTRY: Dict[str, Dict[str, Any]] = {
    "sbi": {
        "name": "State Bank of India (SBI)",
        "type": "Bank",
        "official_domains": ["sbi.co.in", "onlinesbi.sbi", "onlinesbi.com"],
        "legitimate_rules": [
            "SBI never sends SMS from personal 10-digit mobile numbers.",
            "SBI never asks customers to click links to update KYC or Aadhaar.",
            "SBI never requests OTP or Net Banking passwords over call or text."
        ],
        "scam_tactics": [
            "Your SBI account will be blocked today - update KYC via apk/link",
            "SBI Rewards / Points expiration cash redemption links",
            "Fake APK download named SBI_Rewards.apk or SBI_Yono_Update.apk"
        ],
        "emergency_helpline": "1800 1234 / 1930 Cyber Helpline"
    },
    "hdfc": {
        "name": "HDFC Bank",
        "type": "Bank",
        "official_domains": ["hdfcbank.com"],
        "legitimate_rules": [
            "HDFC sends official SMS only from verified sender IDs like HDFCBK.",
            "Never asks for PAN/Aadhaar update via external bit.ly or apk links."
        ],
        "scam_tactics": [
            "HDFC NetBanking disabled - click link to reactivate within 24 hours."
        ],
        "emergency_helpline": "1800 202 6161 / 1930"
    },
    "icici": {
        "name": "ICICI Bank",
        "type": "Bank",
        "official_domains": ["icicibank.com"],
        "legitimate_rules": ["ICICI Bank will never ask for iMobile activation code or OTP."],
        "scam_tactics": ["iMobile Pay block notice, urgent KYC link."],
        "emergency_helpline": "1800 1080 / 1930"
    },
    "tneb": {
        "name": "TNEB / TANGEDCO (Tamil Nadu Electricity)",
        "type": "Utility",
        "official_domains": ["tnebltd.gov.in", "tangedco.org"],
        "legitimate_rules": [
            "TANGEDCO never assigns personal WhatsApp numbers to collect bills.",
            "Power disconnection notices are served formally, not through sudden threatening SMS."
        ],
        "scam_tactics": [
            "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately."
        ],
        "emergency_helpline": "94987 94987 / 1930"
    },
    "bescom": {
        "name": "BESCOM (Bangalore Electricity Supply)",
        "type": "Utility",
        "official_domains": ["bescom.karnataka.gov.in"],
        "legitimate_rules": ["BESCOM never asks for payments to personal UPI handles."],
        "scam_tactics": ["Power cut alert within 2 hours unless bill paid to officer number."],
        "emergency_helpline": "1912 / 1930"
    },
    "incometax": {
        "name": "Income Tax Department of India",
        "type": "Government",
        "official_domains": ["incometax.gov.in", "incometaxindia.gov.in"],
        "legitimate_rules": [
            "Tax refunds are credited directly to pre-validated bank accounts.",
            "Income Tax Dept never sends links asking for bank card details to approve refund."
        ],
        "scam_tactics": [
            "Income Tax refund of Rs 15,490 approved. Submit bank account details here to receive."
        ],
        "emergency_helpline": "1800 103 0025 / 1930"
    },
    "indiapost": {
        "name": "India Post (Department of Posts)",
        "type": "Government Delivery",
        "official_domains": ["indiapost.gov.in"],
        "legitimate_rules": [
            "India Post does not ask customers to pay Rs 25 redelivery fee through obscure short links."
        ],
        "scam_tactics": [
            "Your parcel is held at the sorting hub due to incorrect address. Update within 12h."
        ],
        "emergency_helpline": "1800 266 6868 / 1930"
    },
    "trai": {
        "name": "TRAI / Sanchar Saathi / DoT",
        "type": "Government Regulator",
        "official_domains": ["sancharsaathi.gov.in", "trai.gov.in", "dot.gov.in"],
        "legitimate_rules": [
            "DoT / TRAI never make automated calls threatening SIM disconnection for illegal activities."
        ],
        "scam_tactics": [
            "Digital arrest scam: claiming SIM was used in money laundering, press 9 to connect to Mumbai Police."
        ],
        "emergency_helpline": "1930 (National Cyber Crime Reporting Portal)"
    }
}

def find_claimed_entity(text: str) -> Optional[Dict[str, Any]]:
    text_lower = text.lower()
    
    keywords_map = {
        "sbi": ["sbi", "state bank", "yono"],
        "hdfc": ["hdfc"],
        "icici": ["icici"],
        "tneb": ["tneb", "tangedco", "electricity bill", "current bill", "eb bill"],
        "bescom": ["bescom", "kptcl"],
        "incometax": ["income tax", "it refund", "tax refund"],
        "indiapost": ["india post", "parcel delivery", "postal parcel", "post office parcel"],
        "trai": ["trai", "telecom department", "sanchar saathi", "sim card block", "sim disconnection"]
    }
    
    for key, keywords in keywords_map.items():
        for kw in keywords:
            if kw in text_lower:
                return {
                    "key": key,
                    **OFFICIAL_REGISTRY[key]
                }
    return None
