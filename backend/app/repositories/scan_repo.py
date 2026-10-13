from typing import List, Optional
from datetime import datetime, timezone, timedelta
from backend.app.schemas.scans import ScanResult, Indicator, BehavioralFactor, ImpersonationDetails, UrlAnalysisDetails

class ScanRepository:
    def __init__(self):
        self._scans: List[ScanResult] = []
        self._seed_default_data()

    def _seed_default_data(self):
        now = datetime.now(timezone.utc)
        # Seed 1: Exactly matches reference UI: SBI account blocked (92 High risk, 12 min ago)
        self._scans.append(ScanResult(
            id="scn_sbi_demo",
            scan_type="text",
            status="completed",
            risk_score=92,
            severity="high",
            detected_language="English",
            language_display="English",
            summary="High-probability digital fraud attempt detected.",
            explanation="Sender impersonates State Bank of India (SBI) using artificial urgency and threats. Message prompts victim to click an unverified domain link to prevent account freeze.",
            indicators=[
                Indicator(
                    category="Credential Solicitation",
                    title="Threat of Account Suspension for KYC",
                    description="Scammers claim bank accounts will be blocked today to induce panic.",
                    severity="high",
                    evidence_snippet="Your SBI account will be blocked today. Update KYC",
                    confidence=0.95
                ),
                Indicator(
                    category="Suspicious Link",
                    title="Brand Domain Mismatch",
                    description="Link points to unverified third-party host instead of onlinesbi.sbi",
                    severity="critical",
                    evidence_snippet="http://sbi-kyc-verify.online",
                    confidence=0.92
                )
            ],
            behavioral_factors=[
                BehavioralFactor(name="Urgency", score=90, detected=True, evidence="today"),
                BehavioralFactor(name="Fear & Threat", score=85, detected=True, evidence="blocked"),
                BehavioralFactor(name="Authority Pressure", score=80, detected=True, evidence="SBI"),
                BehavioralFactor(name="Financial Lure", score=10, detected=False),
                BehavioralFactor(name="Secrecy & Isolation", score=10, detected=False)
            ],
            impersonation=ImpersonationDetails(
                claimed_organization="State Bank of India (SBI)",
                organization_type="Bank",
                official_domain="onlinesbi.sbi",
                is_verified_source=False,
                status="suspicious_mismatch",
                details="Sender claims to represent State Bank of India, but link directs to unauthorized domain."
            ),
            url_analysis=UrlAnalysisDetails(
                target_url="http://sbi-kyc-verify.online",
                domain="sbi-kyc-verify.online",
                is_shortener=False,
                has_homoglyph_or_punycode=False,
                brand_domain_mismatch=True,
                reputation_status="malicious",
                risk_factors=["Brand impersonation keyword 'sbi' in untrusted .online TLD"]
            ),
            official_verification={
                "registry_checked": True,
                "claimed_entity": "State Bank of India (SBI)",
                "helpline": "1800 1234 / 1930"
            },
            recommended_actions=[
                "Do NOT click http://sbi-kyc-verify.online or enter net banking credentials.",
                "Legitimate SBI updates only take place inside the official Yono SBI app or bank branch.",
                "Call 1930 immediately if money was deducted."
            ],
            raw_content_preview="Your SBI account will be blocked today. Update KYC now at http://sbi-kyc-verify.online to avoid disconnection.",
            created_at=now - timedelta(minutes=12)
        ))

        # Seed 2: Tanglish EB Bill Threat (88 High risk)
        self._scans.append(ScanResult(
            id="scn_tneb_tanglish",
            scan_type="text",
            status="completed",
            risk_score=88,
            severity="high",
            detected_language="Tanglish",
            language_display="Tanglish (Romanized Tamil)",
            summary="Fake electricity bill disconnection fraud detected.",
            explanation="Uses Romanized Tamil (Tanglish) threatening electricity disconnection tonight at 9:30 PM due to unpaid bill. Prompts victim to call a personal mobile number.",
            indicators=[
                Indicator(
                    category="Utility Disconnection Threat",
                    title="Fake Electricity Bill Disconnection Alert",
                    description="Coercive threat of same-day electricity cutoff.",
                    severity="high",
                    evidence_snippet="EB bill kattala current cut aagum",
                    confidence=0.94
                )
            ],
            behavioral_factors=[
                BehavioralFactor(name="Urgency", score=95, detected=True, evidence="tonight 9:30 pm"),
                BehavioralFactor(name="Fear & Threat", score=90, detected=True, evidence="current cut aagum"),
                BehavioralFactor(name="Authority Pressure", score=85, detected=True, evidence="EB officer"),
                BehavioralFactor(name="Financial Lure", score=10, detected=False),
                BehavioralFactor(name="Secrecy & Isolation", score=10, detected=False)
            ],
            impersonation=ImpersonationDetails(
                claimed_organization="TNEB / TANGEDCO",
                organization_type="Utility",
                official_domain="tangedco.org",
                is_verified_source=False,
                status="unknown_claim",
                details="TANGEDCO never collects bill payments via personal WhatsApp numbers."
            ),
            url_analysis=None,
            official_verification={
                "registry_checked": True,
                "claimed_entity": "TNEB / TANGEDCO",
                "helpline": "94987 94987 / 1930"
            },
            recommended_actions=[
                "Do NOT dial the phone number provided in the SMS.",
                "Verify pending dues exclusively through official TANGEDCO portal (tangedco.org) or TNEB counter."
            ],
            raw_content_preview="Unga EB bill kattala current cut aagum innaikku night 9:30 PM ku. Udane officer number ku call pannunga.",
            created_at=now - timedelta(hours=2)
        ))

        # Seed 3: Low risk benign message
        self._scans.append(ScanResult(
            id="scn_safe_order",
            scan_type="text",
            status="completed",
            risk_score=8,
            severity="low",
            detected_language="English",
            language_display="English",
            summary="No significant phishing patterns detected.",
            explanation="Standard order notification with no credential requests, suspension threats, or deceptive links.",
            indicators=[],
            behavioral_factors=[
                BehavioralFactor(name="Urgency", score=10, detected=False),
                BehavioralFactor(name="Fear & Threat", score=10, detected=False),
                BehavioralFactor(name="Authority Pressure", score=10, detected=False),
                BehavioralFactor(name="Financial Lure", score=10, detected=False),
                BehavioralFactor(name="Secrecy & Isolation", score=10, detected=False)
            ],
            impersonation=ImpersonationDetails(
                claimed_organization=None,
                organization_type=None,
                official_domain=None,
                is_verified_source=False,
                status="no_impersonation",
                details="No bank or government body impersonation detected."
            ),
            url_analysis=None,
            official_verification={},
            recommended_actions=[
                "Message appears benign. Always refrain from sharing OTPs or banking credentials."
            ],
            raw_content_preview="Your grocery delivery from BigBasket has arrived at your security gate. Thank you for shopping with us.",
            created_at=now - timedelta(days=1)
        ))

    def get_all(self) -> List[ScanResult]:
        return self._scans

    def get_by_id(self, scan_id: str) -> Optional[ScanResult]:
        for s in self._scans:
            if s.id == scan_id:
                return s
        return None

    def add(self, scan: ScanResult) -> ScanResult:
        self._scans.insert(0, scan)
        return scan

    def delete(self, scan_id: str) -> bool:
        for i, s in enumerate(self._scans):
            if s.id == scan_id:
                self._scans.pop(i)
                return True
        return False

scan_repository = ScanRepository()
