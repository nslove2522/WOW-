"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Summary = {
  trips: number;
  published: number;
  travelers: number;
  bookings: number;
  error?: string;
};

export default function AdminHomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function load() {
      const [tripsRes, travelersRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/tours"),
        fetch("/api/admin/travelers"),
        fetch("/api/admin/bookings"),
      ]);
      const trips = (await tripsRes.json()) as { tours?: { published: boolean; price: number }[]; error?: string };
      const travelers = (await travelersRes.json()) as { travelers?: unknown[]; error?: string };
      const bookings = (await bookingsRes.json()) as { bookings?: { amount: number }[]; error?: string };
      const error = trips.error || travelers.error || bookings.error;
      setSummary({
        trips: trips.tours?.length ?? 0,
        published: trips.tours?.filter((item) => item.published).length ?? 0,
        travelers: travelers.travelers?.length ?? 0,
        bookings: bookings.bookings?.length ?? 0,
        error,
      });
    }
    void load();
  }, []);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Owner desk</p>
      <h1 className="mt-2 font-heading text-4xl">Keep the booking site in sync</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Change a trip here — name, photos, date, or amount — and the public Wings of Women site
        shows the new details. Guests still book and pay on the main portal.
      </p>

      {!summary ? (
        <p className="mt-10 text-muted-foreground">Loading your numbers…</p>
      ) : summary.error ? (
        <p className="mt-10 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{summary.error}</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Trips on file" value={String(summary.trips)} />
          <Stat label="Live on the public site" value={String(summary.published)} />
          <Stat label="Registered profiles" value={String(summary.travelers)} />
          <Stat label="Bookings" value={String(summary.bookings)} />
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" nativeButton={false} render={<Link href="/admin/trips/new" />}>
          Add an upcoming trip
        </Button>
        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/admin/trips" />}>
          Edit trip details or amount
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl">{value}</p>
    </div>
  );
}
