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
    <span className="relative inline-flex shrink-0 items-center justify-center p-1">
      {highlight ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[-4%] rounded-full bg-[radial-gradient(circle,rgba(28,48,28,0.55)_0%,rgba(28,48,28,0.12)_55%,rgba(28,48,28,0)_72%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.35)_0%,rgba(201,162,39,0)_70%)] blur-[10px]"
          />
        </>
      ) : null}
      <Image
        src="/wow-logo.png"
        alt={`${brand.full} logo`}
        width={size}
        height={size}
        priority={priority}
        className={cn(
          "relative z-10 bg-transparent object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]",
          className,
        )}
      />
    </span>
  );
}
