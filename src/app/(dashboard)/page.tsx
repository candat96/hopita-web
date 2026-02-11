"use client";

import {
  Users,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  dashboardStats,
  complianceData,
  progressOverview,
  patients,
  appointments,
} from "@/lib/mock-data";
import Link from "next/link";

const statCards = [
  {
    title: "Tổng bệnh nhân",
    value: dashboardStats.totalPatients,
    description: `${dashboardStats.activePatients} đang điều trị / ${dashboardStats.completedPatients} hoàn thành / ${dashboardStats.attentionPatients} cần chú ý`,
    icon: Users,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Lịch hẹn sắp tới",
    value: dashboardStats.upcomingAppointments,
    description: "Trong 7 ngày tới",
    icon: CalendarDays,
    trend: "+2",
    trendUp: true,
  },
  {
    title: "Tỷ lệ tuân thủ",
    value: `${dashboardStats.complianceRate}%`,
    description: "Trung bình tất cả bệnh nhân",
    icon: TrendingUp,
    trend: "+5%",
    trendUp: true,
  },
  {
    title: "Cảnh báo",
    value: dashboardStats.alertsCount,
    description: "Bệnh nhân cần chú ý",
    icon: AlertTriangle,
    trend: "+1",
    trendUp: false,
  },
];

const alertPatients = patients.filter((p) => p.status === "attention");

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan tình trạng bệnh nhân và điều trị
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${
                    stat.trendUp ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Compliance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ tuân thủ bài tập</CardTitle>
            <CardDescription>Compliance rate theo tuần</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={{ fill: "#0D9488" }}
                  name="Tỷ lệ tuân thủ (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Tiến triển bệnh nhân</CardTitle>
            <CardDescription>Số lượng bệnh nhân tiến triển theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="improved" name="Tiến triển" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stable" name="Ổn định" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="declined" name="Giảm" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Patient Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cảnh báo bệnh nhân</CardTitle>
              <CardDescription>
                Bệnh nhân tập sai hoặc bỏ tập
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/patients?status=attention">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Vấn đề</TableHead>
                  <TableHead>Tuân thủ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertPatients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        href={`/patients/${p.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {p.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {p.notes || "Cần theo dõi"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.complianceRate < 50 ? "destructive" : "secondary"}>
                        {p.complianceRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lịch hẹn sắp tới</CardTitle>
              <CardDescription>5 lịch hẹn gần nhất</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/telehealth">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {apt.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(-2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.scheduledAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      apt.type === "telehealth"
                        ? "default"
                        : apt.type === "initial"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {apt.type === "telehealth"
                      ? "Online"
                      : apt.type === "initial"
                      ? "Lần đầu"
                      : "Tái khám"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
