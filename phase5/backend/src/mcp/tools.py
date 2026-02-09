"""MCP tool implementations for task management."""

from typing import Optional, Dict, Any, List
from sqlmodel import Session, select
from datetime import datetime, timezone

from ..database import engine
from ..models import Task, Priority


def add_task(
    user_id: str, 
    title: str, 
    description: Optional[str] = None,
    priority: Optional[str] = "medium",
    tags: Optional[List[str]] = None,
    due_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a new task for the user.
    
    Args:
        user_id: User identifier from JWT token
        title: Task title (required, max 200 chars)
        description: Task description (optional, max 1000 chars)
        priority: Task priority ("high", "medium", "low"), defaults to "medium"
        tags: List of tag strings (optional)
        due_date: Due date in ISO format (optional)
    
    Returns:
        Dictionary with success status, task_id, title, and message
    """
    # Validate inputs
    if not title or not title.strip():
        return {
            "success": False,
            "error": "Task title cannot be empty"
        }
    
    if len(title) > 200:
        return {
            "success": False,
            "error": "Task title must be 200 characters or less"
        }
    
    if description and len(description) > 1000:
        return {
            "success": False,
            "error": "Task description must be 1000 characters or less"
        }
    
    # Validate priority
    valid_priorities = ["high", "medium", "low"]
    if priority and priority.lower() not in valid_priorities:
        return {
            "success": False,
            "error": f"Priority must be one of: {', '.join(valid_priorities)}"
        }
    
    # Parse due_date if provided
    parsed_due_date = None
    if due_date:
        try:
            parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        except ValueError:
            return {
                "success": False,
                "error": "Invalid due_date format. Use ISO format (e.g., 2026-02-15T10:00:00)"
            }
    
    try:
        with Session(engine) as session:
            # Create new task with new fields
            new_task = Task(
                user_id=user_id,
                title=title.strip(),
                description=description.strip() if description else None,
                priority=Priority(priority.lower()) if priority else Priority.medium,
                tags=tags,
                due_date=parsed_due_date
            )
            
            session.add(new_task)
            session.commit()
            session.refresh(new_task)
            
            return {
                "success": True,
                "task_id": new_task.id,
                "title": new_task.title,
                "priority": new_task.priority.value if new_task.priority else "medium",
                "tags": new_task.tags,
                "due_date": new_task.due_date.isoformat() if new_task.due_date else None,
                "message": f"Task '{new_task.title}' created successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to create task: {str(e)}"
        }


def list_tasks(
    user_id: str, 
    status: str = "all",
    priority: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieve user's tasks with optional filtering.
    
    Args:
        user_id: User identifier from JWT token
        status: Filter by status ("all", "pending", "completed")
        priority: Filter by priority ("high", "medium", "low")
        tag: Filter by tag (tasks containing this tag)
        search: Search keyword in title or description
    
    Returns:
        Dictionary with success status, count, and list of tasks
    """
    try:
        with Session(engine) as session:
            # Build query filtered by user_id
            query = select(Task).where(Task.user_id == user_id)
            
            # Apply status filter
            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)
            # "all" - no additional filter
            
            # Apply priority filter
            if priority:
                try:
                    priority_enum = Priority(priority.lower())
                    query = query.where(Task.priority == priority_enum)
                except ValueError:
                    pass  # Ignore invalid priority
            
            # Apply search filter (case-insensitive)
            if search:
                search_pattern = f"%{search}%"
                query = query.where(
                    (Task.title.ilike(search_pattern)) | 
                    (Task.description.ilike(search_pattern))
                )
            
            # Order by created_at desc
            query = query.order_by(Task.created_at.desc())
            
            tasks = session.exec(query).all()
            
            # Apply tag filter (post-query since ARRAY contains is complex)
            if tag:
                tasks = [t for t in tasks if t.tags and tag.lower() in [tg.lower() for tg in t.tags]]
            
            # Format tasks with new fields
            task_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "priority": task.priority.value if task.priority else "medium",
                    "tags": task.tags or [],
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
            
            return {
                "success": True,
                "count": len(task_list),
                "tasks": task_list
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve tasks: {str(e)}"
        }


def complete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as completed.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to complete
    
    Returns:
        Dictionary with success status, task_id, completed status, and message
    """
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            # Mark as completed (idempotent)
            task.completed = True
            task.updated_at = datetime.now(timezone.utc)
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": task.id,
                "title": task.title,
                "completed": task.completed,
                "message": f"Task '{task.title}' marked as completed"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to complete task: {str(e)}"
        }


def delete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task permanently.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to delete
    
    Returns:
        Dictionary with success status, task_id, and message
    """
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            task_title = task.title
            
            # Delete task
            session.delete(task)
            session.commit()
            
            return {
                "success": True,
                "task_id": task_id,
                "message": f"Task '{task_title}' deleted successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to delete task: {str(e)}"
        }


def update_task(
    user_id: str, 
    task_id: int, 
    title: Optional[str] = None, 
    description: Optional[str] = None,
    priority: Optional[str] = None,
    tags: Optional[List[str]] = None,
    due_date: Optional[str] = None,
    completed: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Update task fields.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to update
        title: New task title (optional)
        description: New task description (optional)
        priority: New priority - "high", "medium", or "low" (optional)
        tags: New list of tags (optional)
        due_date: New due date in ISO format (optional)
        completed: New completion status (optional)
    
    Returns:
        Dictionary with success status, updated task info, and message
    """
    # Validate at least one field provided
    if all(v is None for v in [title, description, priority, tags, due_date, completed]):
        return {
            "success": False,
            "error": "No fields provided to update"
        }
    
    # Validate title if provided
    if title is not None:
        if not title.strip():
            return {
                "success": False,
                "error": "Task title cannot be empty"
            }
        if len(title) > 200:
            return {
                "success": False,
                "error": "Task title must be 200 characters or less"
            }
    
    # Validate description if provided
    if description is not None and len(description) > 1000:
        return {
            "success": False,
            "error": "Task description must be 1000 characters or less"
        }
    
    # Validate priority if provided
    valid_priorities = ["high", "medium", "low"]
    if priority is not None and priority.lower() not in valid_priorities:
        return {
            "success": False,
            "error": f"Priority must be one of: {', '.join(valid_priorities)}"
        }
    
    # Parse due_date if provided
    parsed_due_date = None
    if due_date is not None:
        if due_date == "":  # Allow clearing due date
            parsed_due_date = "clear"
        else:
            try:
                parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            except ValueError:
                return {
                    "success": False,
                    "error": "Invalid due_date format. Use ISO format (e.g., 2026-02-15T10:00:00)"
                }
    
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            # Update fields
            if title is not None:
                task.title = title.strip()
            if description is not None:
                task.description = description.strip() if description.strip() else None
            if priority is not None:
                task.priority = Priority(priority.lower())
            if tags is not None:
                task.tags = tags if tags else None
            if parsed_due_date is not None:
                task.due_date = None if parsed_due_date == "clear" else parsed_due_date
            if completed is not None:
                task.completed = completed
            
            task.updated_at = datetime.now(timezone.utc)
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority.value if task.priority else "medium",
                "tags": task.tags or [],
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed": task.completed,
                "message": f"Task '{task.title}' updated successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to update task: {str(e)}"
        }

