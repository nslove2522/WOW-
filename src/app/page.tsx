import Image from "next/image";
import Link from "next/link";
import { Compass, Lock, Users } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { TourCard } from "@/components/tour-card";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { tours } from "@/lib/tours";

export default function HomePage() {
  const featured = tours.slice(0, 3);

  return (
    <div>
      <section className="relative isolate min-h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=80"
          alt="Women walking along a sunlit canal"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end px-4 py-16 text-white">
          <div className="mb-6">
            <BrandLogo
              size={240}
              priority
              highlight
              className="size-40 sm:size-52 md:size-60"
            />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            {brand.tagline}
          </p>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl leading-tight sm:text-6xl">
            Travel with women you have not met yet — on purpose.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Wings of Women organizes small hosted trips for women traveling
            without a companion. You get a locked guest list, a local host, and
            a portal for bookings and payment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
              nativeButton={false}
              render={<Link href="/tours" />}
            >
              Browse tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Create a free account
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3">
        {[
          {
            icon: Users,
            title: "Strangers, then a group",
            body: "You book as yourself. The roster is women only, capped small, and shared a week before departure.",
          },
          {
            icon: Compass,
            title: "A host on the ground",
            body: "Every tour has a named host who lives the route. They handle the first night, the hard logistics, and the quiet ones.",
          },
          {
            icon: Lock,
            title: "Pay in the portal",
            body: "Card, UPI, net banking, or wallet — simulated here so you can walk the full booking path without a live gateway.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6">
            <item.icon className="size-5 text-primary" />
            <h2 className="mt-4 font-heading text-xl">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl">Departures this season</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Six hosted routes. Seats are real in this demo — they do not refill after you pay.
            </p>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/tours" />}>
            All tours
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </section>
    </div>
  );
}
