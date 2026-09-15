import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "../data";
import { cn } from "../utils/cn";
import { Container, Eyebrow } from "./ui";
import { EASE } from "./motion";

export function Testimonials() {
  const [[idx, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = (next: number, d: number) =>
    setState([(next + TESTIMONIALS.length) % TESTIMONIALS.length, d]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(idx + 1, 1), 6000);
    return () => clearInterval(t);
  }, [paused, idx]);

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="noise relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-lime px-5 py-10 sm:px-12 sm:py-20 lg:px-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative grid gap-6 sm:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Eyebrow className="text-ink/60">05 — Kind words</Eyebrow>
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 16 }}
                className="mt-3 sm:mt-6 font-serif text-5xl sm:text-[7rem] leading-none text-ink/90"
              >
                “
              </motion.div>
            </div>

            <div className="lg:col-span-9">
              <div className="relative min-h-[19rem] sm:min-h-[13rem]">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.figure
                    key={t.name}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: dir * -40, filter: "blur(6px)" }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <blockquote className="text-lg xs:text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight text-ink font-medium">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 sm:mt-8 flex items-center gap-3.5">
                      <span className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-ink text-sm font-semibold text-lime shrink-0">
                        {t.initials}
                      </span>
                      <div>
                        <div className="font-semibold text-sm sm:text-base">{t.name}</div>
                        <div className="text-xs sm:text-sm text-ink/70">{t.role}</div>
                      </div>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-8 sm:mt-12 flex items-center justify-between">
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => go(i, i > idx ? 1 : -1)}
                      className="relative h-2 overflow-hidden rounded-full bg-ink/25 transition-all duration-500"
                      style={{ width: i === idx ? 48 : 8 }}
                    >
                      {i === idx && (
                        <motion.span
                          key={`${idx}-${paused}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: paused ? 0 : 1 }}
                          transition={{ duration: paused ? 0 : 6, ease: "linear" }}
                          className="absolute inset-0 origin-left bg-ink"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <NavBtn onClick={() => go(idx - 1, -1)} label="Previous" flip />
                  <NavBtn onClick={() => go(idx + 1, 1)} label="Next" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function NavBtn({ onClick, label, flip }: { onClick: () => void; label: string; flip?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-lime"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-4 w-4", flip && "rotate-180")}
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </motion.button>
  );
}
