import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { downloadCsv, listSubscribers, toCsv } from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { toast } from "../../lib/toast";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function Subscribers() {
  const subs = useDbData(listSubscribers) ?? [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => subs.filter((s) => s.email.toLowerCase().includes(query.toLowerCase())),
    [subs, query],
  );

  const exportCsv = () => {
    downloadCsv(
      "subscribers.csv",
      toCsv(filtered.map((s) => ({ id: s.id, email: s.email, subscribed_on: fmt(s.created_at) }))),
    );
    toast.success(`Exported ${filtered.length} subscribers`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Subscribers</h1>
          <p className="mt-1 text-sm text-white/50">
            {subs.length} people subscribed from the website footer.
          </p>
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
          placeholder="Search email…"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-base sm:text-sm outline-none transition-colors placeholder:text-white/30 focus:border-lime"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="scroll-x">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.12em] text-white/45">
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.4 }}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime/15 text-xs font-semibold text-lime">
                        {s.email[0]?.toUpperCase()}
                      </span>
                      <span className="text-white">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/45">{fmt(s.created_at)}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-14 text-center text-white/40">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
