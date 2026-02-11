"use client";

import { useState } from "react";
import { notifications } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, CheckCheck } from "lucide-react";
import { AppNotification } from "@/types";

const typeLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  compliance_alert: { label: "Cảnh báo", variant: "destructive" },
  appointment: { label: "Lịch hẹn", variant: "default" },
  system: { label: "Hệ thống", variant: "secondary" },
  video_review: { label: "Video", variant: "outline" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
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
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <p className="text-muted-foreground">{unreadCount} thông báo chưa đọc</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({items.length})</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc ({unreadCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Không có thông báo nào.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Loại</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="hidden md:table-cell">Nội dung</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((n) => {
                  const type = typeLabel[n.type] || { label: n.type, variant: "secondary" as const };
                  return (
                    <TableRow
                      key={n.id}
                      className={!n.isRead ? "bg-primary/5 font-medium cursor-pointer" : "cursor-pointer"}
                      onClick={() => markRead(n.id)}
                    >
                      <TableCell>
                        <Badge variant={type.variant}>{type.label}</Badge>
                      </TableCell>
                      <TableCell className={!n.isRead ? "font-semibold" : ""}>
                        {!n.isRead && <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />}
                        {n.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate text-sm text-muted-foreground">
                        {n.message}
                      </TableCell>
                      <TableCell>{n.patientName ?? "\u2014"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{timeAgo(n.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
