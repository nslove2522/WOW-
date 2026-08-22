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
    <span className={cn("relative inline-flex shrink-0", highlight && "p-2")}>
      {highlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.45)_0%,rgba(201,162,39,0)_70%)] blur-md"
        />
      ) : null}
      <Image
        src="/wow-logo.png"
        alt={`${brand.full} logo`}
        width={size}
        height={size}
        priority={priority}
        className={cn(
          "relative z-10 h-auto w-auto bg-transparent object-contain",
          highlight && "drop-shadow-[0_8px_24px_rgba(201,162,39,0.45)]",
          className,
        )}
      />
    </span>
  );
}
