"""Recurring task service for managing recurring task instances."""
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlmodel import Session, select
from src.models import Task, RecurrencePattern


class RecurringTaskService:
    """Service for managing recurring task instances."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_next_due_date(
        self, 
        pattern: RecurrencePattern, 
        current_date: datetime
    ) -> datetime:
        """Calculate the next due date based on recurrence pattern."""
        if pattern == RecurrencePattern.daily:
            return current_date + timedelta(days=1)
        elif pattern == RecurrencePattern.weekly:
            return current_date + timedelta(weeks=1)
        elif pattern == RecurrencePattern.monthly:
            # Add approximately one month (30 days)
            # For more accurate month calculation, could use dateutil
            next_month = current_date + timedelta(days=30)
            return next_month
        else:
            raise ValueError(f"Unknown recurrence pattern: {pattern}")
    
    def should_create_instance(self, parent_task: Task) -> bool:
        """Check if a new recurring instance should be created."""
        if not parent_task.is_recurring:
            return False
        
        if not parent_task.recurrence_pattern:
            return False
        
        # Check if recurrence has ended
        if parent_task.recurrence_end_date:
            now = datetime.now(timezone.utc)
            if now > parent_task.recurrence_end_date:
                return False
        
        # Check if parent task is completed
        if not parent_task.completed:
            return False
        
        return True
    
    def create_next_instance(self, parent_task: Task) -> Optional[Task]:
        """Create the next instance of a recurring task."""
        if not self.should_create_instance(parent_task):
            return None
        
        # Calculate next due date
        current_due_date = parent_task.due_date or datetime.now(timezone.utc)
        next_due_date = self.calculate_next_due_date(
            parent_task.recurrence_pattern,
            current_due_date
        )
        
        # Check if next instance would be after end date
        if parent_task.recurrence_end_date and next_due_date > parent_task.recurrence_end_date:
            return None
        
        # Create new task instance
        new_task = Task(
            user_id=parent_task.user_id,
            title=parent_task.title,
            description=parent_task.description,
            priority=parent_task.priority,
            tags=parent_task.tags,
            due_date=next_due_date,
            is_recurring=True,
            recurrence_pattern=parent_task.recurrence_pattern,
            recurrence_end_date=parent_task.recurrence_end_date,
            parent_task_id=parent_task.id,
            completed=False
        )
        
        self.db.add(new_task)
        self.db.commit()
        self.db.refresh(new_task)
        
        return new_task
    
    def get_recurring_instances(self, parent_task_id: int) -> list[Task]:
        """Get all instances of a recurring task."""
        statement = select(Task).where(Task.parent_task_id == parent_task_id)
        results = self.db.exec(statement)
        return list(results.all())
    
    def stop_recurrence(self, task: Task) -> bool:
        """Stop a task from recurring by setting end date to now."""
        if not task.is_recurring:
            return False
        
        task.recurrence_end_date = datetime.now(timezone.utc)
        self.db.add(task)
        self.db.commit()
        
        return True
