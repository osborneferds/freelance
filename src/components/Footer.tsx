import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { addSubscriber } from "../db/database";
import { toast } from "../lib/toast";
import { NAV_LINKS } from "../data";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { Container } from "./ui";
import { Logo } from "./Logo";
import { EASE, FadeIn } from "./motion";

export function Footer() {
  const year = new Date().getFullYear();
  const settings = useSiteSettings();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const { duplicate } = await addSubscriber(v);
      if (duplicate) toast.info("You're already on the list.");
      else toast.success("Subscribed — welcome aboard!");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <footer className="relative overflow-hidden pb-10 pt-16 sm:pt-24">
      <Container>
        {/* Big statement */}
        <div className="overflow-hidden border-b border-ink/10 pb-8 sm:pb-12">
          <motion.h2
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="text-[13vw] leading-[0.92] tracking-[-0.04em] sm:text-[8rem] lg:text-[10rem]"
          >
            Let's <span className="font-serif italic">talk</span>
            <a
              href={`mailto:${settings.email}`}
              className="ml-2 sm:ml-4 inline-grid h-[0.65em] w-[0.65em] translate-y-[0.05em] place-items-center rounded-full bg-lime text-ink transition-transform duration-500 hover:rotate-45"
              aria-label={`Email ${settings.name}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[45%] w-[45%]">
                <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-10 pt-12 md:flex-row md:items-start md:justify-between">
          <FadeIn>
            <a href="#top" className="flex items-center" aria-label="Osborne Ferds — home">
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Independent product designer &amp; front-end developer. Making the web a little nicer, one project at
              a time.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            <FadeIn delay={0.1}>
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Navigate</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link-underline text-ink/70 hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Social</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {settings.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-ink/70 hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.3} className="col-span-2 sm:col-span-1">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Contact</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href={`mailto:${settings.email}`} className="link-underline text-ink/70 hover:text-ink">
                    {settings.email}
                  </a>
                </li>
                <li className="text-ink/70">Philippines</li>
                <li className="flex items-center gap-2 text-ink/70">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-deep opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-deep" />
                  </span>
                  Available {settings.availability}
                </li>
                <li>
                  <a href="#/portal" className="link-underline text-ink/70 hover:text-ink">
                    Client portal →
                  </a>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>

        <FadeIn className="mt-14 border-t border-ink/10 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl tracking-tight">
                Occasional notes on <span className="font-serif italic">design &amp; freelancing</span>.
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                One thoughtful email a month. Unsubscribe anytime — and I never share addresses.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-full border border-ink/15 bg-white/60 px-5 py-3 text-base sm:text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={busy}
                className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-lime transition-opacity hover:opacity-85 disabled:opacity-50 sm:py-3"
              >
                {busy ? "Joining…" : "Subscribe"}
              </motion.button>
            </form>
          </div>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Osborne Fernandes Studio. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
              Designed &amp; built with care in the Philippines
          </span>
        </div>
      </Container>
    </footer>
  );
}
