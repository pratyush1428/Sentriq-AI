from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class Indicator(BaseModel):
    category: str = Field(..., description="E.g., Credential Request, Urgency Pressure, Impersonation, Suspicious Link")
    title: str
    description: str
    severity: str = Field(..., description="low, medium, high, critical")
    evidence_snippet: Optional[str] = None
    confidence: float = 0.85

class BehavioralFactor(BaseModel):
    name: str
    score: int = Field(..., ge=0, le=100, description="Intensity 0-100")
    detected: bool = False
    evidence: Optional[str] = None

class ImpersonationDetails(BaseModel):
    claimed_organization: Optional[str] = None
    organization_type: Optional[str] = None # bank, government, utility, courier, prize
    official_domain: Optional[str] = None
    is_verified_source: bool = False
    status: str = "no_impersonation" # authentic, suspicious_mismatch, unknown_claim, no_impersonation
    details: str

class UrlAnalysisDetails(BaseModel):
    target_url: str
    domain: str
    is_shortener: bool = False
    has_homoglyph_or_punycode: bool = False
    brand_domain_mismatch: bool = False
    reputation_status: str = "suspicious" # safe, suspicious, malicious, unverified
    risk_factors: List[str] = []

class ScanRequest(BaseModel):
    content: str = Field(..., description="The message, text, or URL to inspect")
    scan_type: str = Field("text", description="text, url, image, audio, qr")
    language_hint: Optional[str] = "auto"
    metadata: Optional[Dict[str, Any]] = None

class ScanResult(BaseModel):
    id: str
    scan_type: str
    status: str = "completed"
    risk_score: int = Field(..., ge=0, le=100)
    severity: str # low, medium, high, critical
    detected_language: str # English, Tamil, Hindi, Tanglish, Hinglish, Code-mixed
    language_display: str
    summary: str
    explanation: str
    indicators: List[Indicator] = []
    behavioral_factors: List[BehavioralFactor] = []
    impersonation: ImpersonationDetails
    url_analysis: Optional[UrlAnalysisDetails] = None
    official_verification: Dict[str, Any] = {}
    recommended_actions: List[str] = []
    raw_content_preview: Optional[str] = None
    created_at: datetime
