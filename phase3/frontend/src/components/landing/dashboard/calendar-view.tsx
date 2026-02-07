'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/lib/store'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const filteredTasks = useTaskStore((state) => state.filteredTasks())
  const openDrawer = useTaskStore((state) => state.openDrawer)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getTasksForDay = (day: Date) => {
    return filteredTasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), day))
  }

  const priorityColors = {
    high: 'bg-destructive',
    medium: 'bg-warning',
    low: 'bg-muted-foreground',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      {/* Calendar Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg bg-transparent"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg bg-transparent"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg bg-transparent"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="mb-2 grid grid-cols-7 gap-px">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.005 }}
              className={cn(
                'min-h-28 bg-card p-2 transition-colors hover:bg-accent/50',
                !isCurrentMonth && 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm',
                  isToday(day) && 'bg-primary font-semibold text-primary-foreground',
                  !isToday(day) && isCurrentMonth && 'text-foreground',
                  !isCurrentMonth && 'text-muted-foreground'
                )}
              >
                {format(day, 'd')}
              </div>

              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => openDrawer(task.id)}
                    className="group flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-xs transition-colors hover:bg-accent"
                  >
                    <div className={cn('size-1.5 shrink-0 rounded-full', priorityColors[task.priority])} />
                    <span className="truncate text-foreground">{task.title}</span>
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="w-fit text-[10px] font-normal"
                  >
                    +{dayTasks.length - 3} more
                  </Badge>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
