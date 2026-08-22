"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand } from "@/lib/brand";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal";
  const { signIn, user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setPending(true);
    try {
      signIn(email, password);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setPending(false);
    }
  }

  if (!ready || user) {
    return (
      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Opening your portal…</p>
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-5rem)] items-center justify-center overflow-hidden px-4 py-10">
      <Image
        src="/gallery/lookout.jpg"
        alt=""
        fill
        priority
        className="object-cover scale-110 blur-md"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/25 bg-background/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex justify-center">
          <BrandLogo size={140} highlight className="h-28 w-auto" />
        </div>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {brand.tagline}
        </p>
        <h1 className="mt-3 text-center font-heading text-4xl">Welcome back</h1>
        <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Sign in to your WOW traveler portal to see tours, bookings, and payment.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              className="h-11 bg-background/80"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Your password"
                className="h-11 bg-background/80 pr-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((open) => !open)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={() => {
              setEmail("aisha@wingsofwomen.test");
              setPassword("wander2026");
              setError(null);
            }}
          >
            Use demo traveler
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to {brand.short}?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
        <p className="mt-4 rounded-lg bg-muted/70 px-3 py-2 text-center text-xs leading-5 text-muted-foreground">
          Demo: aisha@wingsofwomen.test / wander2026
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center text-muted-foreground">
          Loading sign in…
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
