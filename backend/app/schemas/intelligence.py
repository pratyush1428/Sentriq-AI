from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class RegionalTrendItem(BaseModel):
    id: str
    region: str # e.g., Chennai, Delhi, Mumbai, Bengaluru, Hyderabad
    title: str
    category: str # e.g., Electricity Bill Scams, KYC Suspension, Fake Job, Lottery
    report_count: int
    change_percentage: str # e.g., "+38%"
    severity: str
    description: str
    period: str # e.g., "This Week"
    source: str # e.g., "Verified Citizen Reports & CERT-In Feed"
    updated_at: datetime

class OfficialRegistryItem(BaseModel):
    id: str
    organization_name: str
    organization_type: str # Bank, Government, Utility, Regulator, Delivery
    official_domain: str
    known_scam_tactics: List[str]
    legitimate_communication_rules: List[str]
    emergency_helpline: str
