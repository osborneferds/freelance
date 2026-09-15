import { motion } from "motion/react";
import { SERVICES } from "../data";
import { Arrow, Container, SectionHeading } from "./ui";
import { EASE, FadeIn } from "./motion";

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="01 — Services"
            title={
              <>
                One vision. One developer.{" "}
                <span className="font-serif italic">Built from idea to launch.</span>
              </>
            }
            desc="From websites and custom software to AI-powered solutions, I handle the entire development process — turning your ideas into reliable digital products that are ready for the real world."
          />
          <FadeIn delay={0.2}>
            <a href="#contact" className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
              <span className="link-underline">Not sure what you need? Let's talk</span> <Arrow />
            </a>
          </FadeIn>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-2"
        >
          {SERVICES.map((s) => (
            <motion.article
              key={s.n}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              whileHover="hover"
              className="group relative overflow-hidden bg-paper p-6 sm:p-10"
            >
              {/* sweep-in dark background */}
              <motion.div
                variants={{ hover: { y: "0%" } }}
                initial={{ y: "100%" }}
                transition={{ duration: 0.55, ease: EASE }}
                className="absolute inset-0 bg-ink"
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-2xl italic text-muted transition-colors duration-500 group-hover:text-lime">
                    {s.n}
                  </span>
                  <motion.span
                    variants={{ hover: { rotate: 45, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                      <path d="M7 17L17 7M8 7h9v9" />
                    </svg>
                  </motion.span>
                </div>
                <h3 className="mt-10 text-2xl font-medium tracking-tight transition-colors duration-500 group-hover:text-white sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/60">
                  {s.desc}
                </p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {s.tags.map((t, i) => (
                    <motion.li
                      key={t}
                      variants={{ hover: { y: -2, transition: { delay: i * 0.05 } } }}
                      className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/70 transition-colors duration-500 group-hover:border-white/15 group-hover:text-white/70"
                    >
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
