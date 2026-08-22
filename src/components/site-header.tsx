"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tours", label: "Tours" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/portal", label: "Portal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, ready, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            "rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            pathname === link.href && "text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const actions = ready ? (
    user ? (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/portal" />}>
          {user.name.split(" ")[0]}
        </Button>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/sign-in" />}>
          Sign in
        </Button>
        <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
          Register
        </Button>
      </div>
    )
  ) : (
    <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
  );

  const hideHeaderEmblem = pathname === "/register";
  const authSurface = pathname === "/register" || pathname === "/sign-in";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 overflow-visible border-b backdrop-blur",
        authSurface
          ? "border-white/20 bg-white/20 text-teal-950"
          : "border-border/80 bg-background/90",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
        {hideHeaderEmblem ? (
          <span className="w-10" aria-hidden />
        ) : (
          <Link href="/" className="relative z-10 flex items-center bg-transparent" aria-label={brand.full}>
            <BrandLogo size={140} priority highlight className="h-[4.5rem] w-auto" />
            <span className="sr-only">{brand.full}</span>
          </Link>
        )}
        <div className="hidden items-center gap-8 md:flex">
          {nav}
          {actions}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu" />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BrandLogo size={112} highlight className="h-14 w-auto" />
                <span className="sr-only">{brand.full}</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4">
              {nav}
              {actions}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
