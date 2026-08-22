import { TourCard } from "@/components/tour-card";
import { tours } from "@/lib/tours";

export const metadata = {
  title: "Tours",
};

export default function ToursPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Catalog</p>
      <h1 className="mt-2 font-heading text-4xl">This season</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        One women-only day trip. Open it for the plan, inclusions, and payment.
      </p>
      {tours.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No departures are listed right now. Check back after the next season
          opens.
        </p>
      ) : (
        <div className="mt-10 grid max-w-md gap-6 sm:max-w-lg">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
