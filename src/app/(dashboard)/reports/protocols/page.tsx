"use client";

import { protocols, patients } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const protocolStats = protocols.map((pr) => {
  const assignedPatients = patients.filter((p) => p.currentProtocolId === pr.id);
  const avgCompliance = assignedPatients.length > 0
    ? Math.round(assignedPatients.reduce((s, p) => s + p.complianceRate, 0) / assignedPatients.length)
    : 0;
  const completedCount = patients.filter((p) => p.status === "completed").length;
  return {
    id: pr.id,
    name: pr.name,
    targetCondition: pr.targetCondition,
    durationWeeks: pr.durationWeeks,
    exerciseCount: pr.exercises.length,
    assignedCount: pr.assignedPatientCount,
    activeCount: assignedPatients.filter((p) => p.status === "active").length,
    avgCompliance,
    completionRate: pr.assignedPatientCount > 0 ? Math.round((completedCount / pr.assignedPatientCount) * 100) : 0,
    isTemplate: pr.isTemplate,
  };
});

const chartData = protocolStats.map((p) => ({
  name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
  "Tuân thủ TB": p.avgCompliance,
  "BN đang dùng": p.assignedCount,
}));

export default function ProtocolsReportPage() {
  const totalAssigned = protocolStats.reduce((s, p) => s + p.assignedCount, 0);
  const avgCompliance = protocolStats.length > 0
    ? Math.round(protocolStats.reduce((s, p) => s + p.avgCompliance, 0) / protocolStats.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo hiệu quả phác đồ</h1>
          <p className="text-muted-foreground">So sánh kết quả, tỷ lệ hoàn thành giữa các phác đồ</p>
        </div>
        <Button variant="outline" onClick={() => alert("Xuất báo cáo...")}><Download className="mr-2 h-4 w-4" />Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng phác đồ</p>
            <p className="text-2xl font-bold">{protocols.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Phác đồ mẫu</p>
            <p className="text-2xl font-bold">{protocols.filter((p) => p.isTemplate).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng BN được gán</p>
            <p className="text-2xl font-bold">{totalAssigned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tuân thủ TB</p>
            <p className="text-2xl font-bold">{avgCompliance}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>So sánh phác đồ</CardTitle>
          <CardDescription>Tỷ lệ tuân thủ trung bình và số bệnh nhân mỗi phác đồ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tuân thủ TB" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="BN đang dùng" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Chi tiết từng phác đồ</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phác đồ</TableHead>
                <TableHead>Bệnh lý</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Số bài tập</TableHead>
                <TableHead>BN được gán</TableHead>
                <TableHead>BN đang tập</TableHead>
                <TableHead>Tuân thủ TB</TableHead>
                <TableHead>Loại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocolStats.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell>{p.targetCondition}</TableCell>
                  <TableCell>{p.durationWeeks} tuần</TableCell>
                  <TableCell>{p.exerciseCount}</TableCell>
                  <TableCell>{p.assignedCount}</TableCell>
                  <TableCell>{p.activeCount}</TableCell>
                  <TableCell>
                    <Badge variant={p.avgCompliance >= 80 ? "default" : p.avgCompliance >= 60 ? "secondary" : "destructive"}>
                      {p.avgCompliance}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.isTemplate ? "outline" : "secondary"}>
                      {p.isTemplate ? "Mẫu" : "Tùy chỉnh"}
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
