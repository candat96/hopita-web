"use client";

import { useState } from "react";
import { notifications } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Calendar, Bell, Video, Trash2, CheckCheck } from "lucide-react";
import { AppNotification } from "@/types";

const iconMap: Record<string, typeof Bell> = {
  compliance_alert: AlertTriangle,
  appointment: Calendar,
  system: Bell,
  video_review: Video,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phut truoc`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} gio truoc`;
  const days = Math.floor(hours / 24);
  return `${days} ngay truoc`;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(notifications);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "unread" ? items.filter((n) => !n.isRead) : items;
  const unreadCount = items.filter((n) => !n.isRead).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const deleteNotification = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Thong bao</h1><p className="text-muted-foreground">{unreadCount} thong bao chua doc</p></div>
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}><CheckCheck className="mr-2 h-4 w-4" />Danh dau tat ca da doc</Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList><TabsTrigger value="all">Tat ca ({items.length})</TabsTrigger><TabsTrigger value="unread">Chua doc ({unreadCount})</TabsTrigger></TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Khong co thong bao nao.</CardContent></Card>
        ) : (
          filtered.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <Card key={n.id} className={`cursor-pointer transition-colors ${!n.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""}`} onClick={() => markRead(n.id)}>
                <CardContent className="flex items-start gap-4 py-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.type === "compliance_alert" ? "bg-red-100 text-red-600" : n.type === "appointment" ? "bg-blue-100 text-blue-600" : n.type === "video_review" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                        {n.patientName && <Badge variant="outline" className="mt-1 text-xs">{n.patientName}</Badge>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
