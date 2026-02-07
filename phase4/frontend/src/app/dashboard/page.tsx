"use client";

import { MainContent } from "@/components/landing/dashboard/main-content";
import { TaskDrawer } from "@/components/landing/dashboard/task-drawer";
import { NewTaskDialog } from "@/components/landing/dashboard/new-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background">
      <MainContent />
      <TaskDrawer />
      
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-2xl animate-glow"
          onClick={() => setIsNewTaskOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <NewTaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen} 
      />
    </div>
  );
}
