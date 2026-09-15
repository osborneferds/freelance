import { motion } from "motion/react";
import { useState } from "react";
import { listLeads, setLeadStatus } from "../../db/database";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "../../db/schema";
import { useDbData } from "../../hooks/useDbData";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";
import { LeadDrawer } from "./Leads";

const COLUMN_STYLE: Record<LeadStatus, string> = {
  new: "bg-lime",
  contacted: "bg-sky-300",
  won: "bg-emerald-300",
  lost: "bg-white/20",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Pipeline() {
  const leads = useDbData(listLeads) ?? [];
  const [dragId, setDragId] = useState<number | null>(null);
  const [over, setOver] = useState<LeadStatus | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);

  const drop = async (status: LeadStatus) => {
    if (dragId === null) return;
    const lead = leads.find((l) => l.id === dragId);
    if (lead && lead.status !== status) {
      await setLeadStatus(dragId, status);
      toast.success(`${lead.name} → ${status}`);
    }
    setDragId(null);
    setOver(null);
  };

  const total = leads.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl tracking-tight">Pipeline</h1>
        <p className="mt-1 text-sm text-white/50">
          <span className="hidden md:inline">Drag cards between columns to update status.</span>
          <span className="md:hidden">Tap a card to open it and change its status.</span>{" "}
          {total} lead{total === 1 ? "" : "s"} in the pipeline.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LEAD_STATUSES.map((col) => {
          const items = leads.filter((l) => l.status === col.value);
          return (
            <section
              key={col.value}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.value);
              }}
              onDragLeave={() => setOver((o) => (o === col.value ? null : o))}
              onDrop={() => drop(col.value)}
              className={cn(
                "flex flex-col rounded-2xl border transition-colors sm:min-h-[24rem]",
                over === col.value
                  ? "border-lime bg-lime/5"
                  : "border-white/10 bg-white/[0.03]",
              )}
            >
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", COLUMN_STYLE[col.value])} />
                  <span className="text-sm font-medium">{col.label}</span>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] tabular-nums text-white/60">
                  {items.length}
                </span>
              </header>

              <div className="flex-1 space-y-3 p-3">
                {items.map((l, i) => (
                  <motion.article
                    key={l.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOver(null);
                    }}
                    onClick={() => setSelected(l)}
                    className={cn(
                      "cursor-grab rounded-xl border border-white/10 bg-white/5 p-3.5 transition-all active:cursor-grabbing",
                      dragId === l.id && "opacity-40",
                      "hover:border-white/25 hover:bg-white/10",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-white">{l.name}</span>
                      <span className="text-[11px] text-white/35">{fmt(l.created_at)}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-white/45">{l.company || l.email}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {l.types.split(",").filter(Boolean).slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                          {t.trim()}
                        </span>
                      ))}
                      {l.budget && (
                        <span className="rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-medium text-lime">
                          {l.budget}
                        </span>
                      )}
                    </div>
                  </motion.article>
                ))}
                {items.length === 0 && (
                  <div
                    className={cn(
                      "grid h-24 place-items-center rounded-xl border border-dashed text-xs transition-colors",
                      over === col.value ? "border-lime/60 text-lime" : "border-white/10 text-white/25",
                    )}
                  >
                    Drop here
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onUpdated={(l) => setSelected(l)}
      />
    </div>
  );
}
