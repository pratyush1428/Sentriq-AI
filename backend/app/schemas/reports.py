from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

class ReportSummary(BaseModel):
    total_scans: int
    high_risk_scans: int
    medium_risk_scans: int
    low_risk_scans: int
    scams_blocked_count: int
    average_risk_score: float
    detection_distribution: Dict[str, int]
    weekly_activity: List[Dict[str, Any]]
    common_indicators: List[Dict[str, Any]]

class UserReportSubmission(BaseModel):
    scan_id: Optional[str] = None
    category: str
    description: str
    suspicious_sender: Optional[str] = None
    target_medium: Optional[str] = "SMS" # SMS, WhatsApp, Email, Call, QR
