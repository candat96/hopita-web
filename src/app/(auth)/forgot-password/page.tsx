"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Quen mat khau</CardTitle>
        <CardDescription>
          Nhap email cua ban, chung toi se gui lien ket dat lai mat khau
        </CardDescription>
      </CardHeader>

      {sent ? (
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Lien ket dat lai mat khau da duoc gui den{" "}
            <span className="font-medium">{email}</span>. Vui long kiem tra hop
            thu cua ban.
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Gui lai
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Dang xu ly..." : "Gui lien ket dat lai"}
            </Button>
          </CardFooter>
        </form>
      )}

      <div className="pb-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lai dang nhap
        </Link>
      </div>
    </Card>
  );
}
