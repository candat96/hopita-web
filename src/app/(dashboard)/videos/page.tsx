"use client";

import { useState } from "react";
import { videoReviews } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Play, MessageSquare, Activity, Target, ShieldCheck, RotateCcw, Zap, AlertTriangle, TrendingUp, Eye } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

// Mock KemTai AI analysis data per video
interface KemTaiAnalysis {
  overallScore: number;
  romMeasured: number;
  romTarget: number;
  romUnit: string;
  jointAccuracy: number;
  postureScore: number;
  repsCounted: number;
  repsTarget: number;
  exerciseDuration: number;
  bodyPointsTracked: number;
  symmetryScore: number;
  movementSmoothnessScore: number;
  painReported: number | null;
  radarData: { metric: string; score: number; fullMark: number }[];
  jointAngles: { joint: string; measured: number; target: number; status: "good" | "warning" | "error" }[];
  timeline: { second: number; score: number }[];
  feedback: { type: "error" | "warning" | "good"; message: string; timestamp: number }[];
}

const kemtaiData: Record<string, KemTaiAnalysis> = {
  v1: {
    overallScore: 88,
    romMeasured: 95,
    romTarget: 120,
    romUnit: "°",
    jointAccuracy: 92,
    postureScore: 85,
    repsCounted: 14,
    repsTarget: 15,
    exerciseDuration: 25,
    bodyPointsTracked: 111,
    symmetryScore: 87,
    movementSmoothnessScore: 82,
    painReported: 2,
    radarData: [
      { metric: "ROM", score: 79, fullMark: 100 },
      { metric: "Tư thế", score: 85, fullMark: 100 },
      { metric: "Chính xác", score: 92, fullMark: 100 },
      { metric: "Đối xứng", score: 87, fullMark: 100 },
      { metric: "Mượt mà", score: 82, fullMark: 100 },
    ],
    jointAngles: [
      { joint: "Gối phải", measured: 95, target: 120, status: "warning" },
      { joint: "Gối trái", measured: 88, target: 120, status: "warning" },
      { joint: "Hông phải", measured: 165, target: 170, status: "good" },
      { joint: "Hông trái", measured: 162, target: 170, status: "good" },
      { joint: "Cổ chân phải", measured: 85, target: 90, status: "good" },
    ],
    timeline: [
      { second: 0, score: 75 }, { second: 3, score: 80 }, { second: 6, score: 85 },
      { second: 9, score: 88 }, { second: 12, score: 90 }, { second: 15, score: 92 },
      { second: 18, score: 88 }, { second: 21, score: 85 }, { second: 24, score: 87 },
    ],
    feedback: [
      { type: "good", message: "Tốc độ thực hiện đều đặn, giữ nhịp tốt", timestamp: 5 },
      { type: "warning", message: "ROM gối chưa đạt mục tiêu 120° (hiện tại 95°)", timestamp: 10 },
      { type: "error", message: "Gối lệch vào trong ở rep thứ 8 - nguy cơ chấn thương", timestamp: 16 },
      { type: "good", message: "Tư thế lưng giữ thẳng tốt suốt bài tập", timestamp: 20 },
    ],
  },
  v2: {
    overallScore: 92,
    romMeasured: 85,
    romTarget: 90,
    romUnit: "°",
    jointAccuracy: 94,
    postureScore: 90,
    repsCounted: 15,
    repsTarget: 15,
    exerciseDuration: 28,
    bodyPointsTracked: 111,
    symmetryScore: 91,
    movementSmoothnessScore: 89,
    painReported: 1,
    radarData: [
      { metric: "ROM", score: 94, fullMark: 100 },
      { metric: "Tư thế", score: 90, fullMark: 100 },
      { metric: "Chính xác", score: 94, fullMark: 100 },
      { metric: "Đối xứng", score: 91, fullMark: 100 },
      { metric: "Mượt mà", score: 89, fullMark: 100 },
    ],
    jointAngles: [
      { joint: "Gối phải", measured: 85, target: 90, status: "good" },
      { joint: "Gối trái", measured: 82, target: 90, status: "good" },
      { joint: "Hông phải", measured: 168, target: 170, status: "good" },
      { joint: "Hông trái", measured: 166, target: 170, status: "good" },
      { joint: "Cổ chân phải", measured: 88, target: 90, status: "good" },
    ],
    timeline: [
      { second: 0, score: 85 }, { second: 4, score: 88 }, { second: 8, score: 91 },
      { second: 12, score: 93 }, { second: 16, score: 94 }, { second: 20, score: 92 },
      { second: 24, score: 90 }, { second: 28, score: 91 },
    ],
    feedback: [
      { type: "good", message: "Thực hiện đủ 15/15 reps, tuyệt vời!", timestamp: 5 },
      { type: "good", message: "ROM gần đạt mục tiêu (85°/90°)", timestamp: 12 },
      { type: "good", message: "Độ đối xứng hai bên tốt (91%)", timestamp: 20 },
    ],
  },
  v3: {
    overallScore: 76,
    romMeasured: 170,
    romTarget: 180,
    romUnit: "°",
    jointAccuracy: 82,
    postureScore: 72,
    repsCounted: 3,
    repsTarget: 3,
    exerciseDuration: 32,
    bodyPointsTracked: 111,
    symmetryScore: 78,
    movementSmoothnessScore: 74,
    painReported: null,
    radarData: [
      { metric: "ROM", score: 94, fullMark: 100 },
      { metric: "Tư thế", score: 72, fullMark: 100 },
      { metric: "Chính xác", score: 82, fullMark: 100 },
      { metric: "Đối xứng", score: 78, fullMark: 100 },
      { metric: "Mượt mà", score: 74, fullMark: 100 },
    ],
    jointAngles: [
      { joint: "Vai phải", measured: 170, target: 180, status: "good" },
      { joint: "Khuỷu tay", measured: 175, target: 180, status: "good" },
      { joint: "Lưng (L4-L5)", measured: 8, target: 0, status: "warning" },
      { joint: "Hông", measured: 165, target: 180, status: "warning" },
    ],
    timeline: [
      { second: 0, score: 70 }, { second: 5, score: 74 }, { second: 10, score: 78 },
      { second: 15, score: 72 }, { second: 20, score: 76 }, { second: 25, score: 80 },
      { second: 30, score: 78 },
    ],
    feedback: [
      { type: "good", message: "Hoàn thành đủ 3 reps", timestamp: 5 },
      { type: "warning", message: "Lưng hơi võng xuống ở giây 15 - cần giữ thẳng hơn", timestamp: 15 },
      { type: "warning", message: "Hông hơi lệch, cần chỉnh lại", timestamp: 22 },
    ],
  },
  v4: {
    overallScore: 58,
    romMeasured: 65,
    romTarget: 90,
    romUnit: "°",
    jointAccuracy: 62,
    postureScore: 55,
    repsCounted: 6,
    repsTarget: 8,
    exerciseDuration: 22,
    bodyPointsTracked: 111,
    symmetryScore: 60,
    movementSmoothnessScore: 52,
    painReported: 3,
    radarData: [
      { metric: "ROM", score: 72, fullMark: 100 },
      { metric: "Tư thế", score: 55, fullMark: 100 },
      { metric: "Chính xác", score: 62, fullMark: 100 },
      { metric: "Đối xứng", score: 60, fullMark: 100 },
      { metric: "Mượt mà", score: 52, fullMark: 100 },
    ],
    jointAngles: [
      { joint: "Cổ chân phải", measured: 65, target: 90, status: "error" },
      { joint: "Cổ chân trái", measured: 70, target: 90, status: "error" },
      { joint: "Gối phải", measured: 160, target: 180, status: "warning" },
      { joint: "Gối trái", measured: 155, target: 180, status: "warning" },
    ],
    timeline: [
      { second: 0, score: 60 }, { second: 3, score: 55 }, { second: 6, score: 58 },
      { second: 9, score: 52 }, { second: 12, score: 56 }, { second: 15, score: 60 },
      { second: 18, score: 58 }, { second: 21, score: 62 },
    ],
    feedback: [
      { type: "error", message: "Chân chưa thẳng - gối co quá nhiều khi căng cơ", timestamp: 8 },
      { type: "error", message: "Cổ chân chưa đạt 90° (chỉ 65°) - cần hướng dẫn lại", timestamp: 12 },
      { type: "warning", message: "Chỉ hoàn thành 6/8 reps", timestamp: 18 },
      { type: "good", message: "Có cải thiện ở rep cuối", timestamp: 20 },
    ],
  },
};

function scoreColor(score: number) {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
}

function scoreBg(score: number) {
  if (score >= 85) return "bg-green-100 text-green-700";
  if (score >= 70) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function VideosPage() {
  const [selectedId, setSelectedId] = useState(videoReviews[0]?.id);
  const selected = videoReviews.find((v) => v.id === selectedId);
  const [feedback, setFeedback] = useState(selected?.feedback ?? "");
  const ai = selectedId ? kemtaiData[selectedId] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Video Review</h1>
        <p className="text-muted-foreground">Xem và đánh giá video bài tập của bệnh nhân</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-base">Danh sách video</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Bài tập</TableHead>
                    <TableHead>AI</TableHead>
                    <TableHead>TT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoReviews.map((v) => {
                    const aiScore = kemtaiData[v.id]?.overallScore;
                    return (
                      <TableRow key={v.id} className={`cursor-pointer ${v.id === selectedId ? "bg-accent" : ""}`} onClick={() => { setSelectedId(v.id); setFeedback(v.feedback ?? ""); }}>
                        <TableCell className="font-medium text-sm">{v.patientName}</TableCell>
                        <TableCell className="text-sm">{v.exerciseName}</TableCell>
                        <TableCell>
                          {aiScore != null && (
                            <span className={`text-sm font-bold ${scoreColor(aiScore)}`}>{aiScore}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={v.status === "reviewed" ? "secondary" : "default"}>
                            {v.status === "reviewed" ? "Đã review" : "Chờ"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              {/* Video players */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Video bệnh nhân</CardTitle></CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">{selected.patientName} - {selected.exerciseName}</p>
                        <p className="text-xs">{new Date(selected.submittedAt).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Video chuẩn (tham khảo)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Video mẫu: {selected.exerciseName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* KemTai AI Analysis */}
              {ai && (
                <>
                  <Card className="border-teal-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="h-4 w-4 text-teal-600" />
                            Phân tích AI — KemTai
                          </CardTitle>
                          <CardDescription>{ai.bodyPointsTracked} body points tracked · Computer Vision Analysis</CardDescription>
                        </div>
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${scoreBg(ai.overallScore)}`}>
                          {ai.overallScore}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* KPI row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                        <div className="rounded-lg border p-3 text-center">
                          <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">ROM</p>
                          <p className={`text-lg font-bold ${scoreColor(Math.round((ai.romMeasured / ai.romTarget) * 100))}`}>
                            {ai.romMeasured}{ai.romUnit}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Mục tiêu: {ai.romTarget}{ai.romUnit}</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <Activity className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Chính xác</p>
                          <p className={`text-lg font-bold ${scoreColor(ai.jointAccuracy)}`}>{ai.jointAccuracy}%</p>
                          <p className="text-[10px] text-muted-foreground">Joint accuracy</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Tư thế</p>
                          <p className={`text-lg font-bold ${scoreColor(ai.postureScore)}`}>{ai.postureScore}</p>
                          <p className="text-[10px] text-muted-foreground">Posture score</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <RotateCcw className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Reps</p>
                          <p className={`text-lg font-bold ${ai.repsCounted >= ai.repsTarget ? "text-green-600" : "text-yellow-600"}`}>
                            {ai.repsCounted}/{ai.repsTarget}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Đã đếm</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Đối xứng</p>
                          <p className={`text-lg font-bold ${scoreColor(ai.symmetryScore)}`}>{ai.symmetryScore}%</p>
                          <p className="text-[10px] text-muted-foreground">Symmetry</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Mượt mà</p>
                          <p className={`text-lg font-bold ${scoreColor(ai.movementSmoothnessScore)}`}>{ai.movementSmoothnessScore}</p>
                          <p className="text-[10px] text-muted-foreground">Smoothness</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Radar chart */}
                        <div>
                          <p className="text-sm font-medium mb-2">Tổng quan chỉ số</p>
                          <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={ai.radarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" fontSize={11} />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={9} />
                              <Radar dataKey="score" stroke="#0D9488" fill="#0D9488" fillOpacity={0.3} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Score timeline */}
                        <div>
                          <p className="text-sm font-medium mb-2">Điểm theo thời gian (giây)</p>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={ai.timeline}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="second" fontSize={11} tickFormatter={(v) => `${v}s`} />
                              <YAxis domain={[0, 100]} fontSize={11} />
                              <Tooltip labelFormatter={(v) => `Giây ${v}`} />
                              <Bar dataKey="score" name="Điểm" radius={[3, 3, 0, 0]}>
                                {ai.timeline.map((entry, i) => (
                                  <Cell key={i} fill={entry.score >= 85 ? "#16a34a" : entry.score >= 70 ? "#eab308" : "#dc2626"} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Joint angles */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Góc khớp (Joint Angles)</CardTitle>
                      <CardDescription>Đo bởi KemTai Computer Vision — 111 điểm cơ thể</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Khớp</TableHead>
                            <TableHead>Đo được</TableHead>
                            <TableHead>Mục tiêu</TableHead>
                            <TableHead>Chênh lệch</TableHead>
                            <TableHead>Đánh giá</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ai.jointAngles.map((j, i) => {
                            const diff = j.measured - j.target;
                            return (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{j.joint}</TableCell>
                                <TableCell>{j.measured}°</TableCell>
                                <TableCell>{j.target}°</TableCell>
                                <TableCell>
                                  <span className={j.status === "good" ? "text-green-600" : j.status === "warning" ? "text-yellow-600" : "text-red-600"}>
                                    {diff > 0 ? "+" : ""}{diff}°
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={j.status === "good" ? "default" : j.status === "warning" ? "secondary" : "destructive"}>
                                    {j.status === "good" ? "Tốt" : j.status === "warning" ? "Cần cải thiện" : "Sai tư thế"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* AI Feedback timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Phản hồi AI theo thời gian</CardTitle>
                      <CardDescription>Real-time corrective feedback từ KemTai</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {ai.feedback.map((f, i) => (
                          <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${f.type === "error" ? "border-red-200 bg-red-50" : f.type === "warning" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
                            <div className="shrink-0 mt-0.5">
                              {f.type === "error" ? (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              ) : f.type === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{f.message}</p>
                            </div>
                            <Badge variant="outline" className="shrink-0">{f.timestamp}s</Badge>
                          </div>
                        ))}
                      </div>
                      {ai.painReported != null && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
                          <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                          <p className="text-sm">Bệnh nhân tự báo mức đau: <span className="font-bold">{ai.painReported}/10</span></p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Doctor annotations */}
              {selected.annotations && selected.annotations.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Annotations (Bác sĩ)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selected.annotations.map((a) => (
                        <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                          <Badge variant={a.type === "error" ? "destructive" : a.type === "good" ? "default" : "secondary"} className="mt-0.5">{a.timestampSeconds}s</Badge>
                          <div><p className="text-sm">{a.note}</p><p className="text-xs text-muted-foreground capitalize">{a.type}</p></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feedback */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" />Feedback</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Textarea placeholder="Nhập feedback cho bệnh nhân..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
                  <div className="flex gap-3">
                    <Button onClick={() => alert("Đã gửi feedback!")} disabled={!feedback.trim()}>Gửi feedback</Button>
                    <Button variant="outline" onClick={() => alert("Đã đánh dấu reviewed!")}><CheckCircle className="mr-2 h-4 w-4" />Đánh dấu đã review</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
