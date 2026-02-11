"use client";

import { useState } from "react";
import Link from "next/link";
import { patients } from "@/lib/mock-data";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Eye, Plus, Search } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang điều trị", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  attention: { label: "Cần chú ý", variant: "destructive" },
  inactive: { label: "Ngừng", variant: "outline" },
};

function getComplianceBadge(rate: number) {
  if (rate >= 80) return { variant: "default" as const, className: "bg-green-600 hover:bg-green-700" };
  if (rate >= 60) return { variant: "default" as const, className: "bg-yellow-500 hover:bg-yellow-600" };
  return { variant: "destructive" as const, className: "" };
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = patients.filter((p: Patient) => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Danh sách bệnh nhân</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bệnh nhân
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang điều trị</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="attention">Cần chú ý</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead className="hidden md:table-cell">Chẩn đoán</TableHead>
                <TableHead className="hidden lg:table-cell">Phác đồ</TableHead>
                <TableHead>Tuân thủ</TableHead>
                <TableHead className="hidden sm:table-cell">Phiên cuối</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Không tìm thấy bệnh nhân nào.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((patient) => {
                  const compBadge = getComplianceBadge(patient.complianceRate);
                  const status = statusConfig[patient.status];
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <Link href={`/patients/${patient.id}`} className="text-primary hover:underline">
                          {patient.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{patient.phone}</TableCell>
                      <TableCell>{Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}</TableCell>
                      <TableCell>{patient.gender === "male" ? "Nam" : "Nữ"}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">{patient.diagnosis}</TableCell>
                      <TableCell className="hidden lg:table-cell">{patient.currentProtocolName ?? "\u2014"}</TableCell>
                      <TableCell>
                        <Badge variant={compBadge.variant} className={compBadge.className}>{patient.complianceRate}%</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {patient.lastSessionAt ? new Date(patient.lastSessionAt).toLocaleDateString("vi-VN") : "\u2014"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/patients/${patient.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
