from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    APP_NAME: str = "Sentriq AI Backend"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # API settings
    API_V1_STR: str = "/api/v1"
    CORS_ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://localhost:5173",
        "capacitor://localhost",
        "http://localhost",
        "*"
    ]
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sentriq.db"
    
    # Supabase (optional for hosted auth/db)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_ISSUER: str = ""
    SUPABASE_JWT_AUDIENCE: str = "authenticated"
    SUPABASE_JWKS_URL: str = ""
    
    # AI & Threat Intelligence providers
    GEMINI_API_KEY: str = ""
    GOOGLE_SAFE_BROWSING_API_KEY: str = ""
    
    # Upload controls
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["png", "jpg", "jpeg", "webp"]
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["mp3", "wav", "m4a", "ogg", "webm"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
