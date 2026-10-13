from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class UserProfile(BaseModel):
    id: str
    display_name: str
    email: str
    role: str = "citizen"
    preferred_language: str = "en"
    theme_preference: str = "editorial" # editorial (matches reference UI) or dark-cyber
    protection_active: bool = True
    created_at: datetime

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    preferred_language: Optional[str] = None
    theme_preference: Optional[str] = None
    protection_active: Optional[bool] = None
