"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Calendar,
  Tag,
  Users,
} from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Design system updates",
    status: "done",
    priority: "high",
    assignee: "SK",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "API integration review",
    status: "in-progress",
    priority: "medium",
    assignee: "JD",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "User research synthesis",
    status: "todo",
    priority: "high",
    assignee: "MR",
    dueDate: "Jan 28",
  },
  {
    id: 4,
    title: "Performance optimization",
    status: "todo",
    priority: "low",
    assignee: "AL",
    dueDate: "Jan 30",
  },
];

const priorityColors = {
  high: "bg-destructive/20 text-destructive",
  medium: "bg-warning/20 text-warning-foreground",
  low: "bg-muted text-muted-foreground",
};

export function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0]);

  useEffect(() => {
    if (!containerRef.current) return;

    const taskItems = containerRef.current.querySelectorAll(".task-item");
    gsap.fromTo(
      taskItems,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 1.5,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <motion.div
      ref={containerRef}
      style={{ y, rotateX, transformPerspective: 1200 }}
      className="relative mx-auto max-w-5xl"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/25 via-accent/15 to-primary/25 blur-2xl" />

      {/* Browser Chrome */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Title Bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/60" />
            <div className="h-3 w-3 rounded-full bg-warning/60" />
            <div className="h-3 w-3 rounded-full bg-success/60" />
          </div>
          <div className="mx-auto flex h-7 w-72 items-center justify-center rounded-md bg-background px-3 text-xs text-muted-foreground">
            app.taskflow.com
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-56 border-r border-border bg-muted/30 p-4 md:block">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  TF
                </span>
              </div>
              <span className="font-semibold">TaskFlow</span>
            </div>
            <nav className="space-y-1">
              {["Inbox", "My Tasks", "Projects", "Team"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-md px-3 py-2 text-sm ${
                    i === 1
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">My Tasks</h2>
                <p className="text-sm text-muted-foreground">
                  4 tasks, 1 completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Filter</span>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className="task-item flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/50"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {task.status === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}

                  <span
                    className={`flex-1 text-sm ${
                      task.status === "done"
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      priorityColors[task.priority as keyof typeof priorityColors]
                    }`}
                  >
                    {task.priority}
                  </span>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {task.assignee}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </span>

                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
