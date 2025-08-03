from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # First user in match
    user2_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Second user in match
    is_active = Column(Boolean, default=True)  # Match is active
    matched_at = Column(DateTime(timezone=True), server_default=func.now())  # When match was created
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])
    likes = relationship("Like", back_populates="match")

    def __repr__(self):
        return f"<Match(id={self.id}, user1_id={self.user1_id}, user2_id={self.user2_id}, is_active={self.is_active})>"
