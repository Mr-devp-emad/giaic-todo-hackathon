"""MCP server initialization and tool registration."""

from typing import List, Dict, Any, Callable

# Tool registry
_tools: Dict[str, Callable] = {}


def register_tool(name: str, func: Callable) -> None:
    """Register a tool function."""
    _tools[name] = func


def get_tool(name: str) -> Callable:
    """Get a registered tool function."""
    if name not in _tools:
        raise ValueError(f"Tool '{name}' not found")
    return _tools[name]


def get_all_tools() -> Dict[str, Callable]:
    """Get all registered tools."""
    return _tools.copy()


def get_mcp_tools() -> List[Dict[str, Any]]:
    """
    Get tool definitions for OpenAI Agent.
    
    Returns a list of tool definitions in OpenAI function calling format.
    """
    from .tools import add_task, list_tasks, complete_task, delete_task, update_task
    
    # Register all tools
    register_tool("add_task", add_task)
    register_tool("list_tasks", list_tasks)
    register_tool("complete_task", complete_task)
    register_tool("delete_task", delete_task)
    register_tool("update_task", update_task)
    
    # Define tools in OpenAI function calling format
    tools = [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user with optional priority, tags, and due date",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "User identifier from JWT token"
                        },
                        "title": {
                            "type": "string",
                            "description": "Task title (max 200 characters)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Task description (optional, max 1000 characters)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                            "description": "Task priority (default: medium)"
                        },
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of tags for the task (e.g., ['work', 'urgent'])"
                        },
                        "due_date": {
                            "type": "string",
                            "description": "Due date in ISO format (e.g., 2026-02-15T10:00:00)"
                        }
                    },
                    "required": ["user_id", "title"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "Retrieve user's tasks with optional filtering by status, priority, tag, or search keyword",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "User identifier from JWT token"
                        },
                        "status": {
                            "type": "string",
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter tasks by status (default: all)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                            "description": "Filter tasks by priority"
                        },
                        "tag": {
                            "type": "string",
                            "description": "Filter tasks containing this tag"
                        },
                        "search": {
                            "type": "string",
                            "description": "Search keyword in title or description"
                        }
                    },
                    "required": ["user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "complete_task",
                "description": "Mark a task as completed",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "User identifier from JWT token"
                        },
                        "task_id": {
                            "type": "integer",
                            "description": "ID of the task to complete"
                        }
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Delete a task permanently",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "User identifier from JWT token"
                        },
                        "task_id": {
                            "type": "integer",
                            "description": "ID of the task to delete"
                        }
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update task fields including title, description, priority, tags, due date, or completion status",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "User identifier from JWT token"
                        },
                        "task_id": {
                            "type": "integer",
                            "description": "ID of the task to update"
                        },
                        "title": {
                            "type": "string",
                            "description": "New task title (optional)"
                        },
                        "description": {
                            "type": "string",
                            "description": "New task description (optional)"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                            "description": "New priority (optional)"
                        },
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "New list of tags (optional)"
                        },
                        "due_date": {
                            "type": "string",
                            "description": "New due date in ISO format, or empty string to clear (optional)"
                        },
                        "completed": {
                            "type": "boolean",
                            "description": "New completion status (optional)"
                        }
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        }
    ]
    
    return tools
