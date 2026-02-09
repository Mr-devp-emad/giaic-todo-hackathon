"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/landing/dashboard/app-sidebar";
import { Toaster } from "react-hot-toast";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen>
            <div className="flex min-h-screen bg-background text-foreground overflow-hidden w-full">
                <Toaster position="top-right" />
                <AppSidebar />
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
