"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const pathname = usePathname();
  const authSurface = pathname === "/register" || pathname === "/sign-in";

  return (
    <footer
      className={cn(
        "relative z-10 mt-auto border-t",
        authSurface
          ? "border-white/25 bg-white/25 text-teal-950 backdrop-blur-md"
          : "border-border/80 bg-card",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 py-10",
          authSurface
            ? "flex flex-col items-center text-center"
            : "flex flex-col gap-10 md:flex-row md:items-start md:justify-between",
        )}
      >
        <div className={cn(authSurface ? "flex max-w-xl flex-col items-center" : "max-w-sm")}>
          <BrandLogo size={112} highlight className={authSurface ? "h-28 w-auto" : "h-24 w-auto"} />
          <p
            className={cn(
              "mt-3 text-sm font-medium uppercase tracking-[0.14em]",
              authSurface ? "text-teal-900/80" : "text-muted-foreground",
            )}
          >
            {brand.tagline}
          </p>
          <p
            className={cn(
              "mt-2 text-sm leading-6",
              authSurface ? "max-w-md text-teal-950/80" : "text-muted-foreground",
            )}
          >
            Small-group trips for women traveling without a companion. Hosted routes,
            locked guest lists, and a portal for your bookings. {brand.motto}.
          </p>
        </div>
        <div
          className={cn(
            "flex flex-wrap gap-12 text-sm",
            authSurface ? "mt-10 justify-center" : "",
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="font-medium text-foreground">Explore</p>
            <Link href="/tours" className="text-muted-foreground hover:underline">
              Seetharkundu Falls
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
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-foreground hover:underline"
              aria-label="WhatsApp 9489029797"
            >
              <img
                src="/whatsapp.svg"
                alt=""
                width={22}
                height={22}
                className="size-[22px] shrink-0"
              />
              9489029797
            </a>
          </div>
          <div className="flex max-w-48 flex-col gap-2 text-muted-foreground">
            <p>Card and UPI payments go through Razorpay.</p>
            <p>Bookings are saved after Razorpay confirms the payment.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
