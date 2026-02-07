"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/landing/dashboard/app-slider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen>
            <div className="flex min-h-screen bg-background text-foreground overflow-hidden w-full">
                <AppSidebar />
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
