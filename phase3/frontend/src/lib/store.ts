"use client"

import { create } from 'zustand'
import { Task, ViewType, Status } from './types'

interface TaskStore {
  tasks: Task[]
  viewType: ViewType
  searchQuery: string
  setViewType: (view: ViewType) => void
  setSearchQuery: (query: string) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  filteredTasks: () => Task[]
  selectedTaskId: string | null
  isDrawerOpen: boolean
  openDrawer: (id: string) => void
  closeDrawer: () => void
  updateTaskStatus: (id: string, status: Status) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Design initial mockup',
      description: 'Create high-fidelity designs for the dashboard',
      status: 'todo',
      priority: 'high',
      projectId: '1',
    },
    {
      id: '2',
      title: 'Setup API endpoints',
      description: 'Implement core backend services',
      status: 'in-progress',
      priority: 'medium',
      projectId: '1',
    }
  ],
  viewType: 'list',
  searchQuery: '',
  setViewType: (view: ViewType) => set({ viewType: view }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  addTask: (task: Task) => set((state: TaskStore) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id: string, updates: Partial<Task>) =>
    set((state: TaskStore) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  removeTask: (id: string) =>
    set((state: TaskStore) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  selectedTaskId: null,
  isDrawerOpen: false,
  openDrawer: (id: string) => set({ selectedTaskId: id, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedTaskId: null }),
  updateTaskStatus: (id: string, status: Status) =>
    set((state: TaskStore) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
      ),
    })),
  filteredTasks: () => {
    const { tasks, searchQuery } = get()
    if (!searchQuery) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    )
  },
}));
