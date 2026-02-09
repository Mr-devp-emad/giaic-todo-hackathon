'use client'

import { format } from 'date-fns'
import { Calendar, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Task } from '@/lib/types'
import { useTaskStore } from '@/lib/store'

interface TaskCardProps {
  task: Task
  variant?: 'list' | 'card'
}

const priorityConfig = {
  high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning-foreground border-warning/20' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-border' },
}

const statusConfig = {
  todo: { label: 'To Do', className: 'bg-secondary text-secondary-foreground' },
  'in-progress': { label: 'In Progress', className: 'bg-info/10 text-info border-info/20' },
  done: { label: 'Done', className: 'bg-success/10 text-success border-success/20' },
}

export function TaskCard({ task, variant = 'list' }: TaskCardProps) {
  const { openDrawer, updateTaskStatus } = useTaskStore()
  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]

  if (variant === 'card') {
    return (
      <div
        onClick={() => openDrawer(task.id)}
        className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight text-card-foreground line-clamp-2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'todo')}>
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'in-progress')}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'done')}>
                Move to Done
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn('text-[10px] font-medium', priority.className)}>
            {priority.label}
          </Badge>
          {task.labels?.slice(0, 2).map((label: string) => (
            <Badge
              key={label}
              variant="secondary"
              className="text-[10px] font-normal bg-secondary/50"
            >
              {label}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'N/A'}
            </div>
          )}
          {task.assignee && (
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                {task.assignee.avatar}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => openDrawer(task.id)}
      className="group flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-card px-4 py-3 transition-all hover:border-border hover:bg-accent/50"
    >
      {/* Status Indicator */}
      <div
        className={cn(
          'size-2.5 shrink-0 rounded-full',
          task.status === 'done' && 'bg-success',
          task.status === 'in-progress' && 'bg-info',
          task.status === 'todo' && 'bg-muted-foreground/40'
        )}
      />

      {/* Title */}
      <div className="min-w-0 flex-1">
        <h4
          className={cn(
            'truncate text-sm font-medium text-card-foreground',
            task.status === 'done' && 'text-muted-foreground line-through'
          )}
        >
          {task.title}
        </h4>
      </div>

      {/* Priority Badge */}
      <Badge
        variant="outline"
        className={cn('hidden shrink-0 text-[10px] font-medium sm:inline-flex', priority.className)}
      >
        {priority.label}
      </Badge>

      {/* Status Badge */}
      <Badge
        variant="outline"
        className={cn('hidden shrink-0 text-[10px] font-medium md:inline-flex', status.className)}
      >
        {status.label}
      </Badge>

      {/* Labels */}
      <div className="hidden shrink-0 items-center gap-1 lg:flex">
        {task.labels?.slice(0, 2).map((label: string) => (
          <Badge key={label} variant="secondary" className="text-[10px] font-normal bg-secondary/50">
            {label}
          </Badge>
        ))}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground md:flex">
          <Calendar className="size-3" />
          {format(new Date(task.dueDate), 'MMM d')}
        </div>
      )}

      {/* Assignee */}
      {task.assignee && (
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
            {task.assignee.avatar}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'todo')}>
            Move to To Do
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'in-progress')}>
            Move to In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'done')}>
            Move to Done
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
