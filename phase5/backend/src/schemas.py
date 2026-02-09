from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ============ Auth Schemas ============

class UserCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)
    username: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    email: Optional[str] = Field(None, min_length=5, max_length=255)
    username: Optional[str] = Field(None, min_length=2, max_length=100)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str


# ============ Task Schemas ============

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[str] = Field(default="medium", pattern="^(high|medium|low)$")
    tags: Optional[list[str]] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    # Recurring task fields
    is_recurring: Optional[bool] = Field(default=False)
    recurrence_pattern: Optional[str] = Field(default=None, pattern="^(daily|weekly|monthly)$")
    recurrence_end_date: Optional[datetime] = Field(default=None)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = Field(default=None, pattern="^(high|medium|low)$")
    tags: Optional[list[str]] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    # Recurring task fields
    is_recurring: Optional[bool] = Field(default=None)
    recurrence_pattern: Optional[str] = Field(default=None, pattern="^(daily|weekly|monthly)$")
    recurrence_end_date: Optional[datetime] = Field(default=None)


class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    priority: Optional[str] = "medium"
    tags: Optional[list[str]] = None
    due_date: Optional[datetime] = None
    # Recurring task fields
    is_recurring: bool = False
    recurrence_pattern: Optional[str] = None
    recurrence_end_date: Optional[datetime] = None
    parent_task_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime


    class Config:
        from_attributes = True



# ============== Chat Schemas ==============

class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    response: str
    conversation_id: str
