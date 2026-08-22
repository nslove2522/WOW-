"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

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

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-[10px] font-semibold tracking-wide text-primary-foreground">
            {brand.short}
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-lg tracking-tight">{brand.short}</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {brand.name}
            </span>
          </span>
        </Link>
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
              <SheetTitle>{brand.full}</SheetTitle>
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
