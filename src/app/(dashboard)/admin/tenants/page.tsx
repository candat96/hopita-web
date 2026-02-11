"use client";

import { useState } from "react";
import { facilities } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, Users, Stethoscope, MapPin, Phone, Pencil } from "lucide-react";

export default function TenantsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Co so / Tenant</h1><p className="text-muted-foreground">Quan ly cac co so y te su dung he thong</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Them co so</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Them co so moi</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Ten co so</Label><Input placeholder="Benh vien ABC" /></div>
              <div className="space-y-2"><Label>Dia chi</Label><Input placeholder="123 Nguyen Van A, Q.1" /></div>
              <div className="space-y-2"><Label>So dien thoai</Label><Input placeholder="028 1234 5678" /></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Da them co so!"); }}>Them co so</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((f) => (
          <Card key={f.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                  <div><CardTitle className="text-base">{f.name}</CardTitle></div>
                </div>
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{f.address}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{f.phone}</div>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm"><Stethoscope className="h-3.5 w-3.5 text-primary" /><span className="font-medium">{f.doctorCount}</span><span className="text-muted-foreground">bac si</span></div>
                <div className="flex items-center gap-1.5 text-sm"><Users className="h-3.5 w-3.5 text-primary" /><span className="font-medium">{f.patientCount}</span><span className="text-muted-foreground">benh nhan</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
