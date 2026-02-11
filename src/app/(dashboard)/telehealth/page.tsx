"use client";

import { useState } from "react";
import { appointments, patients } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, Phone, Calendar } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  scheduled: { label: "Da len lich", variant: "outline" },
  confirmed: { label: "Da xac nhan", variant: "default" },
  completed: { label: "Hoan thanh", variant: "secondary" },
  cancelled: { label: "Da huy", variant: "destructive" },
};

const typeMap: Record<string, string> = { followup: "Tai kham", initial: "Lan dau", telehealth: "Online" };

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function TelehealthPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Telehealth</h1><p className="text-muted-foreground">Quan ly lich tu van va cuoc goi video</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Tao lich hen</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tao lich hen moi</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Benh nhan</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Chon benh nhan" /></SelectTrigger>
                  <SelectContent>{patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Ngay</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Gio</Label><Input type="time" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Thoi luong (phut)</Label><Input type="number" defaultValue={30} /></div>
                <div className="space-y-2">
                  <Label>Loai</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Chon loai" /></SelectTrigger><SelectContent><SelectItem value="telehealth">Online</SelectItem><SelectItem value="followup">Tai kham</SelectItem><SelectItem value="initial">Lan dau</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Ghi chu</Label><Textarea placeholder="Ghi chu..." rows={2} /></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Da tao lich hen!"); }}>Tao lich hen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" />Lich tuan nay</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => {
              const dayAppointments = appointments.filter((a) => {
                const aDate = new Date(a.scheduledAt);
                return aDate.toDateString() === date.toDateString();
              });
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div key={i} className={`rounded-lg border p-2 min-h-[120px] ${isToday ? "border-primary bg-primary/5" : ""}`}>
                  <p className={`text-xs font-medium text-center mb-2 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {weekDays[i]} {date.getDate()}/{date.getMonth() + 1}
                  </p>
                  {dayAppointments.map((a) => (
                    <div key={a.id} className="rounded bg-primary/10 p-1.5 mb-1 text-xs">
                      <p className="font-medium truncate">{a.patientName}</p>
                      <p className="text-muted-foreground">{new Date(a.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Tat ca lich hen</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Benh nhan</TableHead><TableHead>Ngay gio</TableHead><TableHead>Thoi luong</TableHead><TableHead>Loai</TableHead><TableHead>Trang thai</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {appointments.map((a) => {
                const s = statusMap[a.status];
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.patientName}</TableCell>
                    <TableCell>{new Date(a.scheduledAt).toLocaleDateString("vi-VN")} {new Date(a.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</TableCell>
                    <TableCell>{a.durationMinutes} phut</TableCell>
                    <TableCell>{typeMap[a.type]}</TableCell>
                    <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                    <TableCell>
                      {a.type === "telehealth" && a.status !== "cancelled" && (
                        <Button size="sm" variant="outline" onClick={() => alert("Joining call...")}><Video className="mr-2 h-3 w-3" />Tham gia</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
