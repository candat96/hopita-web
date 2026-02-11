"use client";

import { useState } from "react";
import { staffUsers, facilities } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserCog } from "lucide-react";

const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Admin", variant: "default" },
  doctor: { label: "Bac si", variant: "secondary" },
  ktv: { label: "KTV", variant: "outline" },
};

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Quan ly User</h1><p className="text-muted-foreground">Quan ly tai khoan va phan quyen</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Moi user moi</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Moi user moi</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Ho ten</Label><Input placeholder="Nguyen Van A" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@hopita.vn" /></div>
              <div className="space-y-2"><Label>Vai tro</Label><Select><SelectTrigger><SelectValue placeholder="Chon vai tro" /></SelectTrigger><SelectContent><SelectItem value="doctor">Bac si</SelectItem><SelectItem value="ktv">KTV</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Co so</Label><Select><SelectTrigger><SelectValue placeholder="Chon co so" /></SelectTrigger><SelectContent>{facilities.map((f) => (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}</SelectContent></Select></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Da moi user!"); }}>Gui loi moi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Ho ten</TableHead><TableHead>Email</TableHead><TableHead>SDT</TableHead><TableHead>Vai tro</TableHead><TableHead>Ngay tao</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {staffUsers.map((u) => {
                const role = roleMap[u.role];
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone ?? "\u2014"}</TableCell>
                    <TableCell><Badge variant={role.variant}>{role.label}</Badge></TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell><Button variant="ghost" size="sm"><UserCog className="h-4 w-4" /></Button></TableCell>
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
