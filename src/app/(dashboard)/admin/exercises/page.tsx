"use client";

import { useState, useMemo } from "react";
import { exercises } from "@/lib/mock-data";
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

  const categories = useMemo(() => Array.from(new Set(exercises.map((e) => e.category))).sort(), []);

  const filtered = exercises.filter((e) => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Danh muc bai tap</h1><p className="text-muted-foreground">Quan ly thu vien bai tap phuc hoi chuc nang</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Them bai tap</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Them bai tap moi</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Ten bai tap</Label><Input placeholder="Gap goi (Knee Flexion)" /></div>
              <div className="space-y-2"><Label>Mo ta</Label><Textarea placeholder="Mo ta bai tap..." rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Danh muc</Label><Input placeholder="Khop goi" /></div>
                <div className="space-y-2"><Label>Video URL</Label><Input placeholder="https://..." /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Reps</Label><Input type="number" defaultValue={10} /></div>
                <div className="space-y-2"><Label>Sets/ngay</Label><Input type="number" defaultValue={3} /></div>
                <div className="space-y-2"><Label>Thoi gian (s)</Label><Input type="number" defaultValue={30} /></div>
              </div>
              <div className="space-y-2"><Label>Luu y an toan</Label><Textarea placeholder="Luu y khi tap..." rows={2} /></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Da them bai tap!"); }}>Them bai tap</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tim bai tap..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Tat ca danh muc</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Ten bai tap</TableHead><TableHead>Danh muc</TableHead><TableHead>Reps</TableHead><TableHead>Sets/ngay</TableHead><TableHead>Thoi gian</TableHead><TableHead className="hidden md:table-cell">Luu y an toan</TableHead><TableHead className="w-[60px]" /></TableRow></TableHeader>
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
