import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getKpis } from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { useHashRoute } from "../../hooks/useHashRoute";
import { cn } from "../../utils/cn";
import { LogoMark } from "../Logo";
import { Analytics } from "./Analytics";
import { Clients } from "./Clients";
import { CommandPalette } from "./CommandPalette";
import { Dashboard } from "./Dashboard";
import { Leads } from "./Leads";
import { Login } from "./Login";
import { Pipeline } from "./Pipeline";
import { Projects } from "./Projects";
import { Settings } from "./Settings";
import { Subscribers } from "./Subscribers";

import { endSession, isAuthed, touchSession } from "../../lib/auth";

const NAV = [
  { path: "/admin", label: "Dashboard", icon: "M4 13h6V4H4v9zm10 7h6V4h-6v16zM4 20h6v-4H4v4z" },
  { path: "/admin/leads", label: "Leads", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { path: "/admin/pipeline", label: "Pipeline", icon: "M4 5h16v4H4zM4 10.5h7v9H4zM14 10.5h6v9h-6z" },
  { path: "/admin/projects", label: "Projects", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { path: "/admin/clients", label: "Clients", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 8a8 8 0 0 1 16 0z" },
  { path: "/admin/analytics", label: "Analytics", icon: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
  { path: "/admin/subscribers", label: "Subscribers", icon: "M4 4h16v16H4zM4 8l8 5 8-5" },
  { path: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.3 7.3 0 0 0-2-1.2L14.4 3h-4l-.5 2.6a7.3 7.3 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.3 7.3 0 0 0 2 1.2l.5 2.6h4l.5-2.6a7.3 7.3 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" },
];

export function AdminApp() {
  const route = useHashRoute();
  const [authed, setAuthedState] = useState(isAuthed());
  const [palette, setPalette] = useState(false);
  const kpis = useDbData(getKpis);

  // keep the session alive while the admin is open
  useEffect(() => {
    if (!authed) return;
    touchSession();
    const t = setInterval(touchSession, 60000);
    return () => clearInterval(t);
  }, [authed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  if (!authed) {
    return <Login onSuccess={() => setAuthedState(true)} />;
  }

  const page =
    route === "/admin/leads" ? "leads"
    : route === "/admin/pipeline" ? "pipeline"
    : route === "/admin/projects" ? "projects"
    : route === "/admin/clients" ? "clients"
    : route === "/admin/analytics" ? "analytics"
    : route === "/admin/subscribers" ? "subscribers"
    : route === "/admin/settings" ? "settings"
    : "dashboard";

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 p-5 md:flex">
          <a href="#/" className="flex items-center gap-2.5 px-2 text-sm font-semibold tracking-tight">
            <LogoMark tone="light" className="h-7" />
            <span className="text-white/40">/ admin</span>
          </a>

          <nav className="mt-10 flex-1 space-y-1">
            {NAV.map((n) => {
              const active =
                n.path === "/admin" ? route === "/admin" : route.startsWith(n.path);
              return (
                <a
                  key={n.path}
                  href={`#${n.path}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d={n.icon} />
                  </svg>
                  {n.label}
                  {n.label === "Leads" && kpis && kpis.newLeads > 0 && (
                    <span className="ml-auto rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-ink">
                      {kpis.newLeads}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-white/10 pt-4">
            <button
              onClick={() => setPalette(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 10l2 2-2 2M12 14h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Command
              <kbd className="ml-auto rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40">⌘K</kbd>
            </button>
            <a
              href="#/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View site
            </a>
            <button
              onClick={() => {
                endSession();
                setAuthedState(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Log out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur-xl md:hidden safe-top">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3">
            <a href="#/" className="flex items-center gap-2 text-sm font-semibold">
              <LogoMark tone="light" className="h-6" />
              <span className="text-white/50">/ admin</span>
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPalette(true)}
                aria-label="Open command palette"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M7 10l2 2-2 2M12 14h4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => {
                  endSession();
                  setAuthedState(false);
                }}
                className="text-xs text-white/60"
              >
                Log out
              </button>
            </div>
          </div>
          <nav className="scroll-x flex gap-1 px-3 pb-2">
            {NAV.map((n) => {
              const active = n.path === "/admin" ? route === "/admin" : route.startsWith(n.path);
              return (
                <a
                  key={n.path}
                  href={`#${n.path}`}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition-colors",
                    active ? "bg-lime text-ink" : "text-white/60",
                  )}
                >
                  {n.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 pb-16 pt-28 sm:px-8 md:pt-10 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {page === "dashboard" && <Dashboard />}
              {page === "leads" && <Leads />}
              {page === "pipeline" && <Pipeline />}
              {page === "projects" && <Projects />}
              {page === "clients" && <Clients />}
              {page === "analytics" && <Analytics />}
              {page === "subscribers" && <Subscribers />}
              {page === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>

          <p className="mt-16 text-xs leading-relaxed text-white/30">
            Data is stored locally in your browser in a SQLite database (compiled to WebAssembly via sql.js) and
            persists across reloads. Press <kbd className="rounded border border-white/15 px-1.5 py-0.5">⌘K</kbd>{" "}
            anywhere in the admin to open the command palette.
          </p>
        </main>
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
