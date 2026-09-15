import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { cn } from "../utils/cn";
import { Logo } from "./Logo";

export function Navbar({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-7xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500",
            scrolled
              ? "border-ink/10 bg-paper/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="flex shrink-0 items-center" aria-label="Osborne Ferds — home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "link-underline text-sm transition-colors hover:text-ink",
                    l.href === "#/admin" ? "font-medium text-ink" : "text-ink/70",
                  )}
                >
                  {l.label}
                  {l.href === "#/admin" && (
                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-lime-deep align-middle" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-deep opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-deep" />
              </span>
              Available {settings.availability}
            </span>
            <a
              href="#contact"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink/85"
            >
              Start a project
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white/40 active:bg-ink/10 transition-colors lg:hidden"
          >
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-ink transition-all duration-300",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span className={cn("absolute h-[1.5px] w-5 bg-ink transition-all duration-300", open && "opacity-0")} />
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-ink transition-all duration-300",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-paper/98 backdrop-blur-2xl transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6 overflow-y-auto px-6 pb-8 pt-24 safe-bottom sm:px-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-deep opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-deep" />
              </span>
              <span>Available {settings.availability} · Worldwide</span>
            </div>

            <ul className="space-y-2">
              {NAV_LINKS.map((l, i) => (
                <li
                  key={l.href}
                  style={{ transitionDelay: `${i * 40 + 80}ms` }}
                  className={cn(
                    "transition-all duration-500",
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-1.5 font-serif text-3xl sm:text-4xl tracking-tight text-ink hover:text-lime-deep transition-colors"
                  >
                    <span>{l.label}</span>
                    <span className="text-sm font-sans text-muted opacity-40">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-6 border-t border-ink/10 shrink-0">
            <div className="flex items-center justify-between text-xs text-muted mb-2">
              <a
                href="#/portal"
                onClick={() => setOpen(false)}
                className="hover:text-ink transition-colors font-medium"
              >
                Client portal →
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-ink transition-colors"
              >
                {settings.email}
              </a>
            </div>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-ink px-6 py-3.5 text-center text-sm font-medium text-white shadow-lg shadow-ink/20 active:scale-[0.99] transition-transform"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
