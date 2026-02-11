"use client";

import { useState } from "react";
import { appointments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = { scheduled: "#6366f1", confirmed: "#0D9488", completed: "#16a34a", cancelled: "#dc2626" };
const STATUS_LABEL: Record<string, string> = { scheduled: "Đã lên lịch", confirmed: "Đã xác nhận", completed: "Hoàn thành", cancelled: "Đã hủy" };
const TYPE_LABEL: Record<string, string> = { followup: "Tái khám", initial: "Lần đầu", telehealth: "Telehealth" };

const statusData = Object.entries(
  appointments.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {})
).map(([status, count]) => ({
  name: STATUS_LABEL[status] || status,
  value: count,
  color: COLORS[status as keyof typeof COLORS] || "#94a3b8",
}));

const typeData = Object.entries(
  appointments.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {})
).map(([type, count]) => ({
  name: TYPE_LABEL[type] || type,
  value: count,
}));

const weekdayData = (() => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const counts = new Array(7).fill(0);
  appointments.forEach((a) => {
    const day = new Date(a.scheduledAt).getDay();
    counts[day]++;
  });
  return days.map((name, i) => ({ name, count: counts[i] }));
})();

export default function AppointmentsReportPage() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-02-28");

  const totalAppointments = appointments.length;
  const telehealthCount = appointments.filter((a) => a.type === "telehealth").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;
  const avgDuration = Math.round(appointments.reduce((s, a) => s + a.durationMinutes, 0) / appointments.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo lịch hẹn & Telehealth</h1>
          <p className="text-muted-foreground">Thống kê lịch hẹn, tỷ lệ hủy, và hoạt động telehealth</p>
        </div>
        <Button variant="outline" onClick={() => alert("Xuất báo cáo...")}><Download className="mr-2 h-4 w-4" />Xuất báo cáo</Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1"><Label className="text-xs">Từ ngày</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[160px]" /></div>
        <div className="space-y-1"><Label className="text-xs">Đến ngày</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[160px]" /></div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
            <p className="text-2xl font-bold">{totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Telehealth</p>
            <p className="text-2xl font-bold text-blue-600">{telehealthCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Đã hủy</p>
            <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Thời lượng TB</p>
            <p className="text-2xl font-bold">{avgDuration} phút</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn theo ngày trong tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Số lịch hẹn" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phân bổ theo loại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            {typeData.map((t) => (
              <div key={t.name} className="flex items-center gap-3 rounded-lg border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.name}</p>
                  <p className="text-2xl font-bold">{t.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Danh sách lịch hẹn</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Ngày giờ</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.patientName}</TableCell>
                  <TableCell>{a.doctorName}</TableCell>
                  <TableCell>{new Date(a.scheduledAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell>{a.durationMinutes} phút</TableCell>
                  <TableCell><Badge variant="outline">{TYPE_LABEL[a.type]}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={a.status === "completed" ? "default" : a.status === "cancelled" ? "destructive" : "secondary"}>
                      {STATUS_LABEL[a.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate text-sm text-muted-foreground">{a.notes ?? "\u2014"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
