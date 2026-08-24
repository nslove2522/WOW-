"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = {
  passwordConfigured?: boolean;
  databaseReady?: boolean;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    void fetch("/api/admin/status")
      .then((response) => response.json() as Promise<Status>)
      .then(setStatus)
      .catch(() => setStatus({}));
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-16">
      <BrandLogo size={120} highlight className="mb-6 h-24 w-auto" />
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Owner desk</p>
      <h1 className="mt-2 font-heading text-4xl">Update trips without touching code</h1>
      <p className="mt-3 text-muted-foreground">
        This is the administration site. Change trip details, the amount, photos, and upcoming
        dates here. The public booking site picks them up automatically.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Owner password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Opening desk…" : "Open owner desk"}
        </Button>
      </form>

      <div className="mt-8 space-y-2 rounded-xl bg-card p-4 text-sm leading-6 text-muted-foreground ring-1 ring-foreground/10">
        <p className="font-medium text-foreground">One-time setup</p>
        <p>
          Password on this host:{" "}
          {status?.passwordConfigured ? "ready" : "missing — add ADMIN_PASSWORD, then redeploy"}
        </p>
        <p>
          Trip database:{" "}
          {status?.databaseReady
            ? "ready"
            : "missing — add SUPABASE_SERVICE_ROLE_KEY (service_role, not anon) and run supabase/schema.sql"}
        </p>
        <p>
          Bookmark this page: <span className="text-foreground">/admin</span>
        </p>
      </div>
      <Link href="/" className="mt-6 text-sm text-muted-foreground hover:underline">
        Back to the public site
      </Link>
    </div>
  );
}
