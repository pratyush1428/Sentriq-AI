from typing import List, Dict, Any, Optional
from backend.app.schemas.scans import Indicator, BehavioralFactor, ImpersonationDetails, UrlAnalysisDetails

def calculate_risk_and_explanation(
    indicators: List[Indicator],
    behavioral_factors: List[BehavioralFactor],
    impersonation: ImpersonationDetails,
    url_details: Optional[UrlAnalysisDetails],
    detected_lang: str,
    original_text: str
) -> Dict[str, Any]:
    score = 5 # baseline floor for untrusted external message
    
    # Weight indicators
    for ind in indicators:
        if ind.severity == "critical":
            score += 35
        elif ind.severity == "high":
            score += 25
        elif ind.severity == "medium":
            score += 15
        elif ind.severity == "low":
            score += 8
            
    # Weight behavioral manipulation
    active_behaviors = [b for b in behavioral_factors if b.detected]
    score += len(active_behaviors) * 8
    
    # Weight impersonation mismatch
    if impersonation.status == "suspicious_mismatch":
        score += 30
    elif impersonation.status == "unknown_claim":
        score += 15
        
    # Weight URL risk
    if url_details:
        if url_details.reputation_status == "malicious":
            score += 40
        elif url_details.reputation_status == "suspicious":
            score += 25
        elif url_details.is_shortener:
            score += 15
            
    # Cap score
    score = max(5, min(98, score))
    
    # Classify severity
    if score >= 85:
        severity = "critical"
    elif score >= 60:
        severity = "high"
    elif score >= 30:
        severity = "medium"
    else:
        severity = "low"
        
    # Generate human-friendly summary & explanation
    summary_parts = []
    actions = []
    
    if severity in ("critical", "high"):
        summary_parts.append(f"High-probability digital fraud attempt detected.")
        if impersonation.claimed_organization:
            summary_parts.append(f"Impersonates {impersonation.claimed_organization} using artificial urgency and threats.")
        if any(b.name == "Urgency" for b in active_behaviors):
            summary_parts.append("Uses artificial urgency to bypass logical caution.")
            
        actions.append("Do NOT click any links, download files, or call the telephone number provided in the message.")
        actions.append("Do NOT share OTPs, UPI PINs, Net Banking passwords, or Aadhaar numbers under any circumstances.")
        actions.append("If money was already debited, immediately dial 1930 (National Cyber Crime Helpline) or report to cybercrime.gov.in within the golden hour.")
        if impersonation.claimed_organization:
            actions.append(f"To verify legitimate account status, log into the official {impersonation.claimed_organization} portal or branch directly.")
    elif severity == "medium":
        summary_parts.append("Suspicious indicators present. Exercise caution.")
        actions.append("Verify the sender's identity through official customer support before responding.")
        actions.append("Avoid clicking shortened links or entering sensitive credentials.")
    else:
        summary_parts.append("No prominent phishing patterns detected in this content.")
        actions.append("Always remain vigilant. Genuine organizations will never ask for your confidential banking credentials.")

    explanation = " ".join(summary_parts)
    if "Tanglish" in detected_lang:
        explanation += " (Detected regional Tanglish communication with coercive messaging patterns)."
    elif "Hinglish" in detected_lang:
        explanation += " (Detected regional Hinglish communication with coercive messaging patterns)."

    return {
        "risk_score": score,
        "severity": severity,
        "summary": summary_parts[0] if summary_parts else "Analysis completed.",
        "explanation": explanation,
        "recommended_actions": actions
    }
