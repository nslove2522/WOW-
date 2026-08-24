"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PhotoField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { url?: string; error?: string };
    setBusy(false);
    if (!response.ok || !data.url) {
      setError(data.error || "Could not upload that photo.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-36 w-full rounded-xl object-cover ring-1 ring-foreground/10" />
      ) : (
        <div className="grid h-36 place-items-center rounded-xl bg-muted text-sm text-muted-foreground">
          No photo yet
        </div>
      )}
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={busy}
        onChange={(event) => void onFile(event.target.files?.[0])}
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or paste a photo link"
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {busy ? <p className="text-xs text-muted-foreground">Uploading…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
