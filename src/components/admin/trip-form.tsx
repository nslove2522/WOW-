"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PhotoField } from "@/components/admin/photo-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TourRecord } from "@/lib/catalog";
import { COUNTRIES } from "@/lib/regions";
import { slugFromTitle } from "@/lib/slug";
import type { Difficulty } from "@/lib/tours";

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

// The catalog stores the date as the friendly string guests read (e.g.
// "Saturday, 22 August 2026"). These helpers let the form use a calendar
// picker while still saving that friendly string.
function friendlyDate(iso: string) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toIsoDate(value: string) {
  if (!value) return "";
  // Accept the friendly string too (strip a leading "Weekday, " if present).
  for (const candidate of [value, value.replace(/^[^,]*,\s*/, "")]) {
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  return "";
}

export function emptyTrip(): TourRecord {
  return {
    id: "",
    slug: "",
    title: "",
    location: "",
    region: "India",
    tagline: "Women only. Strangers today, sisters forever.",
    description: "",
    image: "",
    imageAlt: "",
    gallery: [
      { src: "", alt: "" },
      { src: "", alt: "" },
    ],
    days: 1,
    nights: 0,
    price: 0,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 12,
    seatsLeft: 12,
    nextDate: "",
    host: {
      name: "Wings of Women",
      years: 1,
      bio: "DM @wings._ofwomen or WhatsApp 9489029797. Limited slots. Itinerary details are shared personally.",
    },
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: [{ day: 1, title: "", detail: "" }],
    availabilityLabel: "Limited slots",
    published: true,
  };
}

export function TripForm({ initial }: { initial: TourRecord }) {
  const router = useRouter();
  const isNew = !initial.id || initial.id.startsWith("fallback-");
  const [trip, setTrip] = useState<TourRecord>(initial);
  const [highlights, setHighlights] = useState(initial.highlights.join("\n"));
  const [inclusions, setInclusions] = useState(initial.inclusions.join("\n"));
  const [exclusions, setExclusions] = useState(initial.exclusions.join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof TourRecord>(key: K, value: TourRecord[K]) {
    setTrip((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!trip.title.trim()) {
      setError("Give the trip a name guests will see.");
      return;
    }
    setPending(true);
    const payload: TourRecord = {
      ...trip,
      slug: trip.slug.trim() || slugFromTitle(trip.title),
      highlights: lines(highlights),
      inclusions: lines(inclusions),
      exclusions: lines(exclusions),
      gallery: (trip.gallery ?? []).filter((photo) => photo.src),
      itinerary: trip.itinerary.map((stop, index) => ({
        ...stop,
        day: stop.day || index + 1,
      })),
    };

    const response = await fetch(isNew ? "/api/admin/tours" : `/api/admin/tours/${trip.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { tour?: TourRecord; error?: string };
    setPending(false);
    if (!response.ok || !data.tour) {
      setError(data.error || "Could not save this trip.");
      return;
    }
    router.push("/admin/trips");
    router.refresh();
  }

  async function onDelete() {
    if (isNew) return;
    if (!window.confirm("Remove this trip from the public site?")) return;
    setPending(true);
    const response = await fetch(`/api/admin/tours/${trip.id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not delete this trip.");
      return;
    }
    router.push("/admin/trips");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Trip name</Label>
          <Input
            id="title"
            value={trip.title}
            onChange={(event) => {
              const title = event.target.value;
              setTrip((current) => ({
                ...current,
                title,
                slug: isNew ? slugFromTitle(title) : current.slug,
              }));
            }}
            placeholder="Trip to Seetharkundu Falls, Kollengodu"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location shown on the page</Label>
          <Input
            id="location"
            value={trip.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Seetharkundu Falls, Kollengode, Palakkad, Kerala"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Country / region tag</Label>
          <select
            id="region"
            value={trip.region}
            onChange={(event) => update("region", event.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
          >
            {trip.region && !COUNTRIES.some((country) => country.name === trip.region) ? (
              <option value={trip.region}>{trip.region}</option>
            ) : null}
            {COUNTRIES.map((country) => (
              <option key={country.iso} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty tag</Label>
          <select
            id="difficulty"
            value={trip.difficulty}
            onChange={(event) => update("difficulty", event.target.value as Difficulty)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Active</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextDate">Upcoming date</Label>
          <Input
            id="nextDate"
            type="date"
            value={toIsoDate(trip.nextDate)}
            onChange={(event) => update("nextDate", friendlyDate(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            {trip.nextDate ? `Guests see: ${trip.nextDate}` : "Pick a date from the calendar."}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability tag</Label>
          <Input
            id="availability"
            value={trip.availabilityLabel}
            onChange={(event) => update("availabilityLabel", event.target.value)}
            placeholder="Limited slots"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Amount per traveler (₹)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            value={trip.price}
            onChange={(event) => update("price", Number(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            This is what Razorpay charges. Use 1 only while testing payments.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="groupSize">Group size</Label>
            <Input
              id="groupSize"
              type="number"
              min={1}
              value={trip.groupSize}
              onChange={(event) => {
                const groupSize = Number(event.target.value);
                setTrip((current) => {
                  // Keep "seats left" in step with the total while it hasn't been
                  // hand-adjusted (new trip, or seats still equal the old total).
                  const inSync = isNew || current.seatsLeft === current.groupSize;
                  return {
                    ...current,
                    groupSize,
                    seatsLeft: inSync ? groupSize : current.seatsLeft,
                  };
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatsLeft">Seats left</Label>
            <Input
              id="seatsLeft"
              type="number"
              min={0}
              value={trip.seatsLeft}
              onChange={(event) => update("seatsLeft", Number(event.target.value))}
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted-foreground sm:col-span-2">
          Seats left starts from the group size and drops automatically each time a
          traveler books and pays.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="days">Days</Label>
            <Input
              id="days"
              type="number"
              min={1}
              value={trip.days}
              onChange={(event) => update("days", Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nights">Nights</Label>
            <Input
              id="nights"
              type="number"
              min={0}
              value={trip.nights}
              onChange={(event) => update("nights", Number(event.target.value))}
            />
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={trip.published}
            onChange={(event) => update("published", event.target.checked)}
            className="size-4"
          />
          Show this trip on the public website so people can book
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Short line under the title</Label>
        <Input
          id="tagline"
          value={trip.tagline}
          onChange={(event) => update("tagline", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Trip story / details</Label>
        <Textarea
          id="description"
          rows={6}
          value={trip.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PhotoField
          label="Cover photo (the wide header)"
          value={trip.image}
          onChange={(url) => update("image", url)}
          hint="Upload from your phone or laptop. This becomes the blurred header on the trip page."
        />
        <div className="space-y-2">
          <Label htmlFor="imageAlt">Cover photo description</Label>
          <Input
            id="imageAlt"
            value={trip.imageAlt}
            onChange={(event) => update("imageAlt", event.target.value)}
            placeholder="Waterfall in the forest"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 font-medium">Gallery photos</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {(trip.gallery ?? [{ src: "", alt: "" }]).map((photo, index) => (
            <PhotoField
              key={index}
              label={`Photo ${index + 1}`}
              value={photo.src}
              onChange={(url) => {
                const gallery = [...(trip.gallery ?? [])];
                gallery[index] = { ...gallery[index], src: url, alt: gallery[index]?.alt ?? "" };
                update("gallery", gallery);
              }}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => update("gallery", [...(trip.gallery ?? []), { src: "", alt: "" }])}
        >
          Add another gallery photo
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights (one per line)</Label>
          <Textarea id="highlights" rows={6} value={highlights} onChange={(event) => setHighlights(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inclusions">Included (one per line)</Label>
          <Textarea id="inclusions" rows={6} value={inclusions} onChange={(event) => setInclusions(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exclusions">Not included (one per line)</Label>
          <Textarea id="exclusions" rows={6} value={exclusions} onChange={(event) => setExclusions(event.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="font-medium">Day by day</p>
        {trip.itinerary.map((stop, index) => (
          <div key={index} className="grid gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:grid-cols-[80px_1fr]">
            <div className="space-y-2">
              <Label>Day</Label>
              <Input
                type="number"
                min={1}
                value={stop.day}
                onChange={(event) => {
                  const itinerary = [...trip.itinerary];
                  itinerary[index] = { ...stop, day: Number(event.target.value) };
                  update("itinerary", itinerary);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={stop.title}
                onChange={(event) => {
                  const itinerary = [...trip.itinerary];
                  itinerary[index] = { ...stop, title: event.target.value };
                  update("itinerary", itinerary);
                }}
              />
              <Label>What happens</Label>
              <Textarea
                rows={3}
                value={stop.detail}
                onChange={(event) => {
                  const itinerary = [...trip.itinerary];
                  itinerary[index] = { ...stop, detail: event.target.value };
                  update("itinerary", itinerary);
                }}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            update("itinerary", [
              ...trip.itinerary,
              { day: trip.itinerary.length + 1, title: "", detail: "" },
            ])
          }
        >
          Add a day
        </Button>
      </div>

      {error ? <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save and update the public site"}
        </Button>
        {!isNew ? (
          <Button type="button" variant="outline" disabled={pending} onClick={() => void onDelete()}>
            Remove trip
          </Button>
        ) : null}
      </div>
    </form>
  );
}
