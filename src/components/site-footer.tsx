import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-heading text-lg">Kindred Trails</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Small-group trips for women traveling without a companion. Hosted routes,
            locked guest lists, and a portal for your bookings.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <Link href="/tours" className="hover:underline">
              Upcoming tours
            </Link>
            <Link href="/how-it-works" className="hover:underline">
              How it works
            </Link>
            <Link href="/register" className="hover:underline">
              Create an account
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <p>Payments are simulated in this demo.</p>
            <p>No card details leave your browser.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
