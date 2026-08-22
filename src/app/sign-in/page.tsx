"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { AuthBackdrop } from "@/components/auth-backdrop";
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
  const { signIn, user, ready, cloud } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setPending(true);
    try {
      await signIn(email, password);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setPending(false);
    }
  }

  if (!ready || user) {
    return (
      <>
        <AuthBackdrop />
        <div className="relative z-10 flex min-h-dvh items-center justify-center px-4">
          <p className="text-sm text-teal-950/80">Opening your portal…</p>
        </div>
      </>
    );
  }

  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <AuthBackdrop />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-[color-mix(in_oklch,white_78%,oklch(0.92_0.04_180))] p-6 shadow-[0_24px_60px_rgba(12,60,70,0.28)] backdrop-blur-xl sm:p-8">
        <div className="flex justify-center">
          <BrandLogo size={140} highlight className="h-28 w-auto" />
        </div>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-teal-800/80">
          {brand.tagline}
        </p>
        <h1 className="mt-3 text-center font-heading text-4xl text-teal-950">
          Start in the open air
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-teal-900/70">
          Sign in to your WOW traveler portal. Sea air, mountain green, and your
          next trip in one place.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-teal-950">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              className="h-11 border-teal-800/20 bg-white/80"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-teal-950">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Your password"
                className="h-11 border-teal-800/20 bg-white/80 pr-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-teal-800/70 hover:text-teal-950"
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

          <Button
            type="submit"
            className="w-full bg-teal-800 text-white hover:bg-teal-700"
            size="lg"
            disabled={pending}
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          {!cloud ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full border-teal-800/25 bg-white/50 text-teal-950 hover:bg-white/80"
                disabled={pending}
                onClick={() => {
                  setEmail("aisha@wingsofwomen.test");
                  setPassword("wander2026");
                  setError(null);
                }}
              >
                Use demo traveler
              </Button>
            </>
          ) : null}
        </form>

        <p className="mt-6 text-center text-sm text-teal-900/70">
          New to {brand.short}?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="font-medium text-teal-800 underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
        {!cloud ? (
          <p className="mt-4 rounded-lg bg-sky-100/70 px-3 py-2 text-center text-xs leading-5 text-teal-900/70">
            Demo: aisha@wingsofwomen.test / wander2026
          </p>
        ) : (
          <p className="mt-4 rounded-lg bg-sky-100/70 px-3 py-2 text-center text-xs leading-5 text-teal-900/70">
            Accounts are stored in the cloud. Register once, then sign in from any device.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          Loading sign in…
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
