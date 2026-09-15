import { cn } from "../utils/cn";

type Tone = "dark" | "light";

const PALETTE: Record<Tone, { o1: string; o2: string; o3: string; f1: string; f2: string; b1: string; b2: string; b3: string }> = {
  dark: {
    o1: "#2E8BFF",
    o2: "#0B4FB0",
    o3: "#0A0F19",
    f1: "#0A0F19",
    f2: "#242C3B",
    b1: "#0A2E78",
    b2: "#1E7BF0",
    b3: "#3B9BFF",
  },
  light: {
    o1: "#5AA8FF",
    o2: "#2E7BE0",
    o3: "#1B4FA8",
    f1: "#FFFFFF",
    f2: "#C7D2E6",
    b1: "#1E6FE0",
    b2: "#4C9BFF",
    b3: "#8CC4FF",
  },
};

/** The OF monogram — ring + aerodynamic F. */
export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: Tone }) {
  const c = PALETTE[tone];
  const uid = tone;
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-auto", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`o-${uid}`} x1="9" y1="100" x2="167" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.o1} />
          <stop offset="40%" stopColor={c.o2} />
          <stop offset="82%" stopColor={c.o3} />
        </linearGradient>
        <linearGradient id={`f-${uid}`} x1="150" y1="38" x2="306" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.f1} />
          <stop offset="100%" stopColor={c.f2} />
        </linearGradient>
        <linearGradient id={`b-${uid}`} x1="132" y1="118" x2="292" y2="118" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.b1} />
          <stop offset="55%" stopColor={c.b2} />
          <stop offset="100%" stopColor={c.b3} />
        </linearGradient>
      </defs>

      {/* O ring */}
      <circle cx="88" cy="100" r="64" stroke={`url(#o-${uid})`} strokeWidth="30" />
      {/* F stem (overlaps the right of the ring) */}
      <path d="M152 38 H188 L176 194 H140 Z" fill={`url(#f-${uid})`} />
      {/* F top arm — tapers to a point on the right */}
      <path d="M152 38 H306 L266 78 H140 Z" fill={`url(#f-${uid})`} />
      {/* F middle arm — blue, tapers to a point on the right */}
      <path d="M146 100 H292 L256 136 H136 Z" fill={`url(#b-${uid})`} />
    </svg>
  );
}

/** Full lockup — monogram + OSBORNEFERDS / FREELANCER wordmark. */
export function Logo({
  className,
  tone = "dark",
  showWordmark = true,
}: {
  className?: string;
  tone?: Tone;
  showWordmark?: boolean;
}) {
  const light = tone === "light";
  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <LogoMark tone={tone} className="h-8 sm:h-9" />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[11px] font-bold tracking-[0.14em] sm:text-[13px]",
              light ? "text-white" : "text-[#0A2E6E]",
            )}
          >
            OSBORNEFERDS
          </span>
          <span className="mt-1.5 flex items-center gap-1.5">
            <span className={cn("h-px w-3 sm:w-4", light ? "bg-white/40" : "bg-[#0B4FB0]/40")} />
            <span
              className={cn(
                "text-[6.5px] font-semibold tracking-[0.42em] sm:text-[7.5px]",
                light ? "text-[#8CC4FF]" : "text-[#1565E0]",
              )}
            >
              FREELANCER
            </span>
            <span className={cn("h-px w-3 sm:w-4", light ? "bg-white/40" : "bg-[#0B4FB0]/40")} />
          </span>
        </span>
      )}
    </span>
  );
}
