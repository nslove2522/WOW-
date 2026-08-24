import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Shield, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { brand } from "@/lib/brand";
import { formatDuration, formatPrice, getTour, tours } from "@/lib/tours";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTour(slug);
  return { title: tour?.title ?? "Tour" };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  return (
    <article>
      <div className="relative h-[46vh] min-h-72 w-full">
        <Image
          src={tour.image}
          alt={tour.imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-8 text-white">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{tour.region}</Badge>
            <Badge>{tour.difficulty}</Badge>
            <Badge variant="outline" className="border-white/40 text-white">
              {tour.days === 1 ? "Limited slots" : `${tour.seatsLeft} seats left`}
            </Badge>
          </div>
          <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-5xl">{tour.title}</h1>
          <p className="mt-2 flex items-start gap-2 text-sm text-white/85 sm:items-center sm:text-base">
            <MapPin className="size-4" />
            {tour.location}
          </p>
        </div>
      </div>

      {tour.gallery && tour.gallery.length > 0 ? (
        <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 pt-8 sm:grid-cols-2">
          {tour.gallery.map((photo) => (
            <div key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 pb-28 sm:py-12 lg:grid-cols-[1fr_320px] lg:pb-12">
        <div className="space-y-10">
          <p className="text-lg leading-8 text-muted-foreground">{tour.description}</p>
          <section>
            <h2 className="font-heading text-2xl">Highlights</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {tour.highlights.map((item) => (
                <li key={item} className="rounded-lg bg-card p-3 text-sm leading-6 ring-1 ring-foreground/10">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-2xl">Day by day</h2>
            <ol className="mt-4 space-y-4">
              {tour.itinerary.map((stop) => (
                <li key={stop.day} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="mt-0.5 grid size-8 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                    {stop.day}
                  </span>
                  <div>
                    <p className="font-medium">{stop.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{stop.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl">Included</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {tour.inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl">Not included</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {tour.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Host</p>
            <h2 className="mt-1 font-heading text-2xl">{tour.host.name}</h2>
            <p className="text-sm text-muted-foreground">{tour.host.years} years on this work</p>
            <p className="mt-3 text-sm leading-6">{tour.host.bio}</p>
          </section>
          <p className="text-sm leading-6 text-muted-foreground">
            DM{" "}
            <a
              href={brand.instagramUrl}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{brand.instagramHandle}
            </a>{" "}
            or WhatsApp{" "}
            <a
              href={brand.whatsappUrl}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {brand.whatsappNumber}
            </a>
            . Detailed itinerary details will be shared personally.
          </p>
        </div>

        <aside className="h-fit rounded-xl bg-card p-5 ring-1 ring-foreground/10 lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">From</p>
          <p className="font-heading text-3xl">{formatPrice(tour.price)}</p>
          <p className="text-sm text-muted-foreground">
            per traveler{tour.nights > 0 ? ", shared room" : ""}
          </p>
          <Separator className="my-4" />
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <Calendar className="mt-0.5 size-4 text-primary" />
              {tour.nextDate}
            </li>
            <li className="flex gap-2">
              <Users className="mt-0.5 size-4 text-primary" />
              {formatDuration(tour)} · max {tour.groupSize}
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 size-4 text-primary" />
              Women only. Strangers today, sisters forever.
            </li>
          </ul>
          <Button
            className="mt-6 hidden w-full lg:inline-flex"
            size="lg"
            nativeButton={false}
            render={<Link href={`/tours/${tour.slug}/pay`} />}
          >
            Reserve and pay
          </Button>
          <p className="mt-3 hidden text-xs leading-5 text-muted-foreground lg:block">
            You will sign in or register first. Card and UPI go through Razorpay.
          </p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{formatPrice(tour.price)} per traveler</p>
            <p className="truncate text-xs text-muted-foreground">{tour.nextDate}</p>
          </div>
          <Button
            size="lg"
            className="shrink-0"
            nativeButton={false}
            render={<Link href={`/tours/${tour.slug}/pay`} />}
          >
            Reserve and pay
          </Button>
        </div>
      </div>
    </article>
  );
}
