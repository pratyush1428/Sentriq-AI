from fastapi import APIRouter
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.scans import router as scans_router
from backend.app.api.v1.reports import router as reports_router
from backend.app.api.v1.intelligence import router as intel_router
from backend.app.api.v1.users import router as users_router
from backend.app.api.v1.evidence import router as evidence_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(scans_router)
api_router.include_router(reports_router)
api_router.include_router(intel_router)
api_router.include_router(users_router)
api_router.include_router(evidence_router)
