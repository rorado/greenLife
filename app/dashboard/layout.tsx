"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-100 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <nav
            className="relative w-full bg-background shadow-lg overflow-y-auto min:h-screen"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex justify-end p-4 md:hidden fixed right-1.5">
              <Button
                className=""
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <DashboardSidebar />
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <DashboardSidebar />
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-4 p-4 border-b bg-background sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
