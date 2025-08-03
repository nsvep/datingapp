from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, index=True, nullable=False)
    username = Column(String, nullable=True)  # Telegram username (optional)
    first_name = Column(String, nullable=True)  # From Telegram
    last_name = Column(String, nullable=True)   # From Telegram
    language_code = Column(String(10), nullable=True)  # User's language
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)  # Telegram Premium status
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(id={self.id}, telegram_id={self.telegram_id}, username='{self.username}')>"
