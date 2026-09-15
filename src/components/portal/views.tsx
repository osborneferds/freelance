import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  addFile,
  addMessage,
  listAllMilestones,
  listClientProjects,
  listFiles,
  listInvoices,
  listMessages,
  markMessagesRead,
  toggleMilestone,
} from "../../db/database";
import type { Client, ClientFile } from "../../db/schema";
import { useDbData } from "../../hooks/useDbData";
import {
  downloadStoredFile,
  formatBytes,
  formatDate,
  formatMoney,
  printInvoice,
  readFileAsDataUrl,
  timeAgo,
} from "../../lib/format";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";

const card = "rounded-2xl border border-ink/10 bg-white/70 p-4 sm:p-6 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.4)]";

/* ------------------------------------------------------------------ */
/* Overview                                                             */
/* ------------------------------------------------------------------ */
export function Overview({ client }: { client: Client }) {
  const projects = useDbData(() => listClientProjects(client.id), [client.id]) ?? [];
  const allMilestones = useDbData(listAllMilestones) ?? [];
  const invoices = useDbData(() => listInvoices(client.id), [client.id]) ?? [];
  const messages = useDbData(() => listMessages(client.id), [client.id]) ?? [];

  // SCOPED TO CLIENT'S PROJECTS ONLY (fixes Bug #1)
  const clientProjectIds = new Set(projects.map((p) => p.id));
  const clientMilestones = allMilestones.filter((m) => clientProjectIds.has(m.project_id));
  const projMilestones = (pid: number) =>
    allMilestones.filter((m) => m.project_id === pid).sort((a, b) => a.sort - b.sort);

  const doneCount = clientMilestones.filter((m) => m.done).length;
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((a, b) => a + b.amount, 0);
  const unread = messages.filter((m) => m.sender === "studio" && !m.read).length;

  const stats = [
    { label: "Active projects", value: String(projects.length) },
    {
      label: "Milestones done",
      value: clientMilestones.length > 0 ? `${doneCount}/${clientMilestones.length}` : "—",
    },
    { label: "Outstanding balance", value: formatMoney(outstanding) },
    {
      label: "Studio replies",
      value: String(messages.filter((m) => m.sender === "studio").length),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={card}
          >
            <div className="text-xs uppercase tracking-[0.15em] text-muted">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {unread > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-lime bg-lime/15 px-5 py-4 text-sm">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path d="M4 6h16v12H4zM4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          You have <strong className="mx-1">{unread}</strong> new message{unread === 1 ? "" : "s"} from the studio.
        </div>
      )}

      {projects.map((p) => {
        const ms = projMilestones(p.id);
        return (
          <motion.section key={p.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl tracking-tight">{p.name}</h2>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-lime">{p.phase}</span>
                </div>
                {p.summary && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{p.summary}</p>}
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tracking-tight">{p.progress}%</div>
                <div className="text-xs text-muted">complete</div>
              </div>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.progress}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-lime-deep to-lime"
              />
            </div>

            {ms.length > 0 && (
              <div className="mt-6">
                <div className="mb-2.5 text-xs uppercase tracking-[0.14em] text-muted">
                  Project milestones &amp; deliverables
                </div>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {ms.map((m) => (
                    <li
                      key={m.id}
                      onClick={async () => {
                        const newStatus = m.done ? 0 : 1;
                        await toggleMilestone(m.id, newStatus);
                        toast.success(newStatus ? `Milestone "${m.title}" marked done` : `Milestone "${m.title}" reopened`);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 cursor-pointer transition-colors hover:border-ink/30",
                        m.done ? "bg-white/40" : "bg-white/80",
                      )}
                      title="Click to toggle approval status"
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors",
                          m.done ? "bg-lime text-ink" : "border border-ink/20 text-transparent hover:border-ink",
                        )}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-sm font-medium", m.done ? "line-through text-muted" : "text-ink")}>
                          {m.title}
                        </span>
                        {m.due && <span className="text-xs text-muted">Due {formatDate(m.due)}</span>}
                      </span>
                      <span className="text-[10px] text-muted uppercase font-mono">
                        {m.done ? "Done" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </motion.section>
        );
      })}

      {projects.length === 0 && (
        <div className={cn(card, "text-center text-muted")}>
          <p className="text-sm">No active projects yet. I'll set this up shortly.</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Messages                                                             */
/* ------------------------------------------------------------------ */
export function Messages({ client }: { client: Client }) {
  const messages = useDbData(() => listMessages(client.id), [client.id]) ?? [];
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markMessagesRead(client.id, "studio");
  }, [client.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    await addMessage(client.id, "client", body);
    toast.success("Message sent to studio");
  };

  return (
    <div className={cn(card, "flex h-[70vh] flex-col p-0")}>
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m) => {
          const mine = m.sender === "client";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div className={cn("max-w-[80%]", mine ? "text-right" : "text-left")}>
                <div
                  className={cn(
                    "inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    mine ? "bg-ink text-white" : "bg-ink/5 text-ink",
                  )}
                >
                  {m.body}
                </div>
                <div className="mt-1 text-[11px] text-muted">
                  {mine ? "You" : "Studio"} · {timeAgo(m.created_at)}
                </div>
              </div>
            </motion.div>
          );
        })}
        {messages.length === 0 && <p className="text-center text-sm text-muted">No messages yet — say hello 👋</p>}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-ink/10 p-3 sm:p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a message to the studio…"
          className="w-full rounded-full border border-ink/15 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-sm outline-none transition-colors focus:border-ink"
        />
        <button
          onClick={send}
          className="shrink-0 rounded-full bg-ink px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-lime transition-colors hover:bg-ink/85 active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Files                                                                */
/* ------------------------------------------------------------------ */
export function Files({ client }: { client: Client }) {
  const files = useDbData(() => listFiles(client.id), [client.id]) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      toast.error("Files are limited to 1.5 MB in this demo.");
      return;
    }
    setBusy(true);
    try {
      const data = await readFileAsDataUrl(file);
      await addFile({
        client_id: client.id,
        name: file.name,
        size: file.size,
        type: file.type,
        data,
        uploaded_by: "client",
      });
      toast.success("File shared with the studio");
    } catch {
      toast.error("Could not upload that file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Shared files between you and the studio.</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-lime transition-colors hover:bg-ink/85 disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70">
        <ul className="divide-y divide-ink/5">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-4 px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                  <path d="M6 2h8l4 4v16H6zM14 2v4h4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted">
                  {f.uploaded_by === "studio" ? "From studio" : "From you"} · {formatBytes(f.size)} ·{" "}
                  {timeAgo(f.created_at)}
                </div>
              </div>
              <button
                onClick={() => (f.data ? downloadStoredFile(f) : toast.info("Demo placeholder — no file attached."))}
                className="shrink-0 rounded-lg border border-ink/15 px-3.5 py-2 text-xs font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                Download
              </button>
            </li>
          ))}
          {files.length === 0 && <li className="px-5 py-12 text-center text-sm text-muted">No files shared yet.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Invoices                                                             */
/* ------------------------------------------------------------------ */
const INV_STYLE: Record<string, string> = {
  draft: "bg-ink/10 text-ink/70",
  sent: "bg-sky-100 text-sky-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-rose-100 text-rose-700",
};

export function Invoices({ client }: { client: Client }) {
  const invoices = useDbData(() => listInvoices(client.id), [client.id]) ?? [];
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((a, b) => a + b.amount, 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={card}>
          <div className="text-xs uppercase tracking-[0.15em] text-muted">Total invoiced</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(paid + outstanding)}</div>
        </div>
        <div className={card}>
          <div className="text-xs uppercase tracking-[0.15em] text-muted">Paid</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600">{formatMoney(paid)}</div>
        </div>
        <div className={card}>
          <div className="text-xs uppercase tracking-[0.15em] text-muted">Outstanding</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(outstanding)}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70">
        <div className="scroll-x">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-ink/[0.03] text-xs uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-3.5 font-medium">Invoice</th>
                <th className="px-5 py-3.5 font-medium">Issued</th>
                <th className="px-5 py-3.5 font-medium">Due</th>
                <th className="px-5 py-3.5 font-medium">Amount</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-5 py-4 font-medium">{inv.number}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(inv.issued)}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(inv.due)}</td>
                  <td className="px-5 py-4 tabular-nums">{formatMoney(inv.amount, inv.currency)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
                        INV_STYLE[inv.status],
                      )}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== "paid" && (
                        <button
                          onClick={() => {
                            toast.info(`Payment instructions sent to your email for invoice ${inv.number}`);
                          }}
                          className="rounded-lg bg-lime px-3 py-1.5 text-xs font-semibold text-ink hover:bg-lime-deep transition-colors"
                        >
                          Pay
                        </button>
                      )}
                      <button
                        onClick={() => printInvoice(inv, client.name, client.company)}
                        className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No invoices yet.
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

export type { ClientFile };
