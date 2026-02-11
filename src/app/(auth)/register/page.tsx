"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Mat khau xac nhan khong khop");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Dang ky tai khoan</CardTitle>
        <CardDescription>
          Tao tai khoan moi de su dung he thong Hopita
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ho va ten</Label>
            <Input
              id="fullName"
              placeholder="Nguyen Van A"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">So dien thoai</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912 345 678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Vai tro</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Chon vai tro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Bac si</SelectItem>
                <SelectItem value="ktv">KTV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mat khau</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xac nhan mat khau</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Dang xu ly..." : "Dang ky"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Da co tai khoan?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Dang nhap
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
