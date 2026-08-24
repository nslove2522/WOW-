import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { formatDuration, formatPrice, getTour } from "@/lib/tours";

export default function HomePage() {
  const trip = getTour("seetharkundu-falls-kollengodu");
  const photos = trip?.gallery ?? [];

  return (
    <div>
      <section className="relative isolate min-h-dvh overflow-hidden">
        <Image
          src="/gallery/hero-tea.jpg"
          alt="Tea hills, a valley lake, and misted mountains at first light"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15" />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-end px-4 pb-10 pt-24 text-white sm:pb-16">
          <div className="mb-5 sm:mb-6">
            <BrandLogo
              size={240}
              priority
              highlight
              className="h-28 w-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] sm:h-40 md:h-60"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/80 sm:text-sm">
            {brand.tagline}
          </p>
          <h1 className="mt-3 max-w-2xl font-heading text-3xl leading-tight sm:text-5xl md:text-6xl">
            Travel with women you have not met yet — on purpose.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Wings of Women organizes small hosted trips for women traveling
            without a companion. You get a locked guest list, a local host, and
            a portal for bookings and payment.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="w-full bg-white text-foreground hover:bg-white/90 sm:w-auto"
              nativeButton={false}
              render={<Link href="/tours/seetharkundu-falls-kollengodu" />}
            >
              See this trip
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Create a free account
            </Button>
          </div>
        </div>
      </section>

      {trip ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
          <p className="font-heading text-xl italic text-primary">Our next escape</p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Women only · One day trip · {trip.nextDate}
          </p>
          <h2 className="mt-3 font-heading text-2xl leading-tight sm:text-5xl">
            Seetharkundu Falls, Kollengodu
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-8">
            Waterfalls, viewpoints & many more spots to cover.
          </p>
          <p className="mt-2 max-w-2xl font-heading text-xl text-primary">
            {trip.tagline}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Come solo. Leave with stories, friendships & memories for life.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <Link
                key={photo.src}
                href={`/tours/${trip.slug}`}
                className="relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Link>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {trip.highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-card px-4 py-3 text-sm leading-6 ring-1 ring-foreground/10"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-medium">Limited slots.</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {formatDuration(trip)} · {formatPrice(trip.price)} per traveler. Detailed
            itinerary details will be shared personally.
          </p>
          <p className="mt-3 text-sm leading-6">
            DM{" "}
            <a
              href={brand.instagramUrl}
              className="font-medium underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{brand.instagramHandle}
            </a>{" "}
            or WhatsApp{" "}
            <a
              href={brand.whatsappUrl}
              className="font-medium underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {brand.whatsappNumber}
            </a>
            .
          </p>
          <Button
            className="mt-6 w-full sm:w-auto"
            size="lg"
            nativeButton={false}
            render={<Link href={`/tours/${trip.slug}`} />}
          >
            Trip details
          </Button>
        </section>
      ) : null}
    </div>
  );
}
