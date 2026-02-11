"use client";

import { useState } from "react";
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
  Dumbbell,
  FolderOpen,
  UserCog,
  ChevronLeft,
  ChevronDown,
  Activity,
  TrendingUp,
  CheckSquare,
  ClipboardCheck,
  Dumbbell as DumbbellIcon,
  CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Bệnh nhân", href: "/patients", icon: Users },
  { title: "Kết quả & AI", href: "/metrics", icon: BarChart3 },
  { title: "Video Review", href: "/videos", icon: Video },
  { title: "Tin nhắn", href: "/chat", icon: MessageCircle },
  { title: "Telehealth", href: "/telehealth", icon: Phone },
  { title: "Thông báo", href: "/notifications", icon: Bell },
  {
    title: "Báo cáo",
    href: "/reports",
    icon: FileText,
    children: [
      { title: "Tổng hợp", href: "/reports", icon: FileText },
      { title: "Tiến triển BN", href: "/reports/progress", icon: TrendingUp },
      { title: "Tuân thủ điều trị", href: "/reports/compliance", icon: CheckSquare },
      { title: "Hiệu quả phác đồ", href: "/reports/protocols", icon: ClipboardCheck },
      { title: "Hoạt động bài tập", href: "/reports/exercises", icon: DumbbellIcon },
      { title: "Lịch hẹn", href: "/reports/appointments", icon: CalendarCheck },
    ],
  },
];

const adminNav: NavItem[] = [
  { title: "Quản lý user", href: "/admin/users", icon: UserCog },
  { title: "Phác đồ", href: "/protocols", icon: ClipboardList },
  { title: "Bài tập", href: "/admin/exercises", icon: Dumbbell },
  { title: "Danh mục", href: "/admin/categories", icon: FolderOpen },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(
    pathname.startsWith("/reports") ? ["/reports"] : []
  );

  const toggleExpand = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : hasChildren
          ? pathname.startsWith(item.href)
          : pathname === item.href || pathname.startsWith(item.href);
    const isExpanded = expandedMenus.includes(item.href);

    if (hasChildren && !collapsed) {
      return (
        <div key={item.href}>
          <button
            onClick={() => toggleExpand(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l pl-3">
              {item.children!.map((child) => {
                const childActive = child.href === "/reports"
                  ? pathname === "/reports"
                  : pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                      childActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <child.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{child.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

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
  };

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
          {mainNav.map((item) => renderNavItem(item))}
        </div>

        <Separator className="my-4" />

        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Quản trị
          </p>
        )}
        <div className="space-y-1">
          {adminNav.map((item) => renderNavItem(item))}
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
              <p className="text-xs text-muted-foreground">Bác sĩ</p>
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
