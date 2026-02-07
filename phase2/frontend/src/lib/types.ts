export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type ViewType = 'list' | 'board' | 'calendar';

export interface User {
  id?: string;
  name: string;
  email?: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  assignee?: User;
  project?: Project;
  projectId?: string;
  labels?: string[];
  createdAt?: string;
  updatedAt?: string;
}
