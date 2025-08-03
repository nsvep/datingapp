from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    url = Column(String(500), nullable=False)  # Photo URL
    is_primary = Column(Boolean, default=False)  # Main profile photo
    order = Column(Integer, default=0)  # Order of photos in profile
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to Profile
    profile = relationship("Profile", back_populates="photos")

    def __repr__(self):
        return f"<Photo(id={self.id}, profile_id={self.profile_id}, is_primary={self.is_primary})>"
