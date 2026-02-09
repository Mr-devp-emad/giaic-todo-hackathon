from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, or_, desc, asc

from ..database import get_session
from ..models import Task, Priority, RecurrencePattern
from ..schemas import TaskCreate, TaskUpdate, TaskResponse
from ..auth import get_current_user
from ..services import event_publisher, RecurringTaskService

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    tag_filter: Optional[str] = Query(None, alias="tag"),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc")
):
    """Get all tasks for the current user with filtering and sorting."""
    query = select(Task).where(Task.user_id == user_id)
    
    # Apply status filter
    if status_filter == "completed":
        query = query.where(Task.completed == True)
    elif status_filter == "active" or status_filter == "pending":
        query = query.where(Task.completed == False)
    
    # Apply priority filter
    if priority_filter and priority_filter.lower() in ["high", "medium", "low"]:
        try:
            query = query.where(Task.priority == Priority(priority_filter.lower()))
        except ValueError:
            pass
        
    # Apply search filter
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                Task.title.ilike(search_filter),
                Task.description.ilike(search_filter)
            )
        )
        
    # Apply sorting
    sort_column = getattr(Task, sort_by, Task.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    tasks = session.exec(query).all()
    
    # Apply tag filter (post-query for ARRAY)
    if tag_filter:
        tasks = [t for t in tasks if t.tags and tag_filter.lower() in [tag.lower() for tag in t.tags]]
    
    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Create a new task for the current user."""
    # Parse priority
    task_priority = Priority.medium
    if task_data.priority:
        try:
            task_priority = Priority(task_data.priority.lower())
        except ValueError:
            task_priority = Priority.medium
    
    # Parse recurrence pattern
    recurrence_pattern = None
    if task_data.is_recurring and task_data.recurrence_pattern:
        try:
            recurrence_pattern = RecurrencePattern(task_data.recurrence_pattern.lower())
        except ValueError:
            pass
    
    new_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_priority,
        tags=task_data.tags,
        due_date=task_data.due_date,
        is_recurring=task_data.is_recurring or False,
        recurrence_pattern=recurrence_pattern,
        recurrence_end_date=task_data.recurrence_end_date
    )
    
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    
    # Publish task created event
    await event_publisher.publish_task_created(new_task)
    
    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Get a specific task by ID."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Update a task. Can only update own tasks."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Store old completed status for event
    old_completed = task.completed
    
    # Update fields if provided
    update_data = task_data.model_dump(exclude_unset=True)
    
    # Parse recurrence pattern if provided
    if "recurrence_pattern" in update_data and update_data["recurrence_pattern"]:
        try:
            update_data["recurrence_pattern"] = RecurrencePattern(update_data["recurrence_pattern"].lower())
        except ValueError:
            update_data.pop("recurrence_pattern")
    
    for key, value in update_data.items():
        setattr(task, key, value)
    
    task.updated_at = datetime.now(timezone.utc)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    # Publish task updated event
    await event_publisher.publish_task_updated(task, old_completed)
    
    # If task was just completed and is recurring, create next instance
    if task.completed and not old_completed and task.is_recurring:
        recurring_service = RecurringTaskService(session)
        next_instance = recurring_service.create_next_instance(task)
        if next_instance:
            # Publish event for the new instance
            await event_publisher.publish_task_created(next_instance)
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Delete a task. Can only delete own tasks."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Publish task deleted event before deletion
    await event_publisher.publish_task_deleted(task.id, user_id)
    
    session.delete(task)
    session.commit()
    
    return None
