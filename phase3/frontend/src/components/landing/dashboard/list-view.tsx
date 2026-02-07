'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TaskCard } from './task-card'
import { EmptyState } from './empty-state'
import { useTaskStore } from '@/lib/store'

export function ListView() {
  const filteredTasks = useTaskStore((state) => state.filteredTasks())

  if (filteredTasks.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-1"
    >
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            <TaskCard task={task} variant="list" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
