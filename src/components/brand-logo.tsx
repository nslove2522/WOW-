import Image from "next/image";

import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandLogo({ className, size = 56, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/wow-logo.png"
      alt={`${brand.full} logo`}
      width={size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
