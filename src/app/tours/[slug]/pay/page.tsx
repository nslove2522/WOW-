"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice, getTour } from "@/lib/tours";
import type { PaymentMode } from "@/lib/types";

const modes: { id: PaymentMode; title: string; hint: string }[] = [
  { id: "card", title: "Credit / debit card", hint: "Visa, Mastercard, RuPay" },
  { id: "upi", title: "UPI", hint: "GPay, PhonePe, BHIM" },
  { id: "netbanking", title: "Net banking", hint: "Major Indian banks" },
  { id: "wallet", title: "Digital wallet", hint: "Paytm, Amazon Pay" },
];

export default function PayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tour = getTour(slug);
  const router = useRouter();
  const { user, ready, payForTour } = useAuth();
  const [seats, setSeats] = useState(1);
  const [mode, setMode] = useState<PaymentMode>("upi");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("HDFC Bank");
  const [wallet, setWallet] = useState("Paytm");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const total = useMemo(() => (tour ? tour.price * seats : 0), [tour, seats]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-heading text-3xl">Tour not found</h1>
        <Button className="mt-6" nativeButton={false} render={<Link href="/tours" />}>
          Back to tours
        </Button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted-foreground">
        Loading checkout…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!agree) {
      setError("Confirm that you understand this is a simulated payment.");
      return;
    }
    if (mode === "card") {
      if (cardNumber.replace(/\s/g, "").length < 12 || cvv.length < 3 || !expiry || !cardName) {
        setError("Enter complete card details to continue the demo.");
        return;
      }
    }
    if (mode === "upi" && !upiId.includes("@")) {
      setError("Enter a UPI ID like name@okbank.");
      return;
    }
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    try {
      const selected = getTour(slug);
      if (!selected) {
        setError("Tour is no longer listed.");
        setPending(false);
        return;
      }
      const booking = payForTour({
        tourSlug: selected.slug,
        tourTitle: selected.title,
        travelDate: selected.nextDate,
        seats,
        amount: selected.price * seats,
        paymentMode: mode,
      });
      router.push(`/portal?paid=${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Payment</p>
          <h1 className="mt-1 font-heading text-4xl">Reserve {tour.title}</h1>
          <p className="mt-2 text-muted-foreground">
            Paying as {user.name}. Choose a mode — nothing is charged.
          </p>
        </div>

        <div className="max-w-xs space-y-2">
          <Label htmlFor="seats">Travelers</Label>
          <Input
            id="seats"
            type="number"
            min={1}
            max={Math.min(3, tour.seatsLeft)}
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">{tour.seatsLeft} seats still listed.</p>
        </div>

        <RadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as PaymentMode)}
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

        {mode === "card" && (
          <Card>
            <CardHeader>
              <CardTitle>Card details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on card</Label>
                <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === "upi" && (
          <div className="space-y-2">
            <Label htmlFor="upi">UPI ID</Label>
            <Input
              id="upi"
              placeholder="you@okaxis"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {mode === "netbanking" && (
          <div className="space-y-2">
            <Label htmlFor="bank">Bank</Label>
            <Input id="bank" value={bank} onChange={(e) => setBank(e.target.value)} />
          </div>
        )}

        {mode === "wallet" && (
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet</Label>
            <Input id="wallet" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          </div>
        )}

        <label className="flex items-start gap-3 text-sm leading-6">
          <Checkbox checked={agree} onCheckedChange={(value) => setAgree(Boolean(value))} />
          I understand this checkout is a demo. No money will be taken from this
          card, UPI ID, bank, or wallet.
        </label>

        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}

        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Processing…" : `Pay ${formatPrice(total)}`}
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
      </aside>
    </div>
  );
}
