from typing import List
from datetime import datetime, timezone
from backend.app.schemas.intelligence import RegionalTrendItem, OfficialRegistryItem
from backend.app.services.verification.official_registry import OFFICIAL_REGISTRY

class IntelligenceRepository:
    def get_regional_trends(self) -> List[RegionalTrendItem]:
        now = datetime.now(timezone.utc)
        return [
            RegionalTrendItem(
                id="trend_chennai_eb",
                region="Chennai",
                title="Fake electricity bill messages are surging",
                category="Utility Impersonation",
                report_count=1840,
                change_percentage="+38%",
                severity="high",
                description="Reports are up 38%. Scammers are threatening same-day power cuts to create panic. Victims receive SMS asking them to call personal numbers.",
                period="This Week",
                source="TNEB Vigilance & Citizen Incident Network",
                updated_at=now
            ),
            RegionalTrendItem(
                id="trend_delhi_arrest",
                region="Delhi NCR",
                title="Digital Arrest impersonating CBI & Police",
                category="Coercion & Extortion",
                report_count=920,
                change_percentage="+24%",
                severity="critical",
                description="Scammers initiate Skype/WhatsApp video calls wearing mock police uniforms, claiming victim's Aadhaar is linked to illegal narcotics courier.",
                period="This Week",
                source="Delhi Cyber Cell Advisory",
                updated_at=now
            ),
            RegionalTrendItem(
                id="trend_bengaluru_kyc",
                region="Bengaluru",
                title="Fake SBI & HDFC APK download campaigns",
                category="Banking Trojan",
                report_count=1410,
                change_percentage="+19%",
                severity="high",
                description="SMS containing links to download fake Yono or HDFC NetBanking APK files designed to siphon SMS OTPs.",
                period="This Week",
                source="Karnataka Cyber Command Center",
                updated_at=now
            )
        ]

    def get_official_sources(self) -> List[OfficialRegistryItem]:
        results = []
        for key, val in OFFICIAL_REGISTRY.items():
            results.append(OfficialRegistryItem(
                id=key,
                organization_name=val["name"],
                organization_type=val["type"],
                official_domain=val["official_domains"][0],
                known_scam_tactics=val["scam_tactics"],
                legitimate_communication_rules=val["legitimate_rules"],
                emergency_helpline=val["emergency_helpline"]
            ))
        return results

intel_repository = IntelligenceRepository()
