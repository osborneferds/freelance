import { motion } from "motion/react";
import { getAnalytics } from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { AreaChart } from "./Charts";

export function Analytics() {
  const data = useDbData(getAnalytics);

  if (!data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-lime" />
      </div>
    );
  }

  const cards = [
    { label: "Total page views", value: data.totalViews },
    { label: "Active days", value: data.uniqueDays },
    { label: "Avg. views / day", value: data.avgPerDay },
    { label: "Tracked pages", value: data.pages.length },
  ];

  const maxPageViews = Math.max(1, ...data.pages.map((p) => p.views));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Real visits tracked from the public site, stored in SQLite.
        </p>
      </header>

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
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-medium tracking-tight">Traffic, last 14 days</h2>
        <p className="mb-4 text-xs text-white/40">Every page view across the site</p>
        <AreaChart data={data.viewsLast14d} />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-medium tracking-tight">Most visited pages</h2>
          <p className="mb-5 text-xs text-white/40">Where visitors spend their time</p>
          <ul className="space-y-3">
            {data.pages.map((p, i) => (
              <li key={p.path}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/85">
                    <span className="text-xs text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {p.label}
                    <span className="text-[11px] text-white/35">{p.path}</span>
                  </span>
                  <span className="tabular-nums text-white/45">{p.views}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(p.views / maxPageViews) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-lime"
                  />
                </div>
              </li>
            ))}
            {data.pages.length === 0 && <li className="text-sm text-white/40">No visits tracked yet.</li>}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-medium tracking-tight">Project interest</h2>
          <p className="mb-5 text-xs text-white/40">Clicks on portfolio cards</p>
          <ul className="space-y-3">
            {data.projectViews.map((p, i) => (
              <li key={p.title} className="flex items-center gap-4">
                <span className="text-2xl font-semibold tabular-nums text-white/25">{p.views}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white/85">{p.title}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(6, (p.views / Math.max(1, ...data.projectViews.map((x) => x.views))) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-lime-deep to-lime"
                    />
                  </div>
                </div>
              </li>
            ))}
            {data.projectViews.length === 0 && (
              <li className="text-sm text-white/40">
                No project clicks yet — visitors who tap a project card show up here.
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
