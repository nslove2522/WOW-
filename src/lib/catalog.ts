import { createClient } from "@supabase/supabase-js";

import { supabaseAnonKey, supabaseUrl, isSupabaseEnabled } from "@/lib/supabase/env";
import { getTour, tours, type Difficulty, type Tour } from "@/lib/tours";

export type TourRecord = Tour & {
  id: string;
  published: boolean;
  availabilityLabel: string;
};

type TourRow = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  image_alt: string;
  gallery: unknown;
  days: number;
  nights: number;
  price: number;
  difficulty: string;
  group_size: number;
  seats_left: number;
  next_date: string;
  host_name: string;
  host_years: number;
  host_bio: string;
  highlights: unknown;
  inclusions: unknown;
  exclusions: unknown;
  itinerary: unknown;
  availability_label: string;
  published: boolean;
};

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

function asGallery(value: unknown): Tour["gallery"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const photo = item as { src?: unknown; alt?: unknown };
      if (typeof photo.src !== "string" || !photo.src) return null;
      return { src: photo.src, alt: typeof photo.alt === "string" ? photo.alt : "" };
    })
    .filter((item): item is { src: string; alt: string } => Boolean(item));
}

function asItinerary(value: unknown): Tour["itinerary"] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const stop = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      day: Number(stop.day) || index + 1,
      title: String(stop.title ?? ""),
      detail: String(stop.detail ?? ""),
    };
  });
}

function asDifficulty(value: string): Difficulty {
  if (value === "Moderate" || value === "Active") return value;
  return "Easy";
}

export function rowToTour(row: TourRow): TourRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    region: row.region,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    gallery: asGallery(row.gallery),
    days: row.days,
    nights: row.nights,
    price: row.price,
    currency: "INR",
    difficulty: asDifficulty(row.difficulty),
    groupSize: row.group_size,
    seatsLeft: row.seats_left,
    nextDate: row.next_date,
    host: {
      name: row.host_name,
      years: row.host_years,
      bio: row.host_bio,
    },
    highlights: asStringArray(row.highlights),
    inclusions: asStringArray(row.inclusions),
    exclusions: asStringArray(row.exclusions),
    itinerary: asItinerary(row.itinerary),
    availabilityLabel: row.availability_label || "Limited slots",
    published: row.published,
  };
}

export function tourToRow(input: Partial<TourRecord> & { slug: string; title: string }) {
  return {
    slug: input.slug,
    title: input.title,
    location: input.location ?? "",
    region: input.region ?? "India",
    tagline: input.tagline ?? "",
    description: input.description ?? "",
    image: input.image ?? "",
    image_alt: input.imageAlt ?? "",
    gallery: input.gallery ?? [],
    days: input.days ?? 1,
    nights: input.nights ?? 0,
    price: input.price ?? 0,
    difficulty: input.difficulty ?? "Easy",
    group_size: input.groupSize ?? 12,
    seats_left: input.seatsLeft ?? 12,
    next_date: input.nextDate ?? "",
    host_name: input.host?.name ?? "Wings of Women",
    host_years: input.host?.years ?? 1,
    host_bio: input.host?.bio ?? "",
    highlights: input.highlights ?? [],
    inclusions: input.inclusions ?? [],
    exclusions: input.exclusions ?? [],
    itinerary: input.itinerary ?? [],
    availability_label: input.availabilityLabel ?? "Limited slots",
    published: input.published ?? true,
    updated_at: new Date().toISOString(),
  };
}

const TOUR_COLUMNS =
  "id, slug, title, location, region, tagline, description, image, image_alt, gallery, days, nights, price, difficulty, group_size, seats_left, next_date, host_name, host_years, host_bio, highlights, inclusions, exclusions, itinerary, availability_label, published";

function publicClient() {
  return createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function fallbackRecord(tour: Tour): TourRecord {
  return {
    ...tour,
    id: `fallback-${tour.slug}`,
    published: true,
    availabilityLabel: tour.days === 1 ? "Limited slots" : `${tour.seatsLeft} seats left`,
  };
}

export async function getPublishedTours(): Promise<TourRecord[]> {
  if (!isSupabaseEnabled()) {
    return tours.map(fallbackRecord);
  }
  try {
    const { data, error } = await publicClient()
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("published", true)
      .order("next_date", { ascending: true });
    if (error || !data) return tours.map(fallbackRecord);
    if (data.length === 0) return [];
    return (data as TourRow[]).map(rowToTour);
  } catch {
    return tours.map(fallbackRecord);
  }
}

export async function getPublishedTour(slug: string): Promise<TourRecord | undefined> {
  if (!isSupabaseEnabled()) {
    const tour = getTour(slug);
    return tour ? fallbackRecord(tour) : undefined;
  }
  try {
    const { data, error } = await publicClient()
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) {
      const tour = getTour(slug);
      return tour ? fallbackRecord(tour) : undefined;
    }
    return rowToTour(data as TourRow);
  } catch {
    const tour = getTour(slug);
    return tour ? fallbackRecord(tour) : undefined;
  }
}

export async function getFeaturedTour(): Promise<TourRecord | undefined> {
  const listed = await getPublishedTours();
  return listed[0];
}
