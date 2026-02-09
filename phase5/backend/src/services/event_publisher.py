"""Event publisher service using Dapr pub/sub for task events."""
from typing import Optional
import httpx
import json
import os
from datetime import datetime
from src.models import Task


class EventPublisher:
    """Publishes task events to Kafka via Dapr pub/sub."""
    
    def __init__(self):
        self.dapr_port = os.getenv("DAPR_HTTP_PORT", "3500")
        self.dapr_url = f"http://localhost:{self.dapr_port}"
        self.pubsub_name = "kafka-pubsub"
        
    async def _publish(self, topic: str, data: dict) -> bool:
        """Publish event to Dapr pub/sub."""
        try:
            url = f"{self.dapr_url}/v1.0/publish/{self.pubsub_name}/{topic}"
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json=data,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                return True
        except Exception as e:
            # Log error but don't fail the main operation
            print(f"Failed to publish event to {topic}: {e}")
            return False
    
    async def publish_task_created(self, task: Task) -> bool:
        """Publish task created event."""
        event_data = {
            "event_type": "task.created",
            "task_id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "is_recurring": task.is_recurring,
            "recurrence_pattern": task.recurrence_pattern.value if task.recurrence_pattern else None,
            "timestamp": datetime.now().isoformat()
        }
        return await self._publish("task-events", event_data)
    
    async def publish_task_updated(self, task: Task, old_completed: bool) -> bool:
        """Publish task updated event."""
        event_data = {
            "event_type": "task.updated",
            "task_id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "completed": task.completed,
            "old_completed": old_completed,
            "is_recurring": task.is_recurring,
            "recurrence_pattern": task.recurrence_pattern.value if task.recurrence_pattern else None,
            "parent_task_id": task.parent_task_id,
            "timestamp": datetime.now().isoformat()
        }
        return await self._publish("task-events", event_data)
    
    async def publish_task_deleted(self, task_id: int, user_id: str) -> bool:
        """Publish task deleted event."""
        event_data = {
            "event_type": "task.deleted",
            "task_id": task_id,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        }
        return await self._publish("task-events", event_data)
    
    async def publish_reminder(self, task: Task, reminder_time: datetime) -> bool:
        """Publish reminder notification event."""
        event_data = {
            "event_type": "reminder.due",
            "task_id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "reminder_time": reminder_time.isoformat(),
            "timestamp": datetime.now().isoformat()
        }
        return await self._publish("reminder-notifications", event_data)


# Singleton instance
event_publisher = EventPublisher()
