import { TripForm } from "@/components/admin/trip-form";
import type { TourRecord } from "@/lib/catalog";

export const metadata = { title: "New trip" };

const emptyTrip: TourRecord = {
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

export default function NewTripPage() {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">New trip</p>
      <h1 className="mt-2 font-heading text-4xl">Add an upcoming departure</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Fill the details guests should see, upload photos, set the amount, then save. Booking on
        the public site uses this record.
      </p>
      <div className="mt-8">
        <TripForm initial={emptyTrip} />
      </div>
    </div>
  );
}
