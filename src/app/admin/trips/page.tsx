"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { TourRecord } from "@/lib/catalog";
import { formatPrice } from "@/lib/tours";

export default function AdminTripsPage() {
  const [tours, setTours] = useState<TourRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/tours")
      .then(async (response) => {
        const data = (await response.json()) as { tours?: TourRecord[]; error?: string };
        if (!response.ok) {
          setError(data.error || "Could not load trips.");
          setTours([]);
          return;
        }
        setTours(data.tours ?? []);
      })
      .catch(() => setError("Could not load trips."));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Trips</p>
          <h1 className="mt-2 font-heading text-4xl">Upcoming trip details</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Edit a trip and save. The public page and Razorpay amount update from this list.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/trips/new" />}>
          New trip
        </Button>
      </div>

      {error ? <p className="mt-8 text-sm text-destructive">{error}</p> : null}
      {!tours ? (
        <p className="mt-10 text-muted-foreground">Loading trips…</p>
      ) : tours.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No trips yet. Add one and turn on “show on the public website”.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {tours.map((tour) => (
            <li key={tour.id}>
              <Link
                href={`/admin/trips/${tour.id}`}
                className="flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:ring-foreground/25 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-heading text-xl">{tour.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {tour.nextDate || "No date yet"} · {tour.location}
                  </p>
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-medium">{formatPrice(tour.price)}</p>
                  <p className="text-muted-foreground">
                    {tour.published ? "Live on the site" : "Hidden from guests"} · {tour.seatsLeft} seats left
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
