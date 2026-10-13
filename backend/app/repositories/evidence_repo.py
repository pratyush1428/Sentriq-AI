from typing import List, Optional, Dict
from datetime import datetime, timezone, timedelta
from backend.app.schemas.evidence import CybercrimeReport, EvidenceItem, SuspectDetails, FinancialLossDetails

class EvidenceRepository:
    def __init__(self):
        self._reports: Dict[str, CybercrimeReport] = {}
        self._pdf_cache: Dict[str, bytes] = {}
        self._zip_cache: Dict[str, bytes] = {}
        self._seed_default_reports()

    def _seed_default_reports(self):
        now = datetime.now(timezone.utc)
        rep1_id = "CR-2026-SBI-891"
        self._reports[rep1_id] = CybercrimeReport(
            id=rep1_id,
            scan_id="scn_sbi_demo",
            title="SBI KYC Impersonation & APK Delivery",
            reporting_pathway="financial_fraud",
            portal_url="https://cybercrime.gov.in/",
            recommended_category="Financial Fraud -> Banking Phishing",
            status="Acknowledgement Recorded",
            official_acknowledgement_number="2026/CYBER/IN/94821",
            suspect_details=SuspectDetails(
                phone_number="+91 98401 92831",
                upi_id="sbi_kyc_verify@ybl",
                suspicious_url="http://sbi-kyc-verify.online"
            ),
            financial_loss=FinancialLossDetails(
                amount_lost="15,000",
                transaction_id="UPI/2026/491823901",
                bank_or_upi_app="Google Pay / SBI Account"
            ),
            evidence_items=[
                EvidenceItem(
                    id=f"{rep1_id}_pdf",
                    filename=f"{rep1_id}_Evidence_Dossier.pdf",
                    file_type="application/pdf",
                    category="Official Evidence Dossier (PDF)",
                    sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    file_size_bytes=34200,
                    verification_tier="User-confirmed",
                    download_url=f"/api/v1/evidence/{rep1_id}/pdf",
                    is_portal_recommended=True
                )
            ],
            manifest_sha256="7a38b1d98fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
            language="en",
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(days=1)
        )

    def add(self, report: CybercrimeReport, pdf_bytes: bytes, zip_bytes: bytes):
        self._reports[report.id] = report
        self._pdf_cache[report.id] = pdf_bytes
        self._zip_cache[report.id] = zip_bytes
        return report

    def get_all(self) -> List[CybercrimeReport]:
        return list(reversed(list(self._reports.values())))

    def get_by_id(self, report_id: str) -> Optional[CybercrimeReport]:
        return self._reports.get(report_id)

    def get_pdf(self, report_id: str) -> Optional[bytes]:
        return self._pdf_cache.get(report_id)

    def get_zip(self, report_id: str) -> Optional[bytes]:
        return self._zip_cache.get(report_id)

    def update_status(self, report_id: str, status: Optional[str], ack_num: Optional[str]) -> Optional[CybercrimeReport]:
        report = self._reports.get(report_id)
        if not report:
            return None
        if status:
            report.status = status
        if ack_num:
            report.official_acknowledgement_number = ack_num
            report.status = "Acknowledgement Recorded"
        report.updated_at = datetime.now(timezone.utc)
        return report

evidence_repository = EvidenceRepository()
