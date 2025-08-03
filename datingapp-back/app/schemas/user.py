from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    telegram_id: int = Field(..., description="Telegram user ID")
    username: Optional[str] = Field(None, description="Telegram username")
    first_name: Optional[str] = Field(None, description="First name from Telegram")
    last_name: Optional[str] = Field(None, description="Last name from Telegram")
    language_code: Optional[str] = Field(None, description="User's language code")


class UserCreate(UserBase):
    """Schema for creating a new user"""
    pass


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_code: Optional[str] = None
    is_active: Optional[bool] = None
    is_premium: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    is_premium: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
