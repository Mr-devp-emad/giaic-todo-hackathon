"""Recurring task processor - subscribes to task events and creates recurring instances."""
import os
import sys
import asyncio
import json
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Session, select, create_engine
from src.models import Task, RecurrencePattern
from src.services import RecurringTaskService

app = FastAPI()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/todoapp")
engine = create_engine(DATABASE_URL)


class TaskEvent(BaseModel):
    """Task event schema."""
    event_type: str
    task_id: int
    user_id: str
    title: str
    completed: bool = False
    old_completed: bool = False
    is_recurring: bool = False
    recurrence_pattern: str | None = None
    parent_task_id: int | None = None
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
    """Handle task events from Kafka."""
    try:
        # Parse event
        event = TaskEvent(**event_data)
        
        print(f"[RecurringProcessor] Received event: {event.event_type} for task {event.task_id}")
        
        # Only process task.updated events where task was just completed
        if event.event_type == "task.updated" and event.completed and not event.old_completed:
            if event.is_recurring and event.recurrence_pattern:
                print(f"[RecurringProcessor] Task {event.task_id} is recurring, creating next instance...")
                
                # Get the task from database
                with Session(engine) as session:
                    task = session.get(Task, event.task_id)
                    if task:
                        recurring_service = RecurringTaskService(session)
                        next_instance = recurring_service.create_next_instance(task)
                        
                        if next_instance:
                            print(f"[RecurringProcessor] Created next instance: {next_instance.id}")
                        else:
                            print(f"[RecurringProcessor] No next instance created (recurrence ended)")
                    else:
                        print(f"[RecurringProcessor] Task {event.task_id} not found in database")
        
        return {"status": "ok"}
    
    except Exception as e:
        print(f"[RecurringProcessor] Error processing event: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "recurring-processor"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
