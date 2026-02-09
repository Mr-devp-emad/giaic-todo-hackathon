// Task type definitions for Phase 5
export interface Task {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: "high" | "medium" | "low";
    tags: string[] | null;
    due_date: string | null;
    // Phase 5: Recurring task fields
    is_recurring: boolean;
    recurrence_pattern: "daily" | "weekly" | "monthly" | null;
    recurrence_end_date: string | null;
    parent_task_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface TaskCreate {
    title: string;
    description?: string | null;
    priority?: "high" | "medium" | "low";
    tags?: string[] | null;
    due_date?: string | null;
    // Phase 5: Recurring task fields
    is_recurring?: boolean;
    recurrence_pattern?: "daily" | "weekly" | "monthly" | null;
    recurrence_end_date?: string | null;
}

export interface TaskUpdate {
    title?: string;
    description?: string | null;
    completed?: boolean;
    priority?: "high" | "medium" | "low";
    tags?: string[] | null;
    due_date?: string | null;
    // Phase 5: Recurring task fields
    is_recurring?: boolean;
    recurrence_pattern?: "daily" | "weekly" | "monthly" | null;
    recurrence_end_date?: string | null;
}
