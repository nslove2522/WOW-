"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  digitsForRazorpay,
  loadRazorpayCheckout,
  openRazorpayCheckout,
} from "@/lib/razorpay-checkout";
import { formatPrice, getTour } from "@/lib/tours";
import type { PaymentMode } from "@/lib/types";

const modes: { id: "card" | "upi"; title: string; hint: string }[] = [
  { id: "card", title: "Credit / debit card", hint: "Visa, Mastercard, RuPay via Razorpay" },
  { id: "upi", title: "UPI", hint: "GPay, PhonePe, BHIM via Razorpay" },
];

type Gateway = { enabled: boolean } | null;

type OrderPayload = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  error?: string;
};

type VerifyPayload = {
  ok?: boolean;
  bookingId?: string;
  tourSlug?: string;
  tourTitle?: string;
  travelDate?: string;
  seats?: number;
  amount?: number;
  paymentMode?: PaymentMode;
  error?: string;
};

export default function PayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tour = getTour(slug);
  const router = useRouter();
  const { user, ready, payForTour } = useAuth();
  const [gateway, setGateway] = useState<Gateway>(null);
  const [seats, setSeats] = useState(1);
  const [mode, setMode] = useState<"card" | "upi">("upi");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const total = useMemo(() => (tour ? tour.price * seats : 0), [tour, seats]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/razorpay/config")
      .then((response) => response.json() as Promise<{ enabled?: boolean }>)
      .then((data) => {
        if (!cancelled) setGateway({ enabled: Boolean(data.enabled) });
      })
      .catch(() => {
        if (!cancelled) setGateway({ enabled: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tour) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <BrandLogo size={140} highlight className="mx-auto mb-4 h-32 w-auto" />
        <h1 className="font-heading text-3xl">Tour not found</h1>
        <Button className="mt-6" nativeButton={false} render={<Link href="/tours" />}>
          Back to tours
        </Button>
      </div>
    );
  }

  if (!ready || gateway === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted-foreground">
        Loading checkout…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <BrandLogo size={140} highlight className="mx-auto mb-4 h-32 w-auto" />
        <h1 className="font-heading text-3xl">Sign in to pay</h1>
        <p className="mt-3 text-muted-foreground">
          Reservations sit on your WOW account so the host can see who is coming.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href={`/sign-in?next=/tours/${tour.slug}/pay`} />}
          >
            Sign in
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/register?next=/tours/${tour.slug}/pay`} />}
          >
            Register
          </Button>
        </div>
      </div>
    );
  }

  const traveler = user;
  const useRazorpay = gateway.enabled;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!Number.isInteger(seats) || seats < 1) {
      setError("Choose at least one traveler.");
      return;
    }
    if (!agree) {
      setError(
        useRazorpay
          ? "Confirm that you want to pay this amount through Razorpay."
          : "Confirm that you understand this checkout is a local demo until Razorpay keys are added.",
      );
      return;
    }

    const selected = getTour(slug);
    if (!selected) {
      setError("Tour is no longer listed.");
      return;
    }

    setPending(true);

    try {
      if (!useRazorpay) {
        const booking = await payForTour({
          tourSlug: selected.slug,
          tourTitle: selected.title,
          travelDate: selected.nextDate,
          seats,
          amount: selected.price * seats,
          paymentMode: mode,
        });
        router.push(`/portal?paid=${booking.id}`);
        return;
      }

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selected.slug,
          seats,
          userId: traveler.id,
          preferredMethod: mode,
        }),
      });
      const order = (await orderResponse.json()) as OrderPayload;
      if (!orderResponse.ok || !order.orderId) {
        throw new Error(order.error || "Could not start Razorpay checkout.");
      }

      const loaded = await loadRazorpayCheckout();
      if (!loaded) {
        throw new Error("Could not load Razorpay Checkout. Check your connection and try again.");
      }

      openRazorpayCheckout({
        key: order.keyId,
        amount: Number(order.amount),
        currency: order.currency || "INR",
        name: order.name,
        description: order.description,
        image: `${window.location.origin}/wow-logo.png`,
        order_id: order.orderId,
        prefill: {
          name: traveler.name,
          email: traveler.email,
          contact: digitsForRazorpay(traveler.phone),
          method: mode,
        },
        method: {
          card: true,
          upi: true,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
        theme: { color: "#7a4a2b" },
        modal: {
          ondismiss: () => setPending(false),
        },
        handler: (response) => {
          void (async () => {
            try {
              const verifyResponse = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const verified = (await verifyResponse.json()) as VerifyPayload;
              if (!verifyResponse.ok || !verified.ok || !verified.bookingId) {
                throw new Error(verified.error || "Payment could not be verified.");
              }
              const booking = await payForTour({
                id: verified.bookingId,
                tourSlug: verified.tourSlug ?? selected.slug,
                tourTitle: verified.tourTitle ?? selected.title,
                travelDate: verified.travelDate ?? selected.nextDate,
                seats: verified.seats ?? seats,
                amount: verified.amount ?? selected.price * seats,
                paymentMode: verified.paymentMode ?? mode,
              });
              router.push(`/portal?paid=${booking.id}`);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment failed.");
              setPending(false);
            }
          })();
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <BrandLogo size={80} className="mb-3 h-[4.5rem] w-auto" />
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Payment</p>
          <h1 className="mt-1 font-heading text-4xl">Reserve {tour.title}</h1>
          <p className="mt-2 text-muted-foreground">
            Paying as {user.name}.{" "}
            {useRazorpay
              ? "Card and UPI open in Razorpay Checkout. The booking is saved only after Razorpay confirms the payment."
              : "Razorpay keys are not on this server yet, so this machine records a local demo receipt instead of charging."}
          </p>
        </div>

        <div className="max-w-xs space-y-2">
          <Label htmlFor="seats">Travelers</Label>
          <Input
            id="seats"
            type="number"
            min={1}
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">{tour.seatsLeft} seats still listed.</p>
        </div>

        <RadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as "card" | "upi")}
          className="grid gap-3"
        >
          {modes.map((item) => (
            <Label
              key={item.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 has-data-checked:border-primary"
            >
              <RadioGroupItem value={item.id} />
              <span>
                <span className="block font-medium">{item.title}</span>
                <span className="text-sm text-muted-foreground">{item.hint}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>

        <label className="flex items-start gap-3 text-sm leading-6">
          <Checkbox checked={agree} onCheckedChange={(value) => setAgree(Boolean(value))} />
          {useRazorpay
            ? `Pay ${formatPrice(total)} through Razorpay for this trip. You will complete card or UPI in the Razorpay window.`
            : "I understand this checkout is a local demo until Razorpay keys are added. No money will be taken."}
        </label>

        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}

        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending
            ? useRazorpay
              ? "Opening Razorpay…"
              : "Processing…"
            : `Pay ${formatPrice(total)}`}
        </Button>
      </form>

      <aside className="h-fit rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <p className="text-sm text-muted-foreground">Order</p>
        <h2 className="mt-1 font-heading text-2xl">{tour.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{tour.nextDate}</p>
        <p className="mt-4 text-sm">
          {seats} × {formatPrice(tour.price)}
        </p>
        <p className="mt-2 font-heading text-3xl">{formatPrice(total)}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {useRazorpay ? "Charged by Razorpay in INR." : "Demo total — Razorpay not configured."}
        </p>
      </aside>
    </div>
  );
}
