'use client'

import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/lib/store'

export function EmptyState() {
  const searchQuery = useTaskStore((state) => state.searchQuery)

  if (searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary">
          <Sparkles className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No results found</h3>
        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
          We couldn&apos;t find any tasks matching &ldquo;{searchQuery}&rdquo;. Try a different search term.
        </p>
        <Button
          variant="outline"
          onClick={() => useTaskStore.getState().setSearchQuery('')}
          className="rounded-lg"
        >
          Clear search
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="relative mb-6">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Plus className="size-6 text-primary" />
          </div>
        </div>
        <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-lg bg-success/20">
          <Sparkles className="size-4 text-success" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">No tasks yet</h3>
      <p className="mb-6 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        Your task list is empty. Create your first task to get started and boost your productivity.
      </p>
      <Button className="gap-2 rounded-lg bg-primary px-6 text-primary-foreground hover:bg-primary/90">
        <Plus className="size-4" />
        Create your first task
      </Button>
    </motion.div>
  )
}
