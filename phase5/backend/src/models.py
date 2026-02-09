from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import Enum as SAEnum, ARRAY, String
from enum import Enum
import uuid


class Priority(str, Enum):
    """Task priority levels."""
    high = "high"
    medium = "medium"
    low = "low"


class RecurrencePattern(str, Enum):
    """Recurrence patterns for recurring tasks."""
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: str = Field(primary_key=True)
    email: Optional[str] = Field(default=None, unique=True, index=True)
    username: Optional[str] = Field(default=None)
    password_hash: Optional[str] = Field(default=None)
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    
    # Phase 5: Intermediate features
    priority: Optional[Priority] = Field(
        default=Priority.medium,
        sa_column=Column(SAEnum(Priority), nullable=True, default="medium")
    )
    tags: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(ARRAY(String), nullable=True)
    )
    due_date: Optional[datetime] = Field(default=None)
    
    # Phase 5: Advanced features - Recurring tasks
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[RecurrencePattern] = Field(
        default=None,
        sa_column=Column(SAEnum(RecurrencePattern), nullable=True)
    )
    recurrence_end_date: Optional[datetime] = Field(default=None)
    parent_task_id: Optional[int] = Field(default=None, foreign_key="tasks.id")
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    user: Optional[User] = Relationship(back_populates="tasks")



class Conversation(SQLModel, table=True):
    """Stores chat conversations between user and AI assistant."""
    __tablename__ = "conversations"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    title: Optional[str] = Field(default=None, max_length=200)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Relationship
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)


class Message(SQLModel, table=True):
    """Stores individual messages within conversations."""
    __tablename__ = "messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: str = Field(foreign_key="conversations.id", index=True)
    role: str = Field()  # "user" or "assistant"
    content: str = Field()
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Relationship
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
