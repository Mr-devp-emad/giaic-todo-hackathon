"""Audit log processor - subscribes to all task events and stores audit trail."""
import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Session, Field, SQLModel, create_engine

app = FastAPI()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/todoapp")
engine = create_engine(DATABASE_URL)


class AuditLog(SQLModel, table=True):
    """Audit log model for tracking all task events."""
    __tablename__ = "audit_logs"
    
    id: int | None = Field(default=None, primary_key=True)
    event_type: str = Field(index=True)
    task_id: int = Field(index=True)
    user_id: str = Field(index=True)
    event_data: str  # JSON string of full event
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TaskEvent(BaseModel):
    """Task event schema."""
    event_type: str
    task_id: int
    user_id: str
    timestamp: str


@app.post("/dapr/subscribe")
async def subscribe():
    """Tell Dapr which topics to subscribe to."""
    subscriptions = [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "task-events",
            "route": "/task-events"
        }
    ]
    return subscriptions


@app.post("/task-events")
async def handle_task_event(event_data: dict):
    """Handle task events and store in audit log."""
    try:
        # Parse event
        event = TaskEvent(**event_data)
        
        print(f"[AuditProcessor] Logging event: {event.event_type} for task {event.task_id}")
        
        # Store in audit log
        with Session(engine) as session:
            audit_entry = AuditLog(
                event_type=event.event_type,
                task_id=event.task_id,
                user_id=event.user_id,
                event_data=json.dumps(event_data),
                timestamp=datetime.fromisoformat(event.timestamp)
            )
            
            session.add(audit_entry)
            session.commit()
            
            print(f"[AuditProcessor] Audit log entry created: {audit_entry.id}")
        
        return {"status": "ok", "logged": True}
    
    except Exception as e:
        print(f"[AuditProcessor] Error logging event: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "audit-processor"}


@app.on_event("startup")
async def startup():
    """Create audit_logs table on startup."""
    SQLModel.metadata.create_all(engine)
    print("[AuditProcessor] Database tables created")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8003"))
    uvicorn.run(app, host="0.0.0.0", port=port)
