"""Notification processor - subscribes to reminder events and sends notifications."""
import os
import sys
import json
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()


class ReminderEvent(BaseModel):
    """Reminder event schema."""
    event_type: str
    task_id: int
    user_id: str
    title: str
    description: str | None = None
    due_date: str | None = None
    reminder_time: str
    timestamp: str


@app.post("/dapr/subscribe")
async def subscribe():
    """Tell Dapr which topics to subscribe to."""
    subscriptions = [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "reminder-notifications",
            "route": "/reminder-notifications"
        }
    ]
    return subscriptions


@app.post("/reminder-notifications")
async def handle_reminder(event_data: dict):
    """Handle reminder notification events."""
    try:
        # Parse event
        event = ReminderEvent(**event_data)
        
        print(f"[NotificationProcessor] Received reminder for task {event.task_id}: {event.title}")
        
        # In a real implementation, this would:
        # 1. Send push notification to user's device
        # 2. Send email notification
        # 3. Send WebSocket message to connected frontend
        # 4. Store notification in database for later retrieval
        
        # For now, just log it
        notification_payload = {
            "user_id": event.user_id,
            "task_id": event.task_id,
            "title": f"Reminder: {event.title}",
            "body": event.description or "Task is due soon!",
            "due_date": event.due_date,
            "type": "reminder",
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"[NotificationProcessor] Notification payload: {json.dumps(notification_payload, indent=2)}")
        
        # TODO: Implement actual notification delivery
        # - WebSocket to frontend
        # - Push notification via FCM/APNS
        # - Email via SendGrid/SES
        
        return {"status": "ok", "notification_sent": True}
    
    except Exception as e:
        print(f"[NotificationProcessor] Error processing reminder: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "notification-processor"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
