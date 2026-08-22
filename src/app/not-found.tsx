import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">404</p>
      <h1 className="mt-2 font-heading text-4xl">That page is not on the map</h1>
      <p className="mt-3 text-muted-foreground">
        The tour or page you opened is not listed. Head back to the catalog.
      </p>
      <Button className="mt-6" nativeButton={false} render={<Link href="/tours" />}>
        Browse tours
      </Button>
    </div>
  );
}
