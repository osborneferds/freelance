import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { PROJECTS } from "../data";
import { listProjects, trackView } from "../db/database";
import type { Project } from "../db/schema";
import { useDbData } from "../hooks/useDbData";
import { cn } from "../utils/cn";
import { ArrowUpRight, Container, SectionHeading } from "./ui";
import { EASE, FadeIn } from "./motion";

const FILTERS = ["All", "Web", "Product", "Brand"] as const;
type Filter = (typeof FILTERS)[number];

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const dbProjects = useDbData(listProjects);
  const all = (dbProjects ?? PROJECTS).filter((p) => p.visible !== 0).sort((a, b) => a.sort - b.sort);
  const visible = all.filter((p) => filter === "All" || p.category === filter);

  return (
    <section id="work" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="02 — Selected work"
            title={
              <>
                Recent projects I'm <span className="font-serif italic">proud</span> of.
              </>
            }
          />
          <FadeIn delay={0.15} className="scroll-x flex gap-2 pb-1 sm:flex-wrap">
            <LayoutGroup id="work-filter">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 min-h-[38px]",
                    filter === f ? "text-white" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  )}
                  {filter !== f && <span className="absolute inset-0 rounded-full border border-ink/15" />}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </LayoutGroup>
          </FadeIn>
        </div>

        <motion.div layout className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                className={cn(p.size === "large" && "md:col-span-2")}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <FadeIn className="mt-14 flex justify-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-ink/15 py-3 pl-6 pr-3 text-sm font-medium transition-colors hover:border-ink"
          >
            Want to see the full archive?
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight />
            </span>
          </a>
        </FadeIn>
      </Container>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const hasLink = Boolean(project.link && project.link.trim());
  return (
    <a
      ref={ref}
      href={hasLink ? project.link : "#contact"}
      target={hasLink ? "_blank" : undefined}
      rel={hasLink ? "noopener noreferrer" : undefined}
      className="group block"
      data-cursor
      onClick={() => trackView(`project:${project.id}`, project.title)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] bg-ink",
          project.size === "large" ? "aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]",
        )}
      >
        <motion.img
          style={{ y }}
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-[116%] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06]"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent", project.tone)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/0 transition-opacity duration-500 group-hover:opacity-90" />

        <div className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5 flex gap-1.5 sm:gap-2">
          {[project.category, project.year].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/20 px-2.5 py-0.5 text-[11px] sm:px-3 sm:py-1 sm:text-xs font-medium text-white backdrop-blur-md"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-lime text-ink transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 shadow-md">
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:gap-4 sm:p-7">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/70">{project.client}</div>
            <h3 className="mt-0.5 sm:mt-1 truncate text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight text-white">{project.title}</h3>
            <div className="mt-2 sm:mt-3 h-px w-10 sm:w-12 bg-lime transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] lg:w-0 lg:group-hover:w-24" />
          </div>
          {hasLink && (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-[11px] font-semibold text-ink transition-all duration-500 sm:flex lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              View project
              <ArrowUpRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
