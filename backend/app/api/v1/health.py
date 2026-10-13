from fastapi import APIRouter
from backend.app.core.config import settings
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "modules": {
            "multilingual_nlp": "active",
            "url_intelligence": "active",
            "impersonation_registry": "active",
            "behavioral_analysis": "active",
            "ocr_scanner": "active",
            "qr_decoder": "active"
        }
    }
