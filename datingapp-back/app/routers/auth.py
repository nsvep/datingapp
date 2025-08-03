from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["authentication"])

# Simplified schemas
class TelegramUserData(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_code: Optional[str] = "en"
    is_premium: Optional[bool] = False

class AuthResult(BaseModel):
    success: bool
    user_id: int
    telegram_id: int
    first_name: Optional[str]
    last_name: Optional[str]
    username: Optional[str]
    is_new_user: bool
    message: str


@router.post("/telegram", response_model=AuthResult)
async def authenticate_telegram_user(
    user_data: TelegramUserData,
    db: Session = Depends(get_db)
):
    """
    Simple Telegram authentication:
    - Check if user exists by telegram_id
    - If exists: update and return user
    - If not exists: create new user and return
    """
    try:
        # Check if user already exists
        stmt = select(User).where(User.telegram_id == user_data.telegram_id)
        result = db.execute(stmt)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            # User exists - update with fresh data
            existing_user.username = user_data.username
            existing_user.first_name = user_data.first_name
            existing_user.last_name = user_data.last_name
            existing_user.language_code = user_data.language_code
            existing_user.is_premium = user_data.is_premium
            
            db.commit()
            db.refresh(existing_user)
            
            return AuthResult(
                success=True,
                user_id=existing_user.id,
                telegram_id=existing_user.telegram_id,
                first_name=existing_user.first_name,
                last_name=existing_user.last_name,
                username=existing_user.username,
                is_new_user=False,
                message="User logged in successfully"
            )
        else:
            # User doesn't exist - create new
            new_user = User(
                telegram_id=user_data.telegram_id,
                username=user_data.username,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                language_code=user_data.language_code,
                is_premium=user_data.is_premium,
                is_active=True
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            return AuthResult(
                success=True,
                user_id=new_user.id,
                telegram_id=new_user.telegram_id,
                first_name=new_user.first_name,
                last_name=new_user.last_name,
                username=new_user.username,
                is_new_user=True,
                message="New user registered successfully"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


class UserInfo(BaseModel):
    user_id: int
    telegram_id: int
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    language_code: Optional[str]
    is_premium: bool
    is_active: bool


@router.get("/me")
async def get_user_info(
    telegram_id: int,
    db: Session = Depends(get_db)
):
    """Get user information by telegram_id"""
    try:
        stmt = select(User).where(User.telegram_id == telegram_id)
        result = db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserInfo(
            user_id=user.id,
            telegram_id=user.telegram_id,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            language_code=user.language_code,
            is_premium=user.is_premium,
            is_active=user.is_active
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user info: {str(e)}")


@router.delete("/me")
async def delete_user_account(
    telegram_id: int,
    db: Session = Depends(get_db)
):
    """Delete user account by telegram_id"""
    try:
        stmt = select(User).where(User.telegram_id == telegram_id)
        result = db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(user)
        db.commit()
        
        return {
            "success": True,
            "message": "User account deleted successfully",
            "telegram_id": telegram_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")
