import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { downloadCsv, listLeads, listSubscribers, toCsv } from "../../db/database";
import { navigate } from "../../hooks/useHashRoute";
import { endSession } from "../../lib/auth";
import { toast } from "../../lib/toast";

interface Cmd {
  id: string;
  label: string;
  hint: string;
  group: "Go to" | "Actions";
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const commands = useMemo<Cmd[]>(
    () => [
      { id: "dash", label: "Dashboard", hint: "Overview", group: "Go to", run: () => navigate("/admin") },
      { id: "leads", label: "Leads", hint: "All enquiries", group: "Go to", run: () => navigate("/admin/leads") },
      { id: "pipe", label: "Pipeline", hint: "Kanban board", group: "Go to", run: () => navigate("/admin/pipeline") },
      { id: "proj", label: "Projects", hint: "Manage portfolio", group: "Go to", run: () => navigate("/admin/projects") },
      { id: "clients", label: "Clients", hint: "Client portal", group: "Go to", run: () => navigate("/admin/clients") },
      { id: "portal", label: "Open client portal", hint: "Client sign-in", group: "Go to", run: () => navigate("/portal") },
      { id: "ana", label: "Analytics", hint: "Traffic & interest", group: "Go to", run: () => navigate("/admin/analytics") },
      { id: "subs", label: "Subscribers", hint: "Newsletter", group: "Go to", run: () => navigate("/admin/subscribers") },
      { id: "set", label: "Settings", hint: "Profile & data", group: "Go to", run: () => navigate("/admin/settings") },
      { id: "site", label: "View website", hint: "Back to the site", group: "Go to", run: () => navigate("/") },
      {
        id: "csv-l",
        label: "Export leads CSV",
        hint: "Download",
        group: "Actions",
        run: async () => {
          const rows = await listLeads();
          downloadCsv("leads.csv", toCsv(rows));
          toast.success("Leads exported");
        },
      },
      {
        id: "csv-s",
        label: "Export subscribers CSV",
        hint: "Download",
        group: "Actions",
        run: async () => {
          const rows = await listSubscribers();
          downloadCsv("subscribers.csv", toCsv(rows));
          toast.success("Subscribers exported");
        },
      },
      {
        id: "logout",
        label: "Log out",
        hint: "End session",
        group: "Actions",
        run: () => {
          endSession();
          navigate("/admin");
          location.reload();
        },
      },
    ],
    [],
  );

  const filtered = commands.filter(
    (c) => c.label.toLowerCase().includes(q.toLowerCase()) || c.hint.toLowerCase().includes(q.toLowerCase()),
  );
  const groups = ["Go to", "Actions"].filter((g) => filtered.some((c) => c.group === g));

  useEffect(() => setActive(0), [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      const cmd = filtered[active];
      if (cmd) {
        onClose();
        cmd.run();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4 text-white/40">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search actions and pages…"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-white/30"
              />
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40">ESC</kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2 sm:max-h-[46vh]">
              {groups.map((g) => (
                <div key={g} className="mb-1">
                  <div className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">{g}</div>
                  {filtered
                    .filter((c) => c.group === g)
                    .map((c) => {
                      runningIndex++;
                      const idx = runningIndex;
                      return (
                        <button
                          key={c.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            onClose();
                            c.run();
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            active === idx ? "bg-lime text-ink" : "text-white/80 hover:bg-white/5"
                          }`}
                        >
                          <span>{c.label}</span>
                          <span className={`text-xs ${active === idx ? "text-ink/60" : "text-white/35"}`}>
                            {c.hint}
                          </span>
                        </button>
                      );
                    })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-white/40">No results for “{q}”.</div>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 px-5 py-2.5 text-[10px] text-white/30">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/15 px-1 py-0.5">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/15 px-1 py-0.5">↵</kbd> run
              </span>
              <span className="ml-auto">⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
