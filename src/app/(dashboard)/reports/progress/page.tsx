"use client";

import { useState } from "react";
import { patients, romData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const patientProgress = patients.map((p) => {
  const romChange = p.status === "completed" ? 50 : p.status === "active" ? Math.floor(Math.random() * 30) + 10 : -5;
  return {
    ...p,
    romStart: 45,
    romCurrent: 45 + romChange,
    romChange,
    sessionsCompleted: Math.floor(Math.random() * 20) + 5,
    sessionsTotal: Math.floor(Math.random() * 10) + 25,
    avgScore: Math.floor(Math.random() * 20) + 75,
  };
});

export default function ProgressReportPage() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-02-10");

  const improved = patientProgress.filter((p) => p.romChange > 10).length;
  const stable = patientProgress.filter((p) => p.romChange >= 0 && p.romChange <= 10).length;
  const declined = patientProgress.filter((p) => p.romChange < 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo tiến triển bệnh nhân</h1>
          <p className="text-muted-foreground">Theo dõi ROM, điểm số và trạng thái phục hồi</p>
        </div>
        <Button variant="outline" onClick={() => alert("Xuất báo cáo...")}><Download className="mr-2 h-4 w-4" />Xuất báo cáo</Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1"><Label className="text-xs">Từ ngày</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[160px]" /></div>
        <div className="space-y-1"><Label className="text-xs">Đến ngày</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[160px]" /></div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tiến triển tốt</p>
                <p className="text-2xl font-bold text-green-600">{improved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Ổn định</p>
                <p className="text-2xl font-bold text-yellow-600">{stable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Giảm sút</p>
                <p className="text-2xl font-bold text-red-600">{declined}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ ROM theo thời gian (mẫu)</CardTitle>
          <CardDescription>Biên độ vận động trung bình của bệnh nhân</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={romData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 180]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="ROM hiện tại" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Chi tiết tiến triển từng bệnh nhân</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Chẩn đoán</TableHead>
                <TableHead>ROM ban đầu</TableHead>
                <TableHead>ROM hiện tại</TableHead>
                <TableHead>Thay đổi</TableHead>
                <TableHead>Phiên tập</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientProgress.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{p.diagnosis}</TableCell>
                  <TableCell>{p.romStart}°</TableCell>
                  <TableCell>{p.romCurrent}°</TableCell>
                  <TableCell>
                    <Badge variant={p.romChange > 10 ? "default" : p.romChange >= 0 ? "secondary" : "destructive"}>
                      {p.romChange > 0 ? "+" : ""}{p.romChange}°
                    </Badge>
                  </TableCell>
                  <TableCell>{p.sessionsCompleted}/{p.sessionsTotal}</TableCell>
                  <TableCell>{p.avgScore}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "active" ? "default" : p.status === "completed" ? "secondary" : "destructive"}>
                      {p.status === "active" ? "Đang điều trị" : p.status === "completed" ? "Hoàn thành" : "Cần chú ý"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
