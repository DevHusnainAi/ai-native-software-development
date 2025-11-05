"""Configuration and environment variables."""
import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


class Settings:
    """Application settings."""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    
    # Gemini Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # CORS Configuration
    ALLOWED_ORIGINS: list[str] = [
        "https://ai-native.panaversity.org",
        "https://panaversity.github.io",
        "http://localhost:3000",  # Local development
    ]
    
    # Database Configuration (for future)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    
    @property
    def gemini_configured(self) -> bool:
        """Check if Gemini API key is configured."""
        return bool(self.GEMINI_API_KEY)


settings = Settings()

