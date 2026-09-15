import { motion } from "motion/react";
import { getKpis, listActivity, listLeads } from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { LEAD_STATUSES, type LeadStatus } from "../../db/schema";
import { AreaChart, DemandBars } from "./Charts";

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-lime text-ink",
  contacted: "bg-sky-300 text-ink",
  won: "bg-emerald-300 text-ink",
  lost: "bg-white/10 text-white/60",
};

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function Dashboard() {
  const kpis = useDbData(getKpis);
  const leads = useDbData(listLeads);
  const activity = useDbData(() => listActivity(8));

  if (!kpis) return <Loading />;

  const cards = [
    { label: "Total leads", value: kpis.totalLeads, hint: `${kpis.weeklyTrend >= 0 ? "+" : ""}${kpis.weeklyTrend}% vs last week` },
    { label: "New", value: kpis.newLeads, hint: "awaiting first reply" },
    { label: "In progress", value: kpis.contactedLeads, hint: "contacted" },
    { label: "Won", value: kpis.wonLeads, hint: `${kpis.conversionRate}% conversion` },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">
            Overview of your pipeline. Data is stored locally in SQLite (WASM).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="#/admin/pipeline" label="Pipeline" icon="M4 5h16v4H4zM4 10.5h7v9H4zM14 10.5h6v9h-6z" />
          <QuickLink href="#/admin/projects" label="Projects" icon="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          <QuickLink href="#/admin/analytics" label="Analytics" icon="M4 20V10M10 20V4M16 20v-8M22 20H2" />
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="text-xs uppercase tracking-[0.15em] text-white/45">{c.label}</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums">{c.value}</div>
            <div className="mt-1 text-xs text-white/40">{c.hint}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium tracking-tight">Leads over time</h2>
              <p className="text-xs text-white/40">Last 30 days</p>
            </div>
            <span className="rounded-full bg-lime/15 px-3 py-1 text-xs font-medium text-lime">
              {kpis.leadsLast30d.reduce((a, b) => a + b.value, 0)} this month
            </span>
          </div>
          <AreaChart data={kpis.leadsLast30d} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-medium tracking-tight">Service demand</h2>
          <p className="mb-6 text-xs text-white/40">What leads are asking for</p>
          <DemandBars items={kpis.demand} />
        </motion.div>
      </div>

      {/* Recent leads + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:col-span-2"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-medium tracking-tight">Recent leads</h2>
            <a href="#/admin/leads" className="text-xs text-lime transition-colors hover:text-white">
              View all →
            </a>
          </div>
          <ul className="divide-y divide-white/5">
            {(leads ?? []).slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold text-lime">
                  {l.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.name}</div>
                  <div className="truncate text-xs text-white/45">
                    {l.company || l.email} · {l.types || "—"}
                  </div>
                </div>
                <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium sm:block ${STATUS_STYLE[l.status]}`}>
                  {LEAD_STATUSES.find((s) => s.value === l.status)?.label}
                </span>
                <span className="shrink-0 text-xs text-white/35">{timeAgo(l.created_at)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <h2 className="border-b border-white/10 px-6 py-4 text-lg font-medium tracking-tight">Activity</h2>
          <ul className="divide-y divide-white/5">
            {(activity ?? []).map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-6 py-3.5">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    a.kind === "lead" ? "bg-lime" : a.kind === "won" ? "bg-emerald-300" : "bg-white/30"
                  }`}
                />
                <div>
                  <div className="text-sm leading-snug text-white/80">{a.detail}</div>
                  <div className="mt-0.5 text-[11px] text-white/35">{timeAgo(a.created_at)}</div>
                </div>
              </li>
            ))}
            {(activity ?? []).length === 0 && <li className="px-6 py-6 text-sm text-white/40">No activity yet.</li>}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition-all hover:-translate-y-0.5 hover:border-lime/50 hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 text-lime">
        <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-lime" />
    </div>
  );
}
