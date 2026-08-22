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
  highlight = true,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-transparent",
        highlight && "p-0.5",
      )}
    >
      {highlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.28)_0%,rgba(201,162,39,0)_68%)] blur-md"
        />
      ) : null}
      <Image
        src="/wow-logo.png"
        alt={`${brand.full} logo`}
        width={size}
        height={size}
        priority={priority}
        unoptimized
        className={cn(
          "relative z-10 h-auto w-auto max-w-none bg-transparent object-contain",
          className,
        )}
      />
    </span>
  );
}
