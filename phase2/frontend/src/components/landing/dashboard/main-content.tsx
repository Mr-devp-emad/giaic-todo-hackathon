'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewSwitcher } from './view-switcher'
import { ListView } from './list-view'
import { BoardView } from './board-view'
import { CalendarView } from './calendar-view'
import { useTaskStore } from '@/lib/store'

export function MainContent() {
  const viewType = useTaskStore((state) => state.viewType)
  const filteredTasks = useTaskStore((state) => state.filteredTasks())

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4 md:p-6">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Tasks</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} in total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg bg-transparent">
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg bg-transparent">
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
          <ViewSwitcher />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {viewType === 'list' && <ListView />}
            {viewType === 'board' && <BoardView />}
            {viewType === 'calendar' && <CalendarView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
