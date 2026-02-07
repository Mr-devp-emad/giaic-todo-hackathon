'use client'

import { format } from 'date-fns'
import { X, Calendar, User, Flag, Tag, Clock, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTaskStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Status, Priority } from '@/lib/types'

const priorityConfig = {
  high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning-foreground' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
}

const statusConfig = {
  todo: { label: 'To Do' },
  'in-progress': { label: 'In Progress' },
  done: { label: 'Done' },
}

export function TaskDrawer() {
  const { tasks, selectedTaskId, isDrawerOpen, closeDrawer, updateTaskStatus } = useTaskStore()
  const task = tasks.find((t) => t.id === selectedTaskId)

  return (
    <AnimatePresence>
      {isDrawerOpen && task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Task Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDrawer}
                className="size-8 rounded-lg"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100%-73px)] flex-col overflow-y-auto">
              <div className="flex-1 space-y-6 p-6">
                {/* Title */}
                <div>
                  <h3 className="text-xl font-semibold leading-tight text-foreground">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    Status
                  </div>
                  <Select
                    value={task.status}
                    onValueChange={(value: Status) => updateTaskStatus(task.id, value)}
                  >
                    <SelectTrigger className="w-40 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(statusConfig).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flag className="size-4" />
                    Priority
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('font-medium', priorityConfig[task.priority].className)}
                  >
                    {priorityConfig[task.priority].label}
                  </Badge>
                </div>

                {/* Assignee */}
                {task.assignee && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="size-4" />
                      Assignee
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {task.assignee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">
                        {task.assignee.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      Due Date
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}

                {/* Labels */}
                {task.labels && task.labels.length > 0 && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="size-4" />
                      Labels
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {task.labels.map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Timestamps */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Created: {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'}</p>
                  <p>Updated: {task.updatedAt ? format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a') : 'N/A'}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border p-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
                >
                  <Trash2 className="size-4" />
                  Delete Task
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
