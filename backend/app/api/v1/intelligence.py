from typing import List
from fastapi import APIRouter, Depends
from backend.app.schemas.intelligence import RegionalTrendItem, OfficialRegistryItem
from backend.app.repositories.intel_repo import intel_repository
from backend.app.core.security import verify_token

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

@router.get("/trends", response_model=List[RegionalTrendItem])
def get_regional_trends(user: dict = Depends(verify_token)):
    return intel_repository.get_regional_trends()

@router.get("/official-sources", response_model=List[OfficialRegistryItem])
def get_official_sources(user: dict = Depends(verify_token)):
    return intel_repository.get_official_sources()
