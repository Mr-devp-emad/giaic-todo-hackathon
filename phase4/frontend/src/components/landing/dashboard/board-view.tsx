'use client'

import React from "react"

import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { TaskCard } from './task-card'
import { EmptyState } from './empty-state'
import { useTaskStore } from '@/lib/store'
import type { Status } from '@/lib/types'
import { cn } from '@/lib/utils'

const columns: { status: Status; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'todo', label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  { status: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-info' },
  { status: 'done', label: 'Done', icon: CheckCircle2, color: 'text-success' },
]

export function BoardView() {
  const filteredTasks = useTaskStore((state) => state.filteredTasks())
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)

  const tasksByStatus = columns.map((col) => ({
    ...col,
    tasks: filteredTasks.filter((task) => task.status === col.status),
  }))

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      updateTaskStatus(taskId, status)
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  if (filteredTasks.length === 0) {
    return <EmptyState />
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex min-w-max gap-4 pb-4">
        {tasksByStatus.map((column) => (
          <motion.div
            key={column.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-80 shrink-0"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <column.icon className={cn('size-4', column.color)} />
                <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {column.tasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Column Content */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
              className="flex min-h-[calc(100vh-280px)] flex-col gap-3 rounded-xl bg-secondary/30 p-3"
            >
              <AnimatePresence mode="popLayout">
                {column.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard task={task} variant="card" />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {column.tasks.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border/50 p-4">
                  <p className="text-sm text-muted-foreground">Drop tasks here</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
