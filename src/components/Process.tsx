import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { PROCESS } from "../data";
import { Container, SectionHeading } from "./ui";
import { EASE } from "./motion";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="process" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow="04 — Process"
          align="center"
          title={
            <>
              A clear, <span className="font-semibold">straightforward</span> way to bring your idea to life.
            </>
          }
          desc="From the initial concept to development and final deployment, you stay informed at every stage. Clear communication, defined milestones, regular updates, and no unnecessary complexity."
        />

        <div ref={ref} className="relative mt-16">
          {/* track + animated progress line (desktop) */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/10 lg:block" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-ink lg:block"
          />
          {/* vertical line (mobile) */}
          <div className="absolute bottom-0 left-5 sm:left-6 top-0 w-px bg-ink/10 lg:hidden" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-5 sm:left-6 top-0 w-px origin-top bg-ink lg:hidden"
          />

          <ol className="grid gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-8">
            {PROCESS.map((p, i) => (
              <motion.li
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                className="relative pl-14 sm:pl-20 lg:pl-0"
              >
                <div className="flex items-center gap-3 lg:block">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
                    className="absolute left-0 top-0 z-10 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-ink bg-paper font-serif text-base sm:text-lg italic lg:relative"
                  >
                    {p.step}
                  </motion.span>
                  <span className="rounded-full bg-lime px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium lg:absolute lg:right-0 lg:top-2.5">
                    {p.duration}
                  </span>
                </div>
                <h3 className="mt-3 sm:mt-6 text-xl sm:text-2xl font-medium tracking-tight">{p.title}</h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-muted">{p.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
