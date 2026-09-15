import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { deleteLead, downloadCsv, listLeads, setLeadNotes, setLeadStatus, toCsv } from "../../db/database";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "../../db/schema";
import { useDbData } from "../../hooks/useDbData";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-lime text-ink",
  contacted: "bg-sky-300 text-ink",
  won: "bg-emerald-300 text-ink",
  lost: "bg-white/10 text-white/60",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function Leads() {
  const leads = useDbData(listLeads) ?? [];
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, new: 0, contacted: 0, won: 0, lost: 0 };
    leads.forEach((l) => c[l.status]++);
    return c;
  }, [leads]);

  const filtered = useMemo(
    () =>
      leads
        .filter((l) => (tab === "all" ? true : l.status === tab))
        .filter((l) =>
          query
            ? [l.name, l.email, l.company, l.types, l.message].join(" ").toLowerCase().includes(query.toLowerCase())
            : true,
        ),
    [leads, query, tab],
  );

  const exportCsv = () => {
    downloadCsv(
      "leads.csv",
      toCsv(filtered.map((l) => ({ ...l, created_at: fmt(l.created_at) }))),
    );
    toast.success(`Exported ${filtered.length} leads to CSV`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-white/50">{leads.length} total · captured from the public site.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export CSV
        </motion.button>
      </header>

      {/* Search + tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-base sm:text-sm outline-none transition-colors placeholder:text-white/30 focus:border-lime"
          />
        </div>

        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {(["all", ...LEAD_STATUSES.map((s) => s.value)] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                tab === t ? "text-ink" : "text-white/55 hover:text-white",
              )}
            >
              {tab === t && (
                <motion.span
                  layoutId="lead-tab"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-lime"
                />
              )}
              <span className="relative">
                {t} <span className={cn("tabular-nums", tab === t ? "opacity-60" : "opacity-40")}>{counts[t]}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="scroll-x">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.12em] text-white/45">
                <th className="px-5 py-3.5 font-medium">Lead</th>
                <th className="px-5 py-3.5 font-medium">Interest</th>
                <th className="px-5 py-3.5 font-medium">Budget</th>
                <th className="px-5 py-3.5 font-medium">Date</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <motion.tr
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
                  onClick={() => setSelected(l)}
                  className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-lime">
                        {l.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">{l.name}</div>
                        <div className="truncate text-xs text-white/45">{l.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-5 py-4 text-white/70">{l.types || "—"}</td>
                  <td className="px-5 py-4 text-white/70">{l.budget || "—"}</td>
                  <td className="px-5 py-4 text-white/45">{fmt(l.created_at)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLE[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-white/40">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdated={(l) => setSelected(l)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail drawer (shared with the pipeline view)                        */
/* ------------------------------------------------------------------ */
export function LeadDrawer({
  lead,
  onClose,
  onUpdated,
}: {
  lead: Lead | null;
  onClose: () => void;
  onUpdated: (l: Lead | null) => void;
}) {
  const [notes, setNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // sync local notes when a new lead opens
  const leadId = lead?.id;
  useEffect(() => {
    setNotes(lead?.notes ?? "");
    setConfirmDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-lg flex-col border-l border-white/10 bg-ink shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white/10 text-xs sm:text-sm font-semibold text-lime shrink-0">
                  {lead.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl tracking-tight truncate">{lead.name}</h2>
                  <a href={`mailto:${lead.email}`} className="text-xs sm:text-sm text-lime transition-colors hover:text-white truncate block">
                    {lead.email}
                  </a>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white hover:text-ink shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Company" value={lead.company || "—"} />
                <Field label="Budget" value={lead.budget || "—"} />
                <Field label="Interested in" value={lead.types || "—"} wide />
                <Field label="Source" value={lead.source} />
                <Field label="Received" value={fmt(lead.created_at)} />
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Message</div>
                <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
                  {lead.message || "No message provided."}
                </p>
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Status</div>
                <div className="flex flex-wrap gap-2">
                  {LEAD_STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={async () => {
                        await setLeadStatus(lead.id, s.value);
                        onUpdated({ ...lead, status: s.value });
                        toast.success(`${lead.name} marked as ${s.label}`);
                      }}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-medium transition-all",
                        lead.status === s.value ? STATUS_STYLE[s.value] : "border border-white/15 text-white/60 hover:border-white/40",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Private notes</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes only you can see…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed outline-none transition-colors focus:border-lime"
                />
                <button
                  onClick={async () => {
                    await setLeadNotes(lead.id, notes);
                    toast.success("Notes saved");
                  }}
                  className="mt-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white hover:text-ink"
                >
                  Save notes
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 p-6">
              {confirmDelete ? (
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await deleteLead(lead.id);
                      toast.info("Lead deleted");
                      onClose();
                    }}
                    className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
                  >
                    Confirm delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-xl border border-white/15 py-3 text-sm text-white/70 transition-colors hover:bg-white/10"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full rounded-xl border border-rose-500/40 py-3 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500 hover:text-white"
                >
                  Delete lead
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/5 p-3.5", wide && "col-span-2")}>
      <div className="text-[11px] uppercase tracking-[0.15em] text-white/40">{label}</div>
      <div className="mt-1 text-white/85">{value}</div>
    </div>
  );
}
