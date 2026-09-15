import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";
import {
  getPortalSession,
  touchPortalSession,
  endPortalSession,
  type PortalSession,
} from "../../lib/portalAuth";
import { findClientByEmail, listMessages } from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";
import { PortalLogin } from "./PortalLogin";
import { Files, Invoices, Messages, Overview } from "./views";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "messages", label: "Messages" },
  { id: "files", label: "Files" },
  { id: "invoices", label: "Invoices" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function PortalApp() {
  const [session, setSession] = useState<PortalSession | null>(getPortalSession());

  useEffect(() => {
    if (!session) return;
    touchPortalSession();
    const t = setInterval(touchPortalSession, 60000);
    return () => clearInterval(t);
  }, [session]);

  if (!session) {
    return <PortalLogin onSuccess={() => setSession(getPortalSession())} />;
  }

  return (
    <PortalShell
      session={session}
      onLogout={() => {
        endPortalSession();
        setSession(null);
      }}
    />
  );
}

function PortalShell({
  session,
  onLogout,
}: {
  session: PortalSession;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const client = useDbData(() => findClientByEmail(session.email), [session.email]);
  const messages = useDbData(() => (client ? listMessages(client.id) : Promise.resolve([])), [client?.id]) ?? [];
  const unreadCount = messages.filter((m) => m.sender === "studio" && !m.read).length;

  // Handle case where client account was removed from the database
  useEffect(() => {
    // Give a brief delay for first load
    const timer = setTimeout(() => {
      if (client === null) {
        toast.info("Your project session has ended or account was removed.");
        onLogout();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [client, onLogout]);

  if (!client) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <p className="text-sm text-muted">Loading your project hub…</p>
          <button
            onClick={onLogout}
            className="text-xs text-muted underline hover:text-ink pt-2 block mx-auto"
          >
            Cancel and return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
          <a href="#/" className="flex items-center shrink-0">
            <Logo />
          </a>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-tight">{client.name}</div>
              <div className="text-xs text-muted">{client.company}</div>
            </div>
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-ink text-xs sm:text-sm font-semibold text-lime shrink-0">
              {client.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </span>
            <button
              onClick={onLogout}
              className="rounded-full border border-ink/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Client portal</div>
            <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-medium tracking-tight">
              Hi {client.name.split(" ")[0]}, here's your project.
            </h1>
          </div>
          <div className="text-xs text-muted">
            Code: <span className="font-mono font-medium text-ink bg-ink/5 px-2 py-1 rounded-md">{client.access_code}</span>
          </div>
        </div>

        <nav className="scroll-x mb-8 flex gap-1 rounded-2xl border border-ink/10 bg-white/60 p-1">
          {TABS.map((t) => {
            const hasBadge = t.id === "messages" && unreadCount > 0;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2",
                  tab === t.id ? "text-lime" : "text-ink/60 hover:text-ink",
                )}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="portal-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-ink"
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {t.label}
                  {hasBadge && (
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                        tab === t.id ? "bg-lime text-ink" : "bg-ink text-lime",
                      )}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "overview" && <Overview client={client} />}
            {tab === "messages" && <Messages client={client} />}
            {tab === "files" && <Files client={client} />}
            {tab === "invoices" && <Invoices client={client} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-ink/10 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} Osborne Fernandes Studio</span>
        <a href="#/" className="link-underline hover:text-ink">
          ← Back to website
        </a>
      </footer>
    </div>
  );
}
