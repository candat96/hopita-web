"use client";

import { useState } from "react";
import { exercises, exerciseCategories } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Pencil } from "lucide-react";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = exercises.filter((e) => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Bài tập</h1><p className="text-muted-foreground">Quản lý thư viện bài tập phục hồi chức năng</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Thêm bài tập</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Thêm bài tập mới</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Tên bài tập</Label><Input placeholder="Gập gối (Knee Flexion)" /></div>
              <div className="space-y-2"><Label>Mô tả</Label><Textarea placeholder="Mô tả bài tập..." rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Danh mục</Label><Input placeholder="Khớp gối" /></div>
                <div className="space-y-2"><Label>Video URL</Label><Input placeholder="https://..." /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Reps</Label><Input type="number" defaultValue={10} /></div>
                <div className="space-y-2"><Label>Sets/ngay</Label><Input type="number" defaultValue={3} /></div>
                <div className="space-y-2"><Label>Thời gian (s)</Label><Input type="number" defaultValue={30} /></div>
              </div>
              <div className="space-y-2"><Label>Lưu ý an toàn</Label><Textarea placeholder="Lưu ý khi tập..." rows={2} /></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Đã thêm bài tập!"); }}>Thêm bài tập</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm bài tập..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Tất cả danh mục</option>
          {exerciseCategories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
        </select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Tên bài tập</TableHead><TableHead>Danh mục</TableHead><TableHead>Reps</TableHead><TableHead>Sets/ngày</TableHead><TableHead>Thời gian</TableHead><TableHead className="hidden md:table-cell">Lưu ý an toàn</TableHead><TableHead className="w-[60px]" /></TableRow></TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                  <TableCell>{e.repetitions}</TableCell>
                  <TableCell>{e.setsPerDay}</TableCell>
                  <TableCell>{e.durationSeconds}s</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm text-muted-foreground">{e.safetyNotes ?? "\u2014"}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
