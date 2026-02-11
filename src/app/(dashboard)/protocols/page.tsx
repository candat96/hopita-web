"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { protocols } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Dumbbell, Clock, Users } from "lucide-react";

export default function ProtocolsPage() {
  const [search, setSearch] = useState("");
  const conditions = useMemo(() => Array.from(new Set(protocols.map((p) => p.targetCondition))).sort(), []);
  const [conditionFilter, setConditionFilter] = useState("");

  const filtered = protocols.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCondition = !conditionFilter || p.targetCondition === conditionFilter;
    return matchSearch && matchCondition;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phác đồ tập luyện</h1>
          <p className="text-muted-foreground">Quản lý các phác đồ phục hồi chức năng</p>
        </div>
        <Button asChild><Link href="/protocols/new"><Plus className="mr-2 h-4 w-4" />Tạo phác đồ mới</Link></Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm phác đồ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Tất cả bệnh lý</option>
          {conditions.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((protocol) => (
          <Card key={protocol.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{protocol.name}</CardTitle>
                {protocol.isTemplate && <Badge variant="secondary">Template</Badge>}
              </div>
              <CardDescription className="line-clamp-2">{protocol.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-3">
                <Badge variant="outline">{protocol.targetCondition}</Badge>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Dumbbell className="h-3.5 w-3.5" /><span>{protocol.exercises.length} bài tập</span></div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /><span>{protocol.durationWeeks} tuần</span></div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" /><span>{protocol.assignedPatientCount} BN</span></div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/protocols/${protocol.id}`}>Chi tiết</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
