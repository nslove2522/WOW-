import { BrandLogo } from "@/components/brand-logo";
import { TourCard } from "@/components/tour-card";
import { tours } from "@/lib/tours";

export const metadata = {
  title: "Tours",
};

export default function ToursPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <BrandLogo size={96} highlight className="mb-4 size-20" />
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Catalog</p>
      <h1 className="mt-2 font-heading text-4xl">Upcoming tours</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every departure is women-only, hosted, and capped. Open a tour for the
        full itinerary, inclusions, and payment.
      </p>
      {tours.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No departures are listed right now. Check back after the next season
          opens.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
