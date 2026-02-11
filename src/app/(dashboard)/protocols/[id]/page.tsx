"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { protocols, exercises } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

interface ProtoExercise {
  exerciseId: string; exerciseName: string; sets: number; reps: number; durationSeconds: number; frequency: string; order: number;
}

export default function ProtocolEditorPage() {
  const params = useParams();
  const protocol = protocols.find((p) => p.id === params.id);

  const [name, setName] = useState(protocol?.name ?? "");
  const [description, setDescription] = useState(protocol?.description ?? "");
  const [targetCondition, setTargetCondition] = useState(protocol?.targetCondition ?? "");
  const [durationWeeks, setDurationWeeks] = useState(protocol?.durationWeeks ?? 4);
  const [isTemplate, setIsTemplate] = useState(protocol?.isTemplate ?? false);
  const [protoExercises, setProtoExercises] = useState<ProtoExercise[]>(protocol?.exercises ?? []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exSearch, setExSearch] = useState("");

  const filteredCatalog = useMemo(() => {
    if (!exSearch) return exercises;
    return exercises.filter((ex) => ex.name.toLowerCase().includes(exSearch.toLowerCase()) || ex.category.toLowerCase().includes(exSearch.toLowerCase()));
  }, [exSearch]);

  const addExercise = (id: string) => {
    const ex = exercises.find((e) => e.id === id);
    if (!ex || protoExercises.some((pe) => pe.exerciseId === id)) return;
    setProtoExercises((prev) => [...prev, { exerciseId: ex.id, exerciseName: ex.name, sets: ex.setsPerDay, reps: ex.repetitions, durationSeconds: ex.durationSeconds, frequency: "1 lan/ngay", order: prev.length + 1 }]);
    setDialogOpen(false);
  };

  const removeExercise = (id: string) => {
    setProtoExercises((prev) => prev.filter((pe) => pe.exerciseId !== id).map((pe, i) => ({ ...pe, order: i + 1 })));
  };

  if (!protocol) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild><Link href="/protocols"><ArrowLeft className="mr-2 h-4 w-4" />Quay lai</Link></Button>
        <div className="rounded-lg border border-dashed p-12 text-center"><p>Phac do khong ton tai</p></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href="/protocols"><ArrowLeft className="mr-2 h-4 w-4" />Quay lai</Link></Button>
        <div><h1 className="text-2xl font-bold">Chinh sua phac do</h1></div>
      </div>

      <Card>
        <CardHeader><CardTitle>Thong tin phac do</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Ten phac do</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Tinh trang muc tieu</Label><Input value={targetCondition} onChange={(e) => setTargetCondition(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Mo ta</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Thoi gian (tuan)</Label><Input type="number" min={1} value={durationWeeks} onChange={(e) => setDurationWeeks(Number(e.target.value))} /></div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox id="template" checked={isTemplate} onCheckedChange={(v) => setIsTemplate(v === true)} />
              <Label htmlFor="template">Luu lam template</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sach bai tap</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 h-4 w-4" />Them bai tap</Button></DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader><DialogTitle>Chon bai tap</DialogTitle></DialogHeader>
                <Input placeholder="Tim bai tap..." value={exSearch} onChange={(e) => setExSearch(e.target.value)} />
                <div className="space-y-2 mt-4">
                  {filteredCatalog.map((ex) => {
                    const added = protoExercises.some((pe) => pe.exerciseId === ex.id);
                    return (
                      <div key={ex.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{ex.name}</p>
                          <div className="flex gap-2 mt-1"><Badge variant="outline" className="text-xs">{ex.category}</Badge><span className="text-xs text-muted-foreground">{ex.repetitions} reps x {ex.setsPerDay} sets</span></div>
                        </div>
                        <Button size="sm" variant={added ? "secondary" : "default"} disabled={added} onClick={() => addExercise(ex.id)}>{added ? "Da them" : "Them"}</Button>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {protoExercises.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">Chua co bai tap. Nhan &quot;Them bai tap&quot; de bat dau.</div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Bai tap</TableHead><TableHead>Sets</TableHead><TableHead>Reps</TableHead><TableHead>Thoi gian</TableHead><TableHead>Tan suat</TableHead><TableHead className="w-16" /></TableRow></TableHeader>
              <TableBody>
                {protoExercises.map((pe) => (
                  <TableRow key={pe.exerciseId}>
                    <TableCell>{pe.order}</TableCell><TableCell>{pe.exerciseName}</TableCell><TableCell>{pe.sets}</TableCell><TableCell>{pe.reps}</TableCell><TableCell>{pe.durationSeconds}s</TableCell><TableCell>{pe.frequency}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeExercise(pe.exerciseId)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Separator />
      <div className="flex gap-3 justify-end">
        <Button variant="outline" asChild><Link href="/protocols">Huy</Link></Button>
        <Button variant="secondary" onClick={() => alert("Gan cho benh nhan - coming soon")}>Gan cho benh nhan</Button>
        <Button onClick={() => alert("Da luu!")}><Save className="mr-2 h-4 w-4" />Luu phac do</Button>
      </div>
    </div>
  );
}
