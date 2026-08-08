/**
 * The graphic kit, lifted off the truck wrap.
 * Calavera, sunburst, agave, zigzag trim, rail banner.
 */

export function Calavera({
  className = "",
  fill = "#DA3B22",
  line = "#A3CE3C",
}: {
  className?: string;
  fill?: string;
  line?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <path
        d="M100 8c-44 0-72 30-72 68 0 22 9 36 20 46 6 6 8 14 9 24 1 12 8 20 19 22 8 2 16 3 24 3s16-1 24-3c11-2 18-10 19-22 1-10 3-18 9-24 11-10 20-24 20-46 0-38-28-68-72-68z"
        fill={fill}
      />
      <g fill="none" stroke={line} strokeWidth="5" strokeLinecap="round">
        <circle cx="70" cy="80" r="17" />
        <circle cx="130" cy="80" r="17" />
        <path d="M70 55v-9M58 60l-6-7M82 60l6-7M130 55v-9M118 60l-6-7M142 60l6-7" />
        <path d="M100 96l-9 14h18z" />
        <path d="M74 132h52M84 124v16M100 124v16M116 124v16" />
        <path d="M40 44c10-8 18-2 16 8-2 8-12 8-14 1" />
        <path d="M160 44c-10-8-18-2-16 8 2 8 12 8 14 1" />
      </g>
    </svg>
  );
}

export function Sunburst({
  className = "",
  color = "#A3CE3C",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>
        <path d="M600 400 L470 0 L520 0 Z" />
        <path d="M600 400 L560 0 L610 0 Z" />
        <path d="M600 400 L650 0 L700 0 Z" />
        <path d="M600 400 L740 0 L800 0 Z" />
        <path d="M600 400 L830 20 L900 60 Z" />
        <path d="M600 400 L370 20 L300 60 Z" />
        <path d="M600 400 L950 130 L1030 190 Z" />
        <path d="M600 400 L250 130 L170 190 Z" />
        <path d="M600 400 L1060 260 L1140 330 Z" />
        <path d="M600 400 L140 260 L60 330 Z" />
      </g>
    </svg>
  );
}

export function Agave({ className = "", color = "#DA3B22" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <g fill={color}>
        <path d="M50 92C48 70 44 52 34 34c8 6 13 14 16 24 1-14 0-28-4-44 8 12 12 26 13 42 4-15 11-28 21-38-7 15-11 30-12 46 6-9 14-16 24-20-13 9-21 21-25 36z" />
      </g>
    </svg>
  );
}

export function Zig({ flip = false }: { flip?: boolean }) {
  return <div className={flip ? "zigzag-flip" : "zigzag"} role="presentation" />;
}

export function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ink px-4 py-2.5 text-center font-display text-[11px] uppercase tracking-[0.22em] text-white sm:text-[13px]">
      {children}
    </div>
  );
}

/** Tiled skulls, very low contrast, for large flat areas. */
export function SkullField({ className = "" }: { className?: string }) {
  return (
    <div className={`skull-drift pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Calavera className="absolute -left-8 top-6 w-28 opacity-[0.16] sm:w-40" fill="#141414" line="#ffffff" />
      <Calavera className="absolute right-4 top-32 w-20 opacity-[0.12] sm:w-28" fill="#141414" line="#ffffff" />
      <Calavera className="absolute -right-10 bottom-4 w-36 opacity-[0.14] sm:w-48" fill="#141414" line="#ffffff" />
      <Calavera className="absolute left-1/3 -bottom-10 w-24 opacity-[0.10] sm:w-32" fill="#141414" line="#ffffff" />
    </div>
  );
}
