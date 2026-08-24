"use client";

import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type Props = Omit<ImageProps, "src"> & { src: string };

export function MediaImage({ src, alt, className, ...rest }: Props) {
  if (!src) {
    return <div className={cn("bg-muted", className)} aria-hidden />;
  }
  if (isRemote(src)) {
    const fill = "fill" in rest && rest.fill;
    return (
      // Remote owner uploads (Supabase Storage or pasted URLs) skip the optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill ? "absolute inset-0 size-full object-cover" : "", className)}
      />
    );
  }
  return <Image src={src} alt={alt} className={className} {...rest} />;
}
