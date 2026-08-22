import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata = { title: "How it works" };

const steps = [
  {
    title: "Register",
    body: "Create an account as a woman traveler, 18 or older. That account is your portal — not a mailing list.",
  },
  {
    title: "Pick a tour",
    body: "Open the catalog. Each page lists the host, day-by-day plan, what is included, and how many seats remain.",
  },
  {
    title: "Pay",
    body: "Choose card, UPI, net banking, or wallet. In this demo the charge is simulated and a receipt is written to your portal.",
  },
  {
    title: "Travel with the group",
    body: "A week before departure the host shares the roster. You still travel as yourself — just not as the only one figuring out the first night.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <BrandLogo size={180} highlight className="h-40 w-auto" />
      <p className="mt-4 text-sm uppercase tracking-[0.16em] text-muted-foreground">
        {brand.tagline}
      </p>
      <h1 className="mt-2 font-heading text-4xl">How a trip is organized</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        The site is built for women who want a hosted group without recruiting
        friends first. You meet the others on the trip, not in a chat that goes
        quiet.
      </p>
      <ol className="mt-12 space-y-8">
        {steps.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-sm text-primary-foreground">
              {index + 1}
            </span>
            <div>
              <h2 className="font-heading text-2xl">{step.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button className="mt-12" nativeButton={false} render={<Link href="/tours" />}>
        See upcoming tours
      </Button>
    </div>
  );
}
