"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { BrandLogo } from "@/components/brand-logo";
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
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/portal", label: "Portal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, ready, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const overPhoto = pathname === "/";

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            "rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground touch-manipulation",
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
        <Button variant="outline" size="sm" onClick={() => void signOut()}>
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

  if (pathname === "/register" || pathname === "/sign-in") {
    return null;
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex justify-end px-4 pt-4">
        <div className="pointer-events-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className={
                    overPhoto
                      ? "size-11 border-white/55 bg-white/15 text-white shadow-sm backdrop-blur-sm hover:bg-white/25 hover:text-white"
                      : "size-11 border-border bg-background/85 shadow-sm backdrop-blur-sm"
                  }
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="pr-10">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <BrandLogo size={56} highlight className="h-12 w-auto" />
                  <span className="text-sm font-medium leading-snug">{brand.full}</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 px-4">
                {nav}
                {actions}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
