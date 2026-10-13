import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from backend.app.schemas.scans import ScanResult, ImpersonationDetails, UrlAnalysisDetails
from backend.app.services.multilingual.language_detector import detect_language_and_scripts
from backend.app.services.verification.official_registry import find_claimed_entity, OFFICIAL_REGISTRY
from backend.app.services.url_analysis.analyzer import extract_urls, analyze_url
from backend.app.services.text_analysis.detector import analyze_text_indicators
from backend.app.services.risk_scoring.engine import calculate_risk_and_explanation
from backend.app.repositories.scan_repo import scan_repository

def perform_full_scan(content: str, scan_type: str = "text", language_hint: str = "auto") -> ScanResult:
    scan_id = f"scn_{uuid.uuid4().hex[:10]}"
    
    # 1. Detect language & scripts
    lang_info = detect_language_and_scripts(content)
    detected_lang = lang_info["detected_language"]
    language_display = lang_info["language_display"]
    
    # 2. Extract and analyze URLs
    urls = extract_urls(content) if scan_type != "url" else [content.strip()]
    url_details_obj = None
    
    # 3. Detect impersonation
    claimed = find_claimed_entity(content)
    if claimed:
        claimed_key = claimed.get("key")
        claimed_name = claimed.get("name")
        claimed_type = claimed.get("type")
        official_domains = claimed.get("official_domains", [])
        
        # Check if any URL belongs to official domain
        has_official_url = False
        if urls:
            first_url = urls[0]
            url_res = analyze_url(first_url, claimed_brand=claimed_key)
            url_details_obj = UrlAnalysisDetails(**url_res)
            
            for d in official_domains:
                if url_details_obj.domain.endswith(d):
                    has_official_url = True
                    break
        
        if urls and not has_official_url:
            impersonation_status = "suspicious_mismatch"
            details = f"Sender claims to represent {claimed_name}, but links lead to unauthorized domain '{url_details_obj.domain if url_details_obj else 'unknown'}'."
        elif has_official_url:
            impersonation_status = "authentic"
            details = f"Verified link pointing to official {claimed_name} domain."
        else:
            impersonation_status = "unknown_claim"
            details = f"Sender claims to represent {claimed_name}. Official communications only occur through secure verified channels."
            
        impersonation = ImpersonationDetails(
            claimed_organization=claimed_name,
            organization_type=claimed_type,
            official_domain=official_domains[0] if official_domains else None,
            is_verified_source=has_official_url,
            status=impersonation_status,
            details=details
        )
    else:
        if urls:
            url_res = analyze_url(urls[0])
            url_details_obj = UrlAnalysisDetails(**url_res)
            
        impersonation = ImpersonationDetails(
            claimed_organization=None,
            organization_type=None,
            official_domain=None,
            is_verified_source=False,
            status="no_impersonation",
            details="No specific government or banking institution impersonation detected."
        )
        
    # 4. Analyze linguistic and psychological triggers
    indicators, behavioral_factors = analyze_text_indicators(content)
    
    # 5. Calculate final weighted risk and human explanations
    risk_data = calculate_risk_and_explanation(
        indicators=indicators,
        behavioral_factors=behavioral_factors,
        impersonation=impersonation,
        url_details=url_details_obj,
        detected_lang=detected_lang,
        original_text=content
    )
    
    result = ScanResult(
        id=scan_id,
        scan_type=scan_type,
        status="completed",
        risk_score=risk_data["risk_score"],
        severity=risk_data["severity"],
        detected_language=detected_lang,
        language_display=language_display,
        summary=risk_data["summary"],
        explanation=risk_data["explanation"],
        indicators=indicators,
        behavioral_factors=behavioral_factors,
        impersonation=impersonation,
        url_analysis=url_details_obj,
        official_verification={
            "registry_checked": True,
            "claimed_entity": impersonation.claimed_organization,
            "helpline": claimed.get("emergency_helpline") if claimed else "1930"
        },
        recommended_actions=risk_data["recommended_actions"],
        raw_content_preview=content[:180] + ("..." if len(content) > 180 else ""),
        created_at=datetime.now(timezone.utc)
    )
    
    # Save to in-memory/database scan repository
    scan_repository.add(result)
    
    return result
