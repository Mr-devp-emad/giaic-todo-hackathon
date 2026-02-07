'use client'

import React from "react"

import { List, LayoutGrid, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ViewType } from '@/lib/types'
import { useTaskStore } from '@/lib/store'

const views: { type: ViewType; icon: React.ElementType; label: string }[] = [
  { type: 'list', icon: List, label: 'List' },
  { type: 'board', icon: LayoutGrid, label: 'Board' },
  { type: 'calendar', icon: Calendar, label: 'Calendar' },
]

export function ViewSwitcher() {
  const { viewType, setViewType } = useTaskStore()

  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
      {views.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          onClick={() => setViewType(type)}
          className={cn(
            'h-8 gap-2 rounded-md px-3 text-sm font-medium transition-all',
            viewType === type
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
          )}
        >
          <Icon className="size-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  )
}
