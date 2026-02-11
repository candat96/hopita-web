"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import { patients, sessions, romData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Target, ShieldCheck, TrendingUp, ArrowUpRight } from "lucide-react";

export default function MetricsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [dateFilter, setDateFilter] = useState("thang");

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientSessions = useMemo(() => sessions.filter((s) => s.patientId === selectedPatientId && s.status === "completed"), [selectedPatientId]);

  const avgAccuracy = patientSessions.length > 0 ? Math.round(patientSessions.reduce((sum, s) => sum + (s.accuracy ?? 0), 0) / patientSessions.length) : 0;
  const avgPosture = patientSessions.length > 0 ? Math.round(patientSessions.reduce((sum, s) => sum + (s.postureScore ?? 0), 0) / patientSessions.length) : 0;
  const totalReps = patientSessions.length * 15;
  const baselineRom = romData[0]?.value ?? 0;
  const currentRom = romData[romData.length - 1]?.value ?? 0;
  const romImprovement = currentRom - baselineRom;

  const filteredRomData = useMemo(() => {
    if (dateFilter === "ngay") return romData.slice(-2);
    if (dateFilter === "tuan") return romData.slice(-4);
    return romData;
  }, [dateFilter]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">AI Metrics & Ket qua</h1><p className="text-muted-foreground">Theo doi chi so phuc hoi cua benh nhan</p></div>

      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
          <SelectTrigger className="w-[280px]"><SelectValue placeholder="Chon benh nhan" /></SelectTrigger>
          <SelectContent>{patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>))}</SelectContent>
        </Select>
        <Tabs value={dateFilter} onValueChange={setDateFilter}><TabsList><TabsTrigger value="ngay">Ngay</TabsTrigger><TabsTrigger value="tuan">Tuan</TabsTrigger><TabsTrigger value="thang">Thang</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Reps hoan thanh</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalReps}</div><p className="text-xs text-muted-foreground">Tong so lan tap</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Do chinh xac</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{avgAccuracy}%</div><p className="text-xs text-muted-foreground">Trung binh cac buoi tap</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Posture Score</CardTitle><ShieldCheck className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{avgPosture}</div><p className="text-xs text-muted-foreground">Diem tu the trung binh</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Bien do van dong (ROM) theo thoi gian</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredRomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[0, 180]} fontSize={12} />
              <Tooltip /><Legend />
              <ReferenceLine y={baselineRom} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Baseline: ${baselineRom}\u00B0`, position: "right", fill: "#ef4444", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" name="ROM (\u00B0)" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">ROM: Baseline vs Hien tai</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center"><p className="text-xs text-muted-foreground">Baseline</p><p className="text-xl font-bold text-red-500">{baselineRom}&deg;</p></div>
              <ArrowUpRight className="h-6 w-6 text-green-500" />
              <div className="text-center"><p className="text-xs text-muted-foreground">Hien tai</p><p className="text-xl font-bold text-green-600">{currentRom}&deg;</p></div>
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Tang {romImprovement}&deg; ({Math.round((romImprovement / baselineRom) * 100)}%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Compliance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center"><p className="text-xs text-muted-foreground">Muc tieu</p><p className="text-xl font-bold text-muted-foreground">80%</p></div>
              <ArrowUpRight className="h-6 w-6 text-green-500" />
              <div className="text-center"><p className="text-xs text-muted-foreground">Thuc te</p><p className="text-xl font-bold text-green-600">{selectedPatient?.complianceRate ?? 0}%</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Posture Score</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center"><p className="text-xs text-muted-foreground">Lan dau</p><p className="text-xl font-bold text-orange-500">65</p></div>
              <ArrowUpRight className="h-6 w-6 text-green-500" />
              <div className="text-center"><p className="text-xs text-muted-foreground">Hien tai</p><p className="text-xl font-bold text-green-600">{avgPosture || 85}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
