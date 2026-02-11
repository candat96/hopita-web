"use client";

import { useState } from "react";
import { staffUsers } from "@/lib/mock-data";
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
  doctor: { label: "Bác sĩ", variant: "secondary" },
  ktv: { label: "KTV", variant: "outline" },
};

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Quản lý User</h1><p className="text-muted-foreground">Quản lý tài khoản và phân quyền</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Mời user mới</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Mời user mới</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Họ tên</Label><Input placeholder="Nguyen Van A" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@hopita.vn" /></div>
              <div className="space-y-2"><Label>Vai trò</Label><Select><SelectTrigger><SelectValue placeholder="Chọn vai trò" /></SelectTrigger><SelectContent><SelectItem value="doctor">Bác sĩ</SelectItem><SelectItem value="ktv">KTV</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div>
              <Button className="w-full" onClick={() => { setDialogOpen(false); alert("Đã mời user!"); }}>Gửi lời mời</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Họ tên</TableHead><TableHead>Email</TableHead><TableHead>SĐT</TableHead><TableHead>Vai trò</TableHead><TableHead>Ngày tạo</TableHead><TableHead /></TableRow></TableHeader>
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
