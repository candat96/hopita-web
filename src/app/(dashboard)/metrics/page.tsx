"use client";

import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { patients, sessions, romData, progressOverview } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, ShieldCheck, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function MetricsPage() {
  const completedSessions = useMemo(() => sessions.filter((s) => s.status === "completed"), []);
  const skippedSessions = useMemo(() => sessions.filter((s) => s.status === "skipped"), []);

  const totalReps = completedSessions.length * 15;
  const avgAccuracy = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.accuracy ?? 0), 0) / completedSessions.length)
    : 0;
  const avgPosture = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.postureScore ?? 0), 0) / completedSessions.length)
    : 0;
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / completedSessions.length)
    : 0;
  const avgCompliance = Math.round(patients.reduce((s, p) => s + p.complianceRate, 0) / patients.length);

  const activePatients = patients.filter((p) => p.status === "active").length;
  const attentionPatients = patients.filter((p) => p.status === "attention").length;
  const completedPatients = patients.filter((p) => p.status === "completed").length;

  const baselineRom = romData[0]?.value ?? 0;
  const currentRom = romData[romData.length - 1]?.value ?? 0;

  // Patient compliance distribution
  const complianceDistribution = [
    { range: "90-100%", count: patients.filter((p) => p.complianceRate >= 90).length, color: "#16a34a" },
    { range: "70-89%", count: patients.filter((p) => p.complianceRate >= 70 && p.complianceRate < 90).length, color: "#0D9488" },
    { range: "50-69%", count: patients.filter((p) => p.complianceRate >= 50 && p.complianceRate < 70).length, color: "#eab308" },
    { range: "<50%", count: patients.filter((p) => p.complianceRate < 50).length, color: "#dc2626" },
  ];

  // Radar data for overall AI metrics
  const radarData = [
    { metric: "Độ chính xác", value: avgAccuracy, fullMark: 100 },
    { metric: "Tư thế", value: avgPosture, fullMark: 100 },
    { metric: "Điểm TB", value: avgScore, fullMark: 100 },
    { metric: "Tuân thủ", value: avgCompliance, fullMark: 100 },
    { metric: "Hoàn thành", value: sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0, fullMark: 100 },
  ];

  // Per-patient summary
  const patientMetrics = patients.map((p) => {
    const pSessions = sessions.filter((s) => s.patientId === p.id && s.status === "completed");
    const pAvgScore = pSessions.length > 0 ? Math.round(pSessions.reduce((s, ses) => s + (ses.score ?? 0), 0) / pSessions.length) : 0;
    const pAvgAccuracy = pSessions.length > 0 ? Math.round(pSessions.reduce((s, ses) => s + (ses.accuracy ?? 0), 0) / pSessions.length) : 0;
    const pAvgPosture = pSessions.length > 0 ? Math.round(pSessions.reduce((s, ses) => s + (ses.postureScore ?? 0), 0) / pSessions.length) : 0;
    const pSkipped = sessions.filter((s) => s.patientId === p.id && s.status === "skipped").length;
    return {
      ...p,
      sessionsCompleted: pSessions.length,
      sessionsSkipped: pSkipped,
      avgScore: pAvgScore,
      avgAccuracy: pAvgAccuracy,
      avgPosture: pAvgPosture,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Metrics & Kết quả</h1>
        <p className="text-muted-foreground">Tổng quan chỉ số phục hồi toàn bộ bệnh nhân</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Bệnh nhân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">{activePatients} đang điều trị</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Phiên tập</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">{completedSessions.length} hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Điểm TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <p className="text-xs text-muted-foreground">trên 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Độ chính xác</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground">trung bình</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Tư thế</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPosture}</div>
            <p className="text-xs text-muted-foreground">posture score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Tuân thủ</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompliance}%</div>
            <p className="text-xs text-muted-foreground">trung bình</p>
          </CardContent>
        </Card>
        <Card className={attentionPatients > 0 ? "border-red-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Cần chú ý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{attentionPatients}</div>
            <p className="text-xs text-muted-foreground">bệnh nhân</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan AI Metrics</CardTitle>
            <CardDescription>Radar trung bình toàn hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                <Radar name="Trung bình" dataKey="value" stroke="#0D9488" fill="#0D9488" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ tuân thủ</CardTitle>
            <CardDescription>Số bệnh nhân theo mức tuân thủ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Số BN" radius={[4, 4, 0, 0]}>
                  {complianceDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROM trend + Progress overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ROM trung bình theo thời gian</CardTitle>
            <CardDescription>Biên độ vận động (mẫu dữ liệu tổng hợp)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={romData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={[0, 180]} fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="ROM (°)" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến triển theo tháng</CardTitle>
            <CardDescription>Số bệnh nhân cải thiện / ổn định / giảm sút</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={progressOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="improved" name="Cải thiện" fill="#16a34a" stackId="a" />
                <Bar dataKey="stable" name="Ổn định" fill="#eab308" stackId="a" />
                <Bar dataKey="declined" name="Giảm sút" fill="#dc2626" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Patient metrics table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết metrics từng bệnh nhân</CardTitle>
          <CardDescription>Tổng hợp điểm AI, tư thế, tuân thủ của tất cả bệnh nhân</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phiên HT</TableHead>
                <TableHead>Bỏ qua</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Độ chính xác</TableHead>
                <TableHead>Tư thế</TableHead>
                <TableHead>Tuân thủ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientMetrics.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "active" ? "default" : p.status === "completed" ? "secondary" : "destructive"}>
                      {p.status === "active" ? "Đang điều trị" : p.status === "completed" ? "Hoàn thành" : "Cần chú ý"}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.sessionsCompleted}</TableCell>
                  <TableCell>{p.sessionsSkipped > 0 ? <span className="text-red-600">{p.sessionsSkipped}</span> : 0}</TableCell>
                  <TableCell>
                    {p.avgScore > 0 ? (
                      <Badge variant={p.avgScore >= 85 ? "default" : p.avgScore >= 70 ? "secondary" : "destructive"}>
                        {p.avgScore}
                      </Badge>
                    ) : "\u2014"}
                  </TableCell>
                  <TableCell>{p.avgAccuracy > 0 ? `${p.avgAccuracy}%` : "\u2014"}</TableCell>
                  <TableCell>{p.avgPosture > 0 ? p.avgPosture : "\u2014"}</TableCell>
                  <TableCell>
                    <Badge variant={p.complianceRate >= 80 ? "default" : p.complianceRate >= 60 ? "secondary" : "destructive"}>
                      {p.complianceRate}%
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
