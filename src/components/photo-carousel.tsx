"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/gallery/coast.jpg",
    alt: "A group of women on a coastal ledge, arms raised over the sea",
    caption: "First nights become a group.",
  },
  {
    src: "/gallery/lookout.jpg",
    alt: "A woman hiker looking out over a mountain valley",
    caption: "The view after the climb.",
  },
  {
    src: "/gallery/trail.jpg",
    alt: "A woman hiking a high mountain trail at golden hour",
    caption: "On the path, not alone.",
  },
];

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((current) => (next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const slide = slides[index];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl">From the road</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Scroll left and right — one picture at a time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
        onPointerDown={(event) => {
          const startX = event.clientX;
          const onUp = (up: PointerEvent) => {
            const dx = up.clientX - startX;
            if (dx > 50) go(index - 1);
            if (dx < -50) go(index + 1);
            window.removeEventListener("pointerup", onUp);
          };
          window.addEventListener("pointerup", onUp);
        }}
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
            <p className="text-sm font-medium text-white">{slide.caption}</p>
            <p className="mt-0.5 text-xs text-white/75">
              {index + 1} / {slides.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
