import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <BrandLogo size={112} highlight className="h-24 w-auto" />
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {brand.tagline}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Small-group trips for women traveling without a companion. Hosted routes,
            locked guest lists, and a portal for your bookings. {brand.motto}.
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-foreground">Explore</p>
            <Link href="/tours" className="text-muted-foreground hover:underline">
              Upcoming tours
            </Link>
            <Link href="/how-it-works" className="text-muted-foreground hover:underline">
              How it works
            </Link>
            <Link href="/register" className="text-muted-foreground hover:underline">
              Create an account
            </Link>
          </div>
          <div className="flex min-w-44 flex-col gap-2">
            <p className="font-medium text-foreground">Contact</p>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-foreground hover:underline"
              aria-label="wings._ofwomen on Instagram"
            >
              <img
                src="/instagram.svg"
                alt=""
                width={22}
                height={22}
                className="size-[22px] shrink-0"
              />
              wings._ofwomen
            </a>
            <p className="text-muted-foreground">More contact details will live here.</p>
          </div>
          <div className="flex max-w-48 flex-col gap-2 text-muted-foreground">
            <p>Payments are simulated in this demo.</p>
            <p>No card details leave your browser.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
