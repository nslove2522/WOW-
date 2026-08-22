"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal";
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      signIn(email, password);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <BrandLogo size={120} highlight className="mb-4 h-28 w-auto" />
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Account</p>
      <h1 className="mt-2 font-heading text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo traveler: <span className="font-medium text-foreground">aisha@wingsofwomen.test</span>{" "}
        / <span className="font-medium text-foreground">wander2026</span>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}
        <Button type="submit" className="w-full" size="lg">
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setEmail("aisha@wingsofwomen.test");
            setPassword("wander2026");
          }}
        >
          Fill demo account
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted-foreground">Loading sign in…</div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
