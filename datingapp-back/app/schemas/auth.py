from pydantic import BaseModel, Field
from typing import Optional
from .user import UserResponse


class TelegramAuthData(BaseModel):
    """Schema for Telegram authentication data"""
    telegram_id: int = Field(..., description="Telegram user ID")
    username: Optional[str] = Field(None, description="Telegram username")
    first_name: Optional[str] = Field(None, description="First name from Telegram")
    last_name: Optional[str] = Field(None, description="Last name from Telegram")
    language_code: Optional[str] = Field(None, description="User's language code")
    is_premium: Optional[bool] = Field(False, description="Telegram Premium status")
    auth_date: int = Field(..., description="Unix timestamp of auth")
    hash: str = Field(..., description="Telegram auth hash for verification")


class AuthResponse(BaseModel):
    """Schema for authentication response"""
    user: UserResponse
    is_new_user: bool = Field(..., description="True if user was just created")
    access_token: Optional[str] = Field(None, description="JWT access token (if implemented)")
    
    class Config:
        from_attributes = True
