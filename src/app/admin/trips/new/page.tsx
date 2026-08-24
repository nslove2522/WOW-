import { TripForm, emptyTrip } from "@/components/admin/trip-form";

export const metadata = { title: "New trip" };

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
        <TripForm initial={emptyTrip()} />
      </div>
    </div>
  );
}
