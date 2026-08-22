"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal";
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [women, setWomen] = useState(false);
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!women || !adult) {
      setError("Confirm you are 18+ and joining a women-only traveler community.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    try {
      register({ name, email, password, city, phone });
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Account</p>
      <h1 className="mt-2 font-heading text-4xl">Register</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        WOW — Wings of Women is a women-only trip club. Your account is the portal for
        bookings, host messages, and payment receipts.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Home city</Label>
            <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm leading-6">
          <Checkbox checked={adult} onCheckedChange={(value) => setAdult(Boolean(value))} />
          I am 18 or older.
        </label>
        <label className="flex items-start gap-3 text-sm leading-6">
          <Checkbox checked={women} onCheckedChange={(value) => setWomen(Boolean(value))} />
          I am joining as a woman traveler on women-only group trips.
        </label>
        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}
        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="py-20 text-center text-muted-foreground">Loading registration…</div>}
    >
      <RegisterForm />
    </Suspense>
  );
}
