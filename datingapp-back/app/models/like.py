from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from ..database import Base


class LikeType(PyEnum):
    LIKE = "like"
    DISLIKE = "dislike"


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    liker_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who liked
    liked_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who was liked
    like_type = Column(Enum(LikeType), nullable=False)
    is_active = Column(Boolean, default=True)  # Can be deactivated if user changes mind
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True)  # Link to match if mutual
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    liker = relationship("User", foreign_keys=[liker_id])
    liked = relationship("User", foreign_keys=[liked_id])
    match = relationship("Match", back_populates="likes")

    def __repr__(self):
        return f"<Like(id={self.id}, liker_id={self.liker_id}, liked_id={self.liked_id}, type='{self.like_type}')>"
