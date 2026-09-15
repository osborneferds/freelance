import { AnimatePresence, motion } from "motion/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { addLead } from "../db/database";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { toast } from "../lib/toast";
import { cn } from "../utils/cn";
import { Arrow, Button, Container, Eyebrow } from "./ui";
import { EASE, FadeIn, Magnetic } from "./motion";

const BUDGETS = ["< $5k", "$5k – $10k", "$10k – $25k", "$25k+"];
const TYPES = [
  "Website Design & Development",
  "Web App Development",
  "Desktop App Development",
  "IT Support & Services",
  "Product Design",
  "Brand Identity",
];

export function Contact() {
  const settings = useSiteSettings();
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [types, setTypes] = useState<string[]>(["Website Design & Development"]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const set =
    (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleType = (t: string) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (types.length === 0) {
      toast.error("Please pick at least one thing you need help with.");
      return;
    }
    setSending(true);
    try {
      await addLead({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        types: types.join(", "),
        budget,
        message: form.message.trim(),
        source: "contact-form",
      });
      setSent(true);
      toast.success("Message sent — I'll reply within one business day.");
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 sm:px-5 py-3 sm:py-4 text-base text-white placeholder:text-white/30 outline-none transition-all focus:border-lime focus:bg-white/10";

  return (
    <section id="contact" className="scroll-mt-20 pb-8 pt-8 sm:pt-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-ink px-5 py-10 sm:px-12 sm:py-20 lg:px-20 text-white"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lime/25 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-500/25 blur-[120px]" />

          <div className="relative grid gap-10 sm:gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FadeIn>
              <Eyebrow className="text-white/60">07 — Contact</Eyebrow>
              <h2 className="mt-3 sm:mt-4 text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight">
                Let's build something <span className="font-serif italic text-lime">great</span>.
              </h2>
              <p className="mt-4 sm:mt-6 max-w-md text-sm sm:text-lg leading-relaxed text-white/60">
                Tell me a little about your project and I'll get back to you within one business day with next
                steps.
              </p>
              </FadeIn>

              <div className="mt-10 space-y-4 text-sm">
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center gap-3 text-white/80 transition-colors hover:text-lime"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </span>
                  {settings.email}
                </a>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  Philippines · working worldwide
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                {settings.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 transition-all hover:border-lime hover:text-lime"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 14 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-lime text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                  <h3 className="mt-6 text-3xl tracking-tight">Message sent!</h3>
                  <p className="mt-3 max-w-sm text-white/60">
                    Thanks for reaching out. I'll reply within one business day — keep an eye on your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", company: "", message: "" });
                      setTypes(["Website Design & Development"]);
                      setBudget(BUDGETS[1]);
                    }}
                    className="link-underline mt-8 text-sm text-lime"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={onSubmit}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className={inputCls}
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="Email address"
                      className={inputCls}
                    />
                  </div>
                  <input
                    value={form.company}
                    onChange={set("company")}
                    placeholder="Company or website (optional)"
                    className={inputCls}
                  />

                  <div>
                    <div className="mb-2.5 text-xs uppercase tracking-[0.18em] text-white/50">I need help with</div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {TYPES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => toggleType(t)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all text-left",
                            types.includes(t)
                              ? "border-lime bg-lime text-ink"
                              : "border-white/15 text-white/70 hover:border-white/40",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2.5 text-xs uppercase tracking-[0.18em] text-white/50">Budget</div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={cn(
                            "rounded-full border px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all text-center",
                            budget === b
                              ? "border-white bg-white text-ink"
                              : "border-white/15 text-white/70 hover:border-white/40",
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell me about the project — goals, timeline, anything useful."
                    className={cn(inputCls, "resize-none text-base")}
                  />

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/40">
                      By sending, you agree to be contacted about your enquiry. No spam, ever.
                    </p>
                    <Magnetic className="w-full sm:w-auto">
                      <Button type="submit" variant="lime" className={cn("w-full sm:w-auto", sending && "pointer-events-none opacity-70")}>
                        {sending ? "Sending…" : "Send message"} <Arrow />
                      </Button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
