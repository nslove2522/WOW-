import Link from "next/link";
import { MapPin, Users } from "lucide-react";

import { MediaImage } from "@/components/media-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, type Tour } from "@/lib/tours";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden py-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[16/10] overflow-hidden">
          <MediaImage
            src={tour.image}
            alt={tour.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="secondary">{tour.region}</Badge>
            <Badge>{tour.seatsLeft} seats left</Badge>
          </div>
        </div>
        <CardContent className="space-y-3 px-4 pb-5 pt-4">
          <div>
            <h3 className="font-heading text-xl leading-tight">{tour.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {tour.location}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{tour.tagline}</p>
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" />
              {tour.days === 1 ? "1 day" : `${tour.days} days`} · {tour.difficulty}
            </span>
            <span className="font-medium">{formatPrice(tour.price)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
