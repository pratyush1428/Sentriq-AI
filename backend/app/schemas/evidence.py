from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class EvidenceItem(BaseModel):
    id: str
    filename: str
    file_type: str
    category: str # E.g., "Official Evidence Dossier (PDF)", "Original Scam Text", "Threat Intelligence Manifest"
    sha256_hash: str
    file_size_bytes: int
    verification_tier: str # "AI-extracted", "User-confirmed", "Unverified"
    download_url: str
    is_portal_recommended: bool = True

class SuspectDetails(BaseModel):
    phone_number: Optional[str] = None
    upi_id: Optional[str] = None
    email: Optional[str] = None
    suspicious_url: Optional[str] = None
    social_handle_or_platform: Optional[str] = None

class FinancialLossDetails(BaseModel):
    amount_lost: Optional[str] = None
    transaction_id: Optional[str] = None
    bank_or_upi_app: Optional[str] = None
    incident_date: Optional[str] = None

class EvidencePreparationRequest(BaseModel):
    scan_id: str
    reporting_pathway: str = "financial_fraud" # "suspect" | "financial_fraud"
    incident_category: Optional[str] = "Banking & KYC Phishing"
    language: str = "en" # "en" | "ta" | "te" | "hi"
    suspect_details: Optional[SuspectDetails] = None
    financial_loss: Optional[FinancialLossDetails] = None
    user_confirmed: bool = True

class CybercrimeReport(BaseModel):
    id: str
    scan_id: str
    title: str
    reporting_pathway: str # "suspect" | "financial_fraud"
    portal_url: str
    recommended_category: str
    status: str # "Draft" | "Report Prepared" | "Downloaded" | "User Marked as Submitted" | "Acknowledgement Recorded"
    official_acknowledgement_number: Optional[str] = None
    suspect_details: Optional[SuspectDetails] = None
    financial_loss: Optional[FinancialLossDetails] = None
    evidence_items: List[EvidenceItem] = []
    manifest_sha256: str
    language: str
    created_at: datetime
    updated_at: datetime

class UpdateReportStatusRequest(BaseModel):
    status: Optional[str] = None
    official_acknowledgement_number: Optional[str] = None
