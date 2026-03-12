"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Leaf,
  LayoutDashboard,
  Map,
  Cloud,
  Sprout,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/farm-map", label: "Farm Map", icon: Map },
  { href: "/dashboard/weather", label: "Weather", icon: Cloud },
  {
    href: "/dashboard/recommendations",
    label: "Recommendations",
    icon: Sprout,
  },
  { href: "/dashboard/reports", label: "Yield Reports", icon: BarChart3 },
];

interface User {
  name: string;
  plan?: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "??";

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col flex-shrink-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-sidebar-accent p-2 rounded-lg">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">AgriSmart</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>

        {/* User info from DB */}
        <div className="flex items-center gap-3 p-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-bold">{initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">
              {user?.name || "Loading..."}
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              {user?.plan || "Free Plan"}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4 justify-center gap-2 bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground"
          onClick={async () => {
            try {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/";
            } catch (err) {
              console.error(err);
              alert("Failed to logout");
            }
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
