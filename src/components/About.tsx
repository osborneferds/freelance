import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SKILLS, STATS } from "../data";
import { Arrow, Button, Container, Eyebrow } from "./ui";
import osborneAbout from "../assets/osborne-about.jpg";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { Counter, EASE, FadeIn, Magnetic, TextRevealInView } from "./motion";

const DEFAULT_PHOTO = osborneAbout;

export function About() {
  const settings = useSiteSettings();
  const photoSrc = settings.aboutPhoto || DEFAULT_PHOTO;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} id="about" className="relative scroll-mt-20 overflow-hidden bg-ink py-16 text-white sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-lime/20 blur-[140px]" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 max-w-sm mx-auto w-full lg:max-w-none">
            <div className="relative pr-2 pb-2 sm:pr-0 sm:pb-0">
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, ease: EASE }}
                className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
              >
                <motion.img
                  style={{ y: imgY }}
                  src={photoSrc}
                  alt="Osborne at work"
                  loading="lazy"
                  className="h-[120%] w-full object-cover"
                />
              </motion.div>
              <motion.div
                style={{ y: badgeY }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
                className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 rounded-xl sm:rounded-2xl bg-lime p-3.5 sm:p-5 text-ink shadow-2xl"
              >
                <div className="font-serif text-3xl sm:text-4xl italic leading-none">30+</div>
                <div className="mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-wider">years experience</div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <FadeIn>
              <Eyebrow className="text-white/60">03 — About me</Eyebrow>
            </FadeIn>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] sm:leading-[1.08] tracking-tight">
              <TextRevealInView text="I build digital solutions where" stagger={0.03} />{" "}
              <TextRevealInView
                text="technology meets real business needs."
                className="font-semibold text-white"
                delay={0.3}
                stagger={0.04}
              />
            </h2>
            <FadeIn delay={0.2} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 text-base sm:text-lg leading-relaxed text-white/65">
              <p>
                With decades of hands-on experience across IT, networking, infrastructure, software, web
                development, and emerging AI technologies, I bring a practical, problem-solving approach to every
                project.
              </p>
              <p>
                Today, I work independently with businesses, entrepreneurs, and organizations to build{" "}
                <span className="text-white font-medium">modern websites, custom software, and AI-powered solutions</span>.
                From the first idea to development, testing, and deployment, I focus on creating technology that
                is reliable, useful, and built to solve real problems.
              </p>
            </FadeIn>
            <FadeIn delay={0.3} className="mt-6 sm:mt-7 border-l-2 border-lime pl-4 sm:pl-5 text-base sm:text-xl leading-snug text-white">
              I don't just build what looks good.{" "}
              <span className="font-semibold text-lime">I build what works.</span>
            </FadeIn>

            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2.5 sm:gap-6 border-t border-white/10 pt-8 sm:pt-10">
              {STATS.map((s, i) => (
                <FadeIn key={s.label} delay={i * 0.1}>
                  <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-sm text-white/50 leading-tight">{s.label}</div>
                </FadeIn>
              ))}
            </div>

            <div className="mt-8 sm:mt-10">
              <FadeIn className="text-xs uppercase tracking-[0.18em] text-white/50">
                Technologies I Work With
              </FadeIn>
              <ul className="mt-3.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {SKILLS.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
                    whileHover={{ y: -3 }}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs sm:px-3.5 sm:py-1.5 sm:text-sm text-white/80 transition-colors hover:border-lime hover:text-lime"
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>

            <FadeIn delay={0.2} className="mt-8 sm:mt-10">
              <Magnetic className="w-full sm:w-auto">
                <Button href="#contact" variant="lime" className="w-full sm:w-auto">
                  Work with me <Arrow />
                </Button>
              </Magnetic>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
