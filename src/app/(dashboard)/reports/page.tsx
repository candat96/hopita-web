"use client";

import { useState } from "react";
import { patients, complianceData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("progress");
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-02-10");

  const activePatients = patients.filter((p) => p.status === "active");
  const avgCompliance = Math.round(patients.reduce((s, p) => s + p.complianceRate, 0) / patients.length);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Bao cao & Xuat du lieu</h1><p className="text-muted-foreground">Tao bao cao va xuat du lieu benh nhan</p></div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Tong benh nhan</p><p className="text-2xl font-bold">{patients.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Dang dieu tri</p><p className="text-2xl font-bold">{activePatients.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Tuan thu TB</p><p className="text-2xl font-bold">{avgCompliance}%</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Hoan thanh</p><p className="text-2xl font-bold">{patients.filter((p) => p.status === "completed").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>Tao bao cao</CardTitle>
              <CardDescription>Chon loai bao cao va khoang thoi gian</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert("Xuat PDF...")}><FileText className="mr-2 h-4 w-4" />Xuat PDF</Button>
              <Button variant="outline" onClick={() => alert("Xuat Excel...")}><FileSpreadsheet className="mr-2 h-4 w-4" />Xuat Excel</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <Tabs value={reportType} onValueChange={setReportType}>
              <TabsList><TabsTrigger value="progress">Tien trien benh nhan</TabsTrigger><TabsTrigger value="compliance">Tuan thu dieu tri</TabsTrigger></TabsList>
            </Tabs>
            <div className="flex gap-4">
              <div className="space-y-1"><Label className="text-xs">Tu ngay</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[160px]" /></div>
              <div className="space-y-1"><Label className="text-xs">Den ngay</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[160px]" /></div>
            </div>
          </div>

          {reportType === "progress" ? (
            <Table>
              <TableHeader><TableRow><TableHead>Benh nhan</TableHead><TableHead>Chan doan</TableHead><TableHead>Tuan thu</TableHead><TableHead>Trang thai</TableHead><TableHead>Phien cuoi</TableHead></TableRow></TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.fullName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{p.diagnosis}</TableCell>
                    <TableCell><Badge variant={p.complianceRate >= 80 ? "default" : p.complianceRate >= 60 ? "secondary" : "destructive"}>{p.complianceRate}%</Badge></TableCell>
                    <TableCell><Badge variant={p.status === "active" ? "default" : p.status === "completed" ? "secondary" : "destructive"}>{p.status}</Badge></TableCell>
                    <TableCell>{p.lastSessionAt ? new Date(p.lastSessionAt).toLocaleDateString("vi-VN") : "\u2014"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="rate" name="Ty le tuan thu (%)" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
