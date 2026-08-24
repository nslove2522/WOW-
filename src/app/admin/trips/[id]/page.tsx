"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TripForm } from "@/components/admin/trip-form";
import type { TourRecord } from "@/lib/catalog";

export default function EditTripPage() {
  const params = useParams<{ id: string }>();
  const [tour, setTour] = useState<TourRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/tours")
      .then(async (response) => {
        const data = (await response.json()) as { tours?: TourRecord[]; error?: string };
        if (!response.ok) {
          setError(data.error || "Could not load this trip.");
          return;
        }
        const found = data.tours?.find((item) => item.id === params.id);
        if (!found) {
          setError("This trip is not on file.");
          return;
        }
        setTour(found);
      })
      .catch(() => setError("Could not load this trip."));
  }, [params.id]);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }
  if (!tour) {
    return <p className="text-muted-foreground">Opening trip…</p>;
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Edit trip</p>
      <h1 className="mt-2 font-heading text-4xl">{tour.title}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Saving writes to the same catalog the public site and checkout read.
      </p>
      <div className="mt-8">
        <TripForm initial={tour} />
      </div>
    </div>
  );
}
