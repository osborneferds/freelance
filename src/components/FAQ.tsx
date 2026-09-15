import { useState } from "react";
import { FAQS } from "../data";
import { cn } from "../utils/cn";
import { Container, SectionHeading } from "./ui";
import { FadeIn } from "./motion";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="06 — FAQ"
              title={
                <>
                  Questions, <span className="font-serif italic">answered.</span>
                </>
              }
              desc="Something else on your mind? Drop me a line — I reply to every message personally."
            />
          </div>
          <FadeIn delay={0.2} className="lg:col-span-7">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 sm:gap-6 py-4 sm:py-6 text-left min-h-[48px]"
                    >
                      <span className="text-base sm:text-xl font-medium tracking-tight">{f.q}</span>
                      <span
                        className={cn(
                          "relative grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-300",
                          isOpen && "rotate-45 border-ink bg-ink text-white",
                        )}
                      >
                        <span className="absolute h-px w-3 sm:w-3.5 bg-current" />
                        <span className="absolute h-3 sm:h-3.5 w-px bg-current" />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-xl pb-5 sm:pb-6 text-sm sm:text-base leading-relaxed text-muted">{f.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
