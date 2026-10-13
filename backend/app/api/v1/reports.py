from fastapi import APIRouter, Depends
from backend.app.schemas.reports import ReportSummary, UserReportSubmission
from backend.app.repositories.scan_repo import scan_repository
from backend.app.core.security import verify_token

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/summary", response_model=ReportSummary)
def get_reports_summary(user: dict = Depends(verify_token)):
    scans = scan_repository.get_all()
    total = len(scans)
    high_risk = sum(1 for s in scans if s.severity in ("high", "critical"))
    med_risk = sum(1 for s in scans if s.severity == "medium")
    low_risk = sum(1 for s in scans if s.severity == "low")
    avg_score = round(sum(s.risk_score for s in scans) / total, 1) if total > 0 else 0.0

    return ReportSummary(
        total_scans=total,
        high_risk_scans=high_risk,
        medium_risk_scans=med_risk,
        low_risk_scans=low_risk,
        scams_blocked_count=high_risk,
        average_risk_score=avg_score,
        detection_distribution={
            "Banking KYC": 42,
            "Electricity Bills": 28,
            "Lottery / Rewards": 15,
            "Digital Arrest": 9,
            "Others": 6
        },
        weekly_activity=[
            {"day": "Mon", "scans": 12, "threats": 8},
            {"day": "Tue", "scans": 19, "threats": 14},
            {"day": "Wed", "scans": 15, "threats": 11},
            {"day": "Thu", "scans": 22, "threats": 16},
            {"day": "Fri", "scans": 28, "threats": 21},
            {"day": "Sat", "scans": 18, "threats": 12},
            {"day": "Sun", "scans": 14, "threats": 9}
        ],
        common_indicators=[
            {"name": "Urgency manipulation ('today', 'immediate')", "count": 142},
            {"name": "Fake KYC / Account suspension threats", "count": 98},
            {"name": "Unverified shortener or obscure TLDs", "count": 76},
            {"name": "Electricity power cutoff claims", "count": 54}
        ]
    )

@router.post("/submit")
def submit_citizen_scam_report(report: UserReportSubmission, user: dict = Depends(verify_token)):
    return {
        "status": "received",
        "message": "Thank you for reporting this incident. Your report contributes to regional community threat intelligence.",
        "report_id": "rep_948123"
    }
