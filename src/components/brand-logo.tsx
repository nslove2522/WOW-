import Image from "next/image";

import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
  highlight?: boolean;
};

export function BrandLogo({
  className,
  size = 88,
  priority = false,
  highlight = false,
}: BrandLogoProps) {
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", highlight && "p-1")}>
      {highlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-6%] rounded-full bg-[radial-gradient(circle,rgba(90,110,50,0.18)_0%,rgba(90,110,50,0)_68%)]"
        />
      ) : null}
      <Image
        src="/wow-logo.png"
        alt={`${brand.full} logo`}
        width={size}
        height={size}
        priority={priority}
        className={cn("relative z-10 bg-transparent object-contain", className)}
      />
    </span>
  );
}
