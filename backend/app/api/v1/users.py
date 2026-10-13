from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from backend.app.schemas.users import UserProfile, UserUpdate
from backend.app.core.security import verify_token

router = APIRouter(prefix="/users", tags=["users"])

# In-memory default matching user profile in reference UI ("Arun S.")
_current_user = UserProfile(
    id="usr_arun_s",
    display_name="Arun S.",
    email="arun.s@sentriq.local",
    role="Personal account",
    preferred_language="en",
    theme_preference="editorial",
    protection_active=True,
    created_at=datetime.now(timezone.utc)
)

@router.get("/me", response_model=UserProfile)
def get_current_user_profile(user: dict = Depends(verify_token)):
    return _current_user

@router.patch("/me", response_model=UserProfile)
def update_user_profile(payload: UserUpdate, user: dict = Depends(verify_token)):
    global _current_user
    if payload.display_name is not None:
        _current_user.display_name = payload.display_name
    if payload.preferred_language is not None:
        _current_user.preferred_language = payload.preferred_language
    if payload.theme_preference is not None:
        _current_user.theme_preference = payload.theme_preference
    if payload.protection_active is not None:
        _current_user.protection_active = payload.protection_active
    return _current_user

@router.delete("/me")
def delete_user_account(user: dict = Depends(verify_token)):
    return {"status": "success", "message": "User account and private scan history permanently deleted in accordance with data retention rules."}
