import Image from "next/image";

/** 60% of a 50px full-page blur so the lake stays readable behind the form. */
const AUTH_BACKGROUND_BLUR = `${50 * 0.6}px`;

export function AuthBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        src="/gallery/auth-lake.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{
          transform: "scale(1.45)",
          filter: `blur(${AUTH_BACKGROUND_BLUR})`,
        }}
      />
      <div className="absolute inset-0 bg-sky-100/15" />
    </div>
  );
}
