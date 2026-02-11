"use client";

import { useState } from "react";
import { patients, complianceData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const complianceByPatient = patients.map((p) => ({
  name: p.fullName.split(" ").slice(-2).join(" "),
  fullName: p.fullName,
  rate: p.complianceRate,
  status: p.status,
  missedDays: Math.floor((100 - p.complianceRate) / 10),
  streak: p.complianceRate > 80 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 3),
}));

export default function ComplianceReportPage() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-02-10");

  const avgCompliance = Math.round(patients.reduce((s, p) => s + p.complianceRate, 0) / patients.length);
  const lowCompliance = patients.filter((p) => p.complianceRate < 60);
  const highCompliance = patients.filter((p) => p.complianceRate >= 80);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo tuân thủ điều trị</h1>
          <p className="text-muted-foreground">Phân tích tỷ lệ tuân thủ phác đồ và cảnh báo bỏ tập</p>
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
            <p className="text-sm text-muted-foreground">Tuân thủ trung bình</p>
            <p className="text-3xl font-bold">{avgCompliance}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tuân thủ tốt ({"\u2265"}80%)</p>
            <p className="text-3xl font-bold text-green-600">{highCompliance.length}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tuân thủ thấp ({"<"}60%)</p>
                <p className="text-3xl font-bold text-red-600">{lowCompliance.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng tuân thủ theo tuần</CardTitle>
          <CardDescription>Tỷ lệ tuân thủ trung bình hàng tuần</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" name="Tỷ lệ tuân thủ (%)" radius={[4, 4, 0, 0]}>
                {complianceData.map((entry, index) => (
                  <Cell key={index} fill={entry.rate >= 80 ? "#16a34a" : entry.rate >= 60 ? "#eab308" : "#dc2626"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tuân thủ theo bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceByPatient} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} fontSize={12} />
              <YAxis dataKey="name" type="category" fontSize={12} width={100} />
              <Tooltip formatter={(value) => [`${value}%`, "Tuân thủ"]} />
              <Bar dataKey="rate" name="Tuân thủ (%)" radius={[0, 4, 4, 0]}>
                {complianceByPatient.map((entry, index) => (
                  <Cell key={index} fill={entry.rate >= 80 ? "#16a34a" : entry.rate >= 60 ? "#eab308" : "#dc2626"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {lowCompliance.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Bệnh nhân cần chú ý
            </CardTitle>
            <CardDescription>Các bệnh nhân có tỷ lệ tuân thủ dưới 60%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Chẩn đoán</TableHead>
                  <TableHead>Tuân thủ</TableHead>
                  <TableHead>Phiên cuối</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowCompliance.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.fullName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{p.diagnosis}</TableCell>
                    <TableCell><Badge variant="destructive">{p.complianceRate}%</Badge></TableCell>
                    <TableCell>{p.lastSessionAt ? new Date(p.lastSessionAt).toLocaleDateString("vi-VN") : "\u2014"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{p.notes ?? "\u2014"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
