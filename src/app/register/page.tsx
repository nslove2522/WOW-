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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal";
  const { register, user, ready } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const city = String(data.get("city") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const confirmAge = data.get("confirmAge") === "on";
    const confirmWomenOnly = data.get("confirmWomenOnly") === "on";

    if (!name || !email || !password || !city || !phone) {
      setError("Fill every field so we can keep your bookings in one place.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (!confirmAge) {
      setError("You need to confirm you are 18 or older.");
      return;
    }
    if (!confirmWomenOnly) {
      setError("These trips are for women traveling as themselves — please confirm.");
      return;
    }

    setPending(true);
    try {
      register({ name, email, password, city, phone });
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
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
        src="/gallery/trail.jpg"
        alt=""
        fill
        priority
        className="object-cover scale-110 blur-lg"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/50 via-emerald-600/40 to-teal-900/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/35 via-transparent to-sky-200/30" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/45 bg-[color-mix(in_oklch,white_80%,oklch(0.93_0.05_165))] p-6 shadow-[0_24px_60px_rgba(12,70,55,0.28)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size={140} highlight className="h-28 w-auto" />
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-teal-800/80">
            {brand.tagline}
          </p>
          <h1 className="mt-3 font-heading text-4xl text-teal-950">Register</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-teal-900/70">
            Open air, green hills, and a seat on a women-only trip. One profile,
            then you book without repeating yourself.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-teal-950">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className="h-11 border-teal-800/20 bg-white/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-teal-950">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="h-11 border-teal-800/20 bg-white/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-teal-950">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                minLength={8}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="h-11 border-teal-800/20 bg-white/80 pr-10"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-teal-950">
                Home city
              </Label>
              <Input
                id="city"
                name="city"
                required
                autoComplete="address-level2"
                placeholder="City"
                className="h-11 border-teal-800/20 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-teal-950">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                required
                autoComplete="tel"
                placeholder="Mobile number"
                className="h-11 border-teal-800/20 bg-white/80"
              />
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-teal-950/85">
            <input
              type="checkbox"
              name="confirmAge"
              className="mt-1 h-4 w-4 rounded border-teal-900/30 accent-teal-800"
            />
            I confirm I am 18 or older.
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-teal-950/85">
            <input
              type="checkbox"
              name="confirmWomenOnly"
              className="mt-1 h-4 w-4 rounded border-teal-900/30 accent-teal-800"
            />
            I understand these trips are reserved for women traveling without a
            companion, and I will travel as myself — not as a plus-one.
          </label>

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
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-teal-900/70">
          Already have an account?{" "}
          <Link
            href={`/sign-in?next=${encodeURIComponent(next)}`}
            className="font-medium text-teal-800 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center text-muted-foreground">
          Loading registration…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
