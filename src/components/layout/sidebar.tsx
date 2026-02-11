"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Video,
  Phone,
  Bell,
  FileText,
  Settings,
  Building2,
  Dumbbell,
  UserCog,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainNav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Benh nhan", href: "/patients", icon: Users },
  { title: "Phac do", href: "/protocols", icon: ClipboardList },
  { title: "Ket qua & AI", href: "/metrics", icon: BarChart3 },
  { title: "Video Review", href: "/videos", icon: Video },
  { title: "Telehealth", href: "/telehealth", icon: Phone },
  { title: "Thong bao", href: "/notifications", icon: Bell },
  { title: "Bao cao", href: "/reports", icon: FileText },
];

const adminNav = [
  { title: "Quan ly user", href: "/admin/users", icon: UserCog },
  { title: "Co so / Tenant", href: "/admin/tenants", icon: Building2 },
  { title: "Danh muc bai tap", href: "/admin/exercises", icon: Dumbbell },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Hopita</span>
          </Link>
        )}
        {collapsed && (
          <Activity className="mx-auto h-6 w-6 text-primary" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "mx-auto")}
          onClick={onToggle}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {mainNav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Quan tri
          </p>
        )}
        <div className="space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              NA
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">BS. Nguyen Van An</p>
              <p className="text-xs text-muted-foreground">Bac si</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
