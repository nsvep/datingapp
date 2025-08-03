from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    display_name = Column(String(100), nullable=False)  # Display name for the app
    age = Column(Integer, nullable=False)
    bio = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    interests = Column(Text, nullable=True)  # JSON string with interests
    gender = Column(String(20), nullable=True)  # male, female, other
    looking_for = Column(String(20), nullable=True)  # male, female, both
    min_age = Column(Integer, default=18)
    max_age = Column(Integer, default=99)
    is_visible = Column(Boolean, default=True)  # Profile visibility
    is_complete = Column(Boolean, default=False)  # Profile completion status
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")
    photos = relationship("Photo", back_populates="profile", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Profile(id={self.id}, user_id={self.user_id}, display_name='{self.display_name}')>"
