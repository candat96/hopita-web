"use client";

import { exercises, sessions, exerciseCategories } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#0D9488", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

const exerciseStats = exercises.map((ex) => {
  const relatedSessions = sessions.filter((s) => s.exerciseId === ex.id);
  const completedSessions = relatedSessions.filter((s) => s.status === "completed");
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((s, ses) => s + (ses.score ?? 0), 0) / completedSessions.length)
    : 0;
  const avgPosture = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((s, ses) => s + (ses.postureScore ?? 0), 0) / completedSessions.length)
    : 0;
  return {
    id: ex.id,
    name: ex.name,
    category: ex.category,
    totalSessions: relatedSessions.length,
    completedSessions: completedSessions.length,
    skippedSessions: relatedSessions.filter((s) => s.status === "skipped").length,
    avgScore,
    avgPosture,
    completionRate: relatedSessions.length > 0
      ? Math.round((completedSessions.length / relatedSessions.length) * 100)
      : 0,
  };
});

const categoryData = exerciseCategories.map((cat, i) => ({
  name: cat.name,
  value: cat.exerciseCount,
  color: COLORS[i % COLORS.length],
}));

const topExercises = [...exerciseStats].sort((a, b) => b.totalSessions - a.totalSessions);

export default function ExercisesReportPage() {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === "completed").length;
  const skippedSessions = sessions.filter((s) => s.status === "skipped").length;
  const avgScore = Math.round(
    sessions.filter((s) => s.score).reduce((s, ses) => s + (ses.score ?? 0), 0) /
    (sessions.filter((s) => s.score).length || 1)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo cáo hoạt động bài tập</h1>
          <p className="text-muted-foreground">Phân tích mức sử dụng, điểm số và tư thế theo bài tập</p>
        </div>
        <Button variant="outline" onClick={() => alert("Xuất báo cáo...")}><Download className="mr-2 h-4 w-4" />Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tổng phiên tập</p>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">{completedSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Bỏ qua</p>
            <p className="text-2xl font-bold text-red-600">{skippedSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Điểm TB</p>
            <p className="text-2xl font-bold">{avgScore}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ theo danh mục</CardTitle>
            <CardDescription>Số bài tập trong mỗi danh mục</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {categoryData.map((entry, index) => (
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
            <CardTitle>Bài tập được sử dụng nhiều nhất</CardTitle>
            <CardDescription>Theo số phiên tập</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topExercises} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={11} width={140} tick={{ width: 130 }} />
                <Tooltip />
                <Bar dataKey="totalSessions" name="Số phiên" fill="#0D9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Chi tiết từng bài tập</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bài tập</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Tổng phiên</TableHead>
                <TableHead>Hoàn thành</TableHead>
                <TableHead>Bỏ qua</TableHead>
                <TableHead>Tỷ lệ HT</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Tư thế TB</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseStats.map((ex) => (
                <TableRow key={ex.id}>
                  <TableCell className="font-medium">{ex.name}</TableCell>
                  <TableCell><Badge variant="outline">{ex.category}</Badge></TableCell>
                  <TableCell>{ex.totalSessions}</TableCell>
                  <TableCell>{ex.completedSessions}</TableCell>
                  <TableCell>{ex.skippedSessions}</TableCell>
                  <TableCell>
                    <Badge variant={ex.completionRate >= 80 ? "default" : ex.completionRate >= 50 ? "secondary" : "destructive"}>
                      {ex.completionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>{ex.avgScore || "\u2014"}</TableCell>
                  <TableCell>{ex.avgPosture || "\u2014"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
