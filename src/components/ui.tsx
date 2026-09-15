import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { FadeIn } from "./motion";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <FadeIn y={12}>
        <Eyebrow className={cn(dark && "text-white/60")}>{eyebrow}</Eyebrow>
      </FadeIn>
      <FadeIn delay={0.08}>
        <h2
          className={cn(
            "mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-medium leading-[1.1] sm:leading-[1.05] tracking-tight",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </FadeIn>
      {desc && (
        <FadeIn delay={0.18}>
          <p className={cn("mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed", dark ? "text-white/60" : "text-muted")}>
            {desc}
          </p>
        </FadeIn>
      )}
    </div>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "lime";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const base =
    "group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-deep active:scale-[0.98]";
  const variants = {
    primary: "bg-ink text-white hover:bg-ink/85 hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]",
    ghost: "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white",
    lime: "bg-lime text-ink hover:bg-lime-deep hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(217,255,61,0.8)]",
  };
  const cls = cn(base, variants[variant], className);
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", className)}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
