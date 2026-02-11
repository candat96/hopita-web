"use client";

import { useState } from "react";
import { videoReviews } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Play, MessageSquare } from "lucide-react";

export default function VideosPage() {
  const [selectedId, setSelectedId] = useState(videoReviews[0]?.id);
  const selected = videoReviews.find((v) => v.id === selectedId);
  const [feedback, setFeedback] = useState(selected?.feedback ?? "");

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Video Review</h1><p className="text-muted-foreground">Xem va danh gia video bai tap cua benh nhan</p></div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-base">Danh sach video</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Benh nhan</TableHead><TableHead>Bai tap</TableHead><TableHead>Trang thai</TableHead></TableRow></TableHeader>
                <TableBody>
                  {videoReviews.map((v) => (
                    <TableRow key={v.id} className={`cursor-pointer ${v.id === selectedId ? "bg-accent" : ""}`} onClick={() => { setSelectedId(v.id); setFeedback(v.feedback ?? ""); }}>
                      <TableCell className="font-medium text-sm">{v.patientName}</TableCell>
                      <TableCell className="text-sm">{v.exerciseName}</TableCell>
                      <TableCell><Badge variant={v.status === "reviewed" ? "secondary" : "default"}>{v.status === "reviewed" ? "Da review" : "Cho review"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Video benh nhan</CardTitle></CardHeader>
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
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Video chuan (tham khao)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Video mau: {selected.exerciseName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selected.annotations && selected.annotations.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Annotations</CardTitle></CardHeader>
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

              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" />Feedback</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Textarea placeholder="Nhap feedback cho benh nhan..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
                  <div className="flex gap-3">
                    <Button onClick={() => alert("Da gui feedback!")} disabled={!feedback.trim()}>Gui feedback</Button>
                    <Button variant="outline" onClick={() => alert("Da danh dau reviewed!")}><CheckCircle className="mr-2 h-4 w-4" />Danh dau da review</Button>
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
