import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import osborneHero from "../assets/osborne-hero.jpg";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { Arrow, Button, Container } from "./ui";
import { EASE, Magnetic, TextReveal } from "./motion";

const DEFAULT_PORTRAIT = osborneHero;

export function Hero({ ready }: { ready: boolean }) {
  const settings = useSiteSettings();
  const portraitSrc = settings.heroPhoto || DEFAULT_PORTRAIT;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade_up = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-40 lg:pt-44">
      {/* grid + glow background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,15,15,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,15,15,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-lime/50 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-violet-300/30 blur-[100px]"
      />

      <Container>
        <div className="grid items-end gap-14 lg:grid-cols-12">
          <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-8">
            <motion.div
              {...fade_up(0.1)}
              className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/60 py-1.5 pl-1.5 pr-4 text-xs font-medium backdrop-blur"
            >
              <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] uppercase tracking-wider text-lime">
                New
              </span>
              Accepting 2 new projects for Q3 2026
            </motion.div>

            <h1 className="mt-6 sm:mt-8 text-[9.5vw] xs:text-[10vw] sm:text-7xl lg:text-[6rem] uppercase leading-[0.98] sm:leading-[0.95] tracking-[-0.02em]">
              <TextReveal text="Digital products." active={ready} delay={0.25} as="span" />
              <br />
              <TextReveal text="Smart" active={ready} delay={0.4} as="span" />{" "}
              <TextReveal
                text="software."
                active={ready}
                delay={0.55}
                as="span"
                className="font-serif italic text-ink/90"
              />
              <br />
              <TextReveal text="Intelligent" active={ready} delay={0.7} as="span" />{" "}
              <TextReveal
                text="AI."
                active={ready}
                delay={0.85}
                as="span"
                className="font-serif italic text-ink/90"
              />
            </h1>

            <motion.p {...fade_up(0.85)} className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-muted">
              I'm Osborne — an independent{" "}
              <span className="font-semibold text-ink">
                Web, Software &amp; AI Developer based in the Philippines
              </span>
              . I help businesses, startups, and entrepreneurs turn ideas into modern digital products — from
              high-performance websites and custom software to intelligent AI-powered solutions.
            </motion.p>
            <motion.p {...fade_up(1)} className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
              I combine technology, problem-solving, and practical business thinking to build digital solutions
              that are designed to work, scale, and deliver real value.
            </motion.p>

            <motion.div {...fade_up(1.15)} className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Magnetic className="w-full sm:w-auto">
                <Button href="#contact" variant="primary" className="w-full sm:w-auto">
                  Start a project <Arrow />
                </Button>
              </Magnetic>
              <Magnetic strength={0.2} className="w-full sm:w-auto">
                <Button href="#work" variant="ghost" className="w-full sm:w-auto">
                  See selected work
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              {...fade_up(1.3)}
              className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-x-10 text-xs sm:text-sm text-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["bg-amber-300", "bg-sky-300", "bg-rose-300", "bg-emerald-300"].map((c, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, x: -10 }}
                      animate={ready ? { scale: 1, x: 0 } : {}}
                      transition={{ delay: 1.3 + i * 0.08, type: "spring", stiffness: 300, damping: 18 }}
                      className={`h-8 w-8 rounded-full border-2 border-paper ${c}`}
                    />
                  ))}
                </div>
                <span>
                  Trusted by <strong className="font-semibold text-ink">40+ founders</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500">★★★★★</span>
                <span>5.0 on Contra &amp; Dribbble</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative mt-8 lg:mt-0 lg:col-span-4">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.05 }}
              animate={ready ? { clipPath: "inset(0% 0 0 0)", scale: 1 } : {}}
              transition={{ duration: 1.3, delay: 0.5, ease: EASE }}
              className="relative mx-auto aspect-[4/5] w-full max-w-xs sm:max-w-sm overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-ink shadow-2xl"
            >
              <motion.img
                style={{ y: imgY }}
                src={portraitSrc}
                alt="Osborne Fernandes, Full Stack Web, Software & AI Developer"
                className="h-[118%] w-full object-cover object-top"
                loading="eager"
              />

              <motion.div
                {...fade_up(1.3)}
                className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-xs backdrop-blur-md"
              >
                <div>
                  <div className="font-semibold text-ink">Osborne Fernandes</div>
                  <div className="text-muted">Philippines · GMT+8</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-lime">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Rotating badge */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={ready ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 16 }}
              className="absolute -left-6 -top-8 hidden h-28 w-28 sm:block lg:-left-10"
            >
              <div className="relative h-full w-full animate-spin-slow">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-ink text-[9.5px] font-medium uppercase tracking-[0.25em]">
                    <textPath href="#circ">Open for work · Open for work · </textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <span className="h-3 w-3 rounded-full bg-lime-deep" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, x: 20 }}
              animate={ready ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ delay: 1.55, duration: 0.9, ease: EASE }}
              className="absolute -bottom-6 -right-2 hidden sm:block lg:-right-6"
            >
              <div className="animate-float rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-xl">
                <div className="text-[11px] uppercase tracking-wider text-muted">Avg. response</div>
                <div className="text-2xl font-semibold tracking-tight">&lt; 24h</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* scroll hint */}
        <motion.div
          {...fade_up(1.8)}
          className="mt-20 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted lg:flex"
        >
          <span className="relative h-10 w-px overflow-hidden bg-ink/10">
            <motion.span
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-full bg-ink"
            />
          </span>
          Scroll to explore
        </motion.div>
      </Container>
    </section>
  );
}
