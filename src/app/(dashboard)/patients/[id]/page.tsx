"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { patients, romData, clinicalNotes, treatmentHistory, protocols } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Phone, Mail, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang điều trị", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  attention: { label: "Cần chú ý", variant: "destructive" },
  inactive: { label: "Ngừng", variant: "outline" },
  paused: { label: "Tạm dừng", variant: "outline" },
};

function formatDate(d?: string) {
  if (!d) return "\u2014";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(d?: string) {
  if (!d) return "\u2014";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PatientDetailPage() {
  const params = useParams();
  const patient = patients.find((p) => p.id === params.id) ?? patients[0];
  const patientNotes = clinicalNotes.filter((n) => n.patientId === patient.id);
  const currentProtocol = protocols.find((pr) => pr.id === patient.currentProtocolId);
  const status = statusConfig[patient.status];

  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(patientNotes);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [{ id: `cn-${Date.now()}`, patientId: patient.id, authorId: "u1", authorName: "BS. Nguyen Van An", content: newNote.trim(), createdAt: new Date().toISOString() }, ...prev]);
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{patient.fullName}</h1>
          <p className="text-muted-foreground">{patient.diagnosis}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
          <TabsTrigger value="protocol">Phác đồ</TabsTrigger>
          <TabsTrigger value="rom">ROM</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Thông tin cá nhân</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày sinh</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-medium">{patient.gender === "male" ? "Nam" : "Nữ"}</p>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Điện thoại</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Thông tin điều trị</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-sm text-muted-foreground">Chẩn đoán</p><p className="font-medium">{patient.diagnosis}</p></div>
                <Separator />
                <div><p className="text-sm text-muted-foreground">Bác sĩ</p><p className="font-medium">{patient.assignedDoctorName}</p></div>
                <Separator />
                <div><p className="text-sm text-muted-foreground">Phác đồ</p><p className="font-medium">{patient.currentProtocolName ?? "\u2014"}</p></div>
                <Separator />
                <div><p className="text-sm text-muted-foreground">Tuân thủ</p><p className="text-xl font-bold">{patient.complianceRate}%</p></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-base">Lịch sử điều trị</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {treatmentHistory.map((entry, i) => {
                  const s = statusConfig[entry.status];
                  return (
                    <div key={entry.id} className="flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary mt-1.5" />
                        {i < treatmentHistory.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{entry.protocolName}</p>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(entry.startDate)}{entry.endDate ? ` \u2013 ${formatDate(entry.endDate)}` : " \u2013 Hiện tại"}</p>
                        {entry.notes && <p className="text-sm">{entry.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocol">
          {currentProtocol ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{currentProtocol.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentProtocol.description}</p>
                <p className="text-sm text-muted-foreground">Thời gian: {currentProtocol.durationWeeks} tuần</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bài tập</TableHead>
                      <TableHead>Sets</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Tần suất</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProtocol.exercises.map((ex) => (
                      <TableRow key={ex.exerciseId}>
                        <TableCell className="font-medium">{ex.exerciseName}</TableCell>
                        <TableCell>{ex.sets}</TableCell>
                        <TableCell>{ex.reps}</TableCell>
                        <TableCell>{ex.durationSeconds}s</TableCell>
                        <TableCell>{ex.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Chưa có phác đồ.</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="rom" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ROM hiện tại</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">95&deg;</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ROM ban đầu</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">45&deg;</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cải thiện</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-600">+50&deg;</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Biểu đồ ROM</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={romData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d: string) => { const dt = new Date(d); return `${dt.getDate()}/${dt.getMonth() + 1}`; }} />
                  <YAxis domain={[0, 120]} tickFormatter={(v: number) => `${v}\u00B0`} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Baseline 45\u00B0", position: "right" }} />
                  <Line type="monotone" dataKey="value" name="ROM" stroke="#0D9488" strokeWidth={2} dot={{ fill: "#0D9488" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle className="text-base">Ghi chú lâm sàng</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{note.authorName}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Thêm ghi chú mới</p>
                <Textarea placeholder="Nhập ghi chú..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>Lưu ghi chú</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
