import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <BrandLogo size={140} highlight className="mb-4 h-32 w-auto" />
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">404</p>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">That page is not on the map</h1>
      <p className="mt-3 text-muted-foreground">
        The tour or page you opened is not listed. Head back to the catalog.
      </p>
      <Button className="mt-6 w-full sm:w-auto" nativeButton={false} render={<Link href="/tours" />}>
        Browse tours
      </Button>
    </div>
  );
}
