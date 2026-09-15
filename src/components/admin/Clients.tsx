import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  addClient,
  addClientProject,
  addFile,
  addInvoice,
  addMessage,
  addMilestone,
  deleteClient,
  deleteClientProject,
  deleteFile,
  deleteInvoice,
  deleteMilestone,
  listClients,
  listClientProjects,
  listFiles,
  listInvoices,
  listMessages,
  listMilestones,
  markMessagesRead,
  toggleMilestone,
  updateClient,
  updateClientProject,
  updateInvoiceStatus,
} from "../../db/database";
import {
  INVOICE_STATUSES,
  PROJECT_PHASES,
  type Client,
  type InvoiceStatus,
  type Milestone,
} from "../../db/schema";
import { useDbData } from "../../hooks/useDbData";
import {
  downloadStoredFile,
  formatBytes,
  formatDate,
  formatMoney,
  readFileAsDataUrl,
  timeAgo,
} from "../../lib/format";
import { generateClientInviteUrl } from "../../lib/portalAuth";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base sm:text-sm outline-none transition-colors focus:border-lime";
const INV_STYLE: Record<InvoiceStatus, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-sky-400/20 text-sky-300",
  paid: "bg-emerald-400/20 text-emerald-300",
  overdue: "bg-rose-400/20 text-rose-300",
};

export function Clients() {
  const clients = useDbData(listClients) ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  useEffect(() => {
    if (!selectedId && clients.length) setSelectedId(clients[0].id);
    if (selectedId && !clients.some((c) => c.id === selectedId)) {
      setSelectedId(clients.length ? clients[0].id : null);
    }
  }, [clients, selectedId]);

  const selected = clients.find((c) => c.id === selectedId) ?? null;

  const handleDeleteClient = async (c: Client) => {
    await deleteClient(c.id);
    toast.info(`Client "${c.name}" and all portal records removed.`);
    setClientToDelete(null);
    if (selectedId === c.id) {
      const remaining = clients.filter((x) => x.id !== c.id);
      setSelectedId(remaining.length ? remaining[0].id : null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Clients &amp; Portal</h1>
          <p className="mt-1 text-sm text-white/50">
            {clients.length} client{clients.length === 1 ? "" : "s"} with portal access.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="#/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
          >
            Open portal preview ↗
          </a>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            New client
          </motion.button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Client list */}
        <aside className="space-y-2">
          {clients.map((c) => (
            <ClientSidebarItem
              key={c.id}
              client={c}
              isSelected={c.id === selectedId}
              onSelect={() => setSelectedId(c.id)}
              onDeleteRequest={(e) => {
                e.stopPropagation();
                setClientToDelete(c);
              }}
            />
          ))}
          {clients.length === 0 && (
            <p className="rounded-xl border border-white/10 px-3.5 py-6 text-center text-sm text-white/40">
              No clients yet. Add one to activate their portal.
            </p>
          )}
        </aside>

        <section>
          {selected ? (
            <ClientDetail
              key={selected.id}
              client={selected}
              onDeleteClient={() => setClientToDelete(selected)}
            />
          ) : (
            <EmptyState />
          )}
        </section>
      </div>

      <NewClientModal open={showNew} onClose={() => setShowNew(false)} onCreated={(id) => setSelectedId(id)} />

      {/* Confirmation Modal to Delete Client */}
      <AnimatePresence>
        {clientToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setClientToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-ink p-7 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white">Delete Client?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white font-medium">{clientToDelete.name}</strong>
                {clientToDelete.company ? ` (${clientToDelete.company})` : ""}?
              </p>
              <p className="mt-1 text-xs text-rose-300/80">
                All associated portal projects, messages, deliverables, files, and invoices will be purged.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleDeleteClient(clientToDelete)}
                  className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
                >
                  Delete permanently
                </button>
                <button
                  onClick={() => setClientToDelete(null)}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm text-white/70 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClientSidebarItem({
  client,
  isSelected,
  onSelect,
  onDeleteRequest,
}: {
  client: Client;
  isSelected: boolean;
  onSelect: () => void;
  onDeleteRequest: (e: React.MouseEvent) => void;
}) {
  const msgs = useDbData(() => listMessages(client.id), [client.id]) ?? [];
  const unreadFromClient = msgs.filter((m) => m.sender === "client" && !m.read).length;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
        isSelected ? "border-lime bg-lime/10" : "border-white/10 hover:bg-white/5",
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-lime">
        {client.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{client.name}</span>
        <span className="block truncate text-xs text-white/45">{client.company || client.email}</span>
      </span>

      {unreadFromClient > 0 && (
        <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-ink">
          {unreadFromClient} new
        </span>
      )}

      <button
        onClick={onDeleteRequest}
        title="Delete client"
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[24rem] place-items-center rounded-2xl border border-white/10 text-sm text-white/40">
      Select a client to manage their portal.
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* New client modal                                                     */
/* ------------------------------------------------------------------ */
function NewClientModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: number) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", company: "", code: "" });

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    const cleanCompany = form.company.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-");
    const code = form.code.trim() || `${cleanCompany || "CLIENT"}-2026`;
    const id = await addClient({
      name: form.name,
      email: form.email,
      company: form.company,
      access_code: code,
    });
    toast.success("Client added — you can now copy their invite link!");
    setForm({ name: "", email: "", company: "", code: "" });
    onCreated(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-ink p-6 sm:p-8"
          >
            <h2 className="text-xl tracking-tight">Add New Client</h2>
            <p className="mt-1 text-sm text-white/45">
              Creates their private hub where they can review milestones, messages, files &amp; invoices.
            </p>
            <div className="mt-6 space-y-4">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Company (optional)"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Access code (auto-generated if blank)"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={cn(inputCls, "uppercase tracking-wider font-mono")}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={submit}
                className="flex-1 rounded-xl bg-lime py-3 text-sm font-semibold text-ink hover:bg-lime-deep transition-colors"
              >
                Create client
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/15 px-6 py-3 text-sm text-white/70 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Client detail                                                        */
/* ------------------------------------------------------------------ */
const DETAIL_TABS = ["Projects", "Messages", "Invoices", "Files", "Access"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

function ClientDetail({
  client,
  onDeleteClient,
}: {
  client: Client;
  onDeleteClient: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>("Projects");
  const msgs = useDbData(() => listMessages(client.id), [client.id]) ?? [];
  const unreadCount = msgs.filter((m) => m.sender === "client" && !m.read).length;

  const copyMagicLink = () => {
    const url = generateClientInviteUrl(client);
    navigator.clipboard.writeText(url);
    toast.success("1-Click portal magic link copied to clipboard!");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl tracking-tight">{client.name}</h2>
            <button
              onClick={copyMagicLink}
              title="Copy 1-click login link for this client"
              className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-medium text-lime hover:bg-lime hover:text-ink transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copy invite link
            </button>
            <button
              onClick={onDeleteClient}
              title="Delete this client"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete client
            </button>
          </div>
          <p className="mt-1 text-sm text-white/50">
            {client.company} · {client.email}
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
            Code: {client.access_code}
          </span>
        </div>
      </div>

      <nav className="scroll-x mt-6 flex gap-1 border-b border-white/10 pb-px">
        {DETAIL_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative shrink-0 px-4 py-2.5 text-sm transition-colors flex items-center gap-1.5",
              tab === t ? "text-lime" : "text-white/50 hover:text-white",
            )}
          >
            {t}
            {t === "Messages" && unreadCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-lime inline-block" />
            )}
            {tab === t && <motion.span layoutId="client-tab" className="absolute inset-x-2 -bottom-px h-0.5 bg-lime" />}
          </button>
        ))}
      </nav>

      <div className="pt-6">
        {tab === "Projects" && <ProjectsPanel client={client} />}
        {tab === "Messages" && <MessagesPanel client={client} />}
        {tab === "Invoices" && <InvoicesPanel client={client} />}
        {tab === "Files" && <FilesPanel client={client} />}
        {tab === "Access" && (
          <AccessPanel
            client={client}
            onCopyLink={copyMagicLink}
            onDeleteClient={onDeleteClient}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------ projects ------------------------------ */
function ProjectsPanel({ client }: { client: Client }) {
  const projects = useDbData(() => listClientProjects(client.id), [client.id]) ?? [];
  const [form, setForm] = useState({ name: "", phase: "Discovery", progress: 40, summary: "" });
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-5">
      {projects.map((p) => (
        <div key={p.id} className="rounded-xl border border-white/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-white">{p.name}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70">{p.phase}</span>
                <span className="text-xs tabular-nums text-lime font-mono">{p.progress}%</span>
              </div>
              {p.summary && <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-white/45">{p.summary}</p>}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={p.phase}
                onChange={(e) => updateClientProject(p.id, { phase: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-lime"
              >
                {PROJECT_PHASES.map((ph) => (
                  <option key={ph} className="bg-ink">
                    {ph}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                max={100}
                value={p.progress}
                onChange={(e) =>
                  updateClientProject(p.id, {
                    progress: Math.max(0, Math.min(100, Number(e.target.value))),
                  })
                }
                className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-lime font-mono"
              />
              <button
                onClick={async () => {
                  await deleteClientProject(p.id);
                  toast.info("Project deleted");
                }}
                aria-label="Delete project"
                className="text-white/30 hover:text-rose-400 p-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <MilestonesForProject projectId={p.id} />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setAdding(true)}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
        >
          + Add project for this client
        </button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={form.phase}
              onChange={(e) => setForm({ ...form, phase: e.target.value })}
              className={inputCls}
            >
              {PROJECT_PHASES.map((ph) => (
                <option key={ph} className="bg-ink">
                  {ph}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <textarea
            rows={2}
            placeholder="Short summary for client"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className={cn(inputCls, "resize-none")}
          />
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!form.name.trim()) return toast.error("Project name required");
                await addClientProject({ client_id: client.id, ...form });
                toast.success("Project created");
                setForm({ name: "", phase: "Discovery", progress: 40, summary: "" });
                setAdding(false);
              }}
              className="rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-ink hover:bg-lime-deep"
            >
              Save project
            </button>
            <button onClick={() => setAdding(false)} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70">
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !adding && (
        <p className="text-sm text-white/40">No projects yet. Click above to assign one.</p>
      )}
    </div>
  );
}

/* Milestones component */
function MilestonesForProject({ projectId }: { projectId: number }) {
  const ms: Milestone[] = useDbData(() => listMilestones(projectId), [projectId]) ?? [];
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="mb-3 text-xs uppercase tracking-[0.15em] text-white/40">Milestones &amp; Deliverables</div>
      <ul className="space-y-2">
        {ms.map((m) => (
          <li key={m.id} className="flex items-center gap-3 text-sm">
            <button
              onClick={() => toggleMilestone(m.id, m.done ? 0 : 1)}
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors",
                m.done ? "bg-lime text-ink" : "border border-white/25",
              )}
            >
              {m.done === 1 && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className={cn("flex-1", m.done ? "line-through text-white/50" : "text-white/80")}>
              {m.title}
            </span>
            {m.due && <span className="text-xs text-white/40">{formatDate(m.due)}</span>}
            <button
              onClick={() => deleteMilestone(m.id)}
              aria-label="Delete"
              className="text-white/30 hover:text-rose-400 p-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New milestone name…"
          className={cn(inputCls, "py-2")}
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className={cn(inputCls, "py-2 w-40")}
        />
        <button
          onClick={async () => {
            if (!title.trim()) return;
            await addMilestone(projectId, title, due);
            setTitle("");
            setDue("");
          }}
          className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ messages ------------------------------ */
function MessagesPanel({ client }: { client: Client }) {
  const messages = useDbData(() => listMessages(client.id), [client.id]) ?? [];
  const [text, setText] = useState("");
  const body = text.trim();

  // FIX: Mark client's messages as read when admin views this panel!
  useEffect(() => {
    markMessagesRead(client.id, "client");
  }, [client.id, messages.length]);

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border border-white/10">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === "studio" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                m.sender === "studio" ? "bg-lime text-ink" : "bg-white/10 text-white",
              )}
            >
              {m.body}
              <div
                className={cn(
                  "mt-1 text-[10px]",
                  m.sender === "studio" ? "text-ink/50" : "text-white/40",
                )}
              >
                {m.sender === "studio" ? "You (Studio)" : client.name} · {timeAgo(m.created_at)}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-sm text-white/40 pt-8">No messages in this client thread yet.</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && body) {
              await addMessage(client.id, "studio", body);
              setText("");
            }
          }}
          placeholder="Reply to client in portal…"
          className={cn(inputCls, "py-2")}
        />
        <button
          onClick={async () => {
            if (!body) return;
            await addMessage(client.id, "studio", body);
            setText("");
          }}
          className="shrink-0 rounded-xl bg-lime px-5 text-sm font-semibold text-ink hover:bg-lime-deep"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ invoices ------------------------------ */
function InvoicesPanel({ client }: { client: Client }) {
  const invoices = useDbData(() => listInvoices(client.id), [client.id]) ?? [];
  const [form, setForm] = useState({ number: "", amount: "", due: "" });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
            <span className="text-sm font-medium">{inv.number}</span>
            <span className="text-sm text-white/60 tabular-nums">{formatMoney(inv.amount, inv.currency)}</span>
            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", INV_STYLE[inv.status])}>
              {inv.status}
            </span>
            <span className="text-xs text-white/40">Due {formatDate(inv.due)}</span>
            <div className="ml-auto flex items-center gap-2">
              <select
                value={inv.status}
                onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-lime"
              >
                {INVOICE_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-ink">
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => deleteInvoice(inv.id)}
                aria-label="Delete invoice"
                className="text-white/30 hover:text-rose-400 p-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {invoices.length === 0 && <p className="text-sm text-white/40">No invoices yet.</p>}
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          placeholder="INV-0001"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="Amount (e.g. 5000)"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={inputCls}
        />
        <input
          type="date"
          value={form.due}
          onChange={(e) => setForm({ ...form, due: e.target.value })}
          className={inputCls}
        />
        <button
          onClick={async () => {
            if (!form.number.trim()) return toast.error("Invoice number required");
            await addInvoice({
              client_id: client.id,
              number: form.number,
              amount: Number(form.amount) || 0,
              due: form.due,
              status: "sent",
            });
            toast.success("Invoice created");
            setForm({ number: "", amount: "", due: "" });
          }}
          className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-deep"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ files ------------------------------ */
function FilesPanel({ client }: { client: Client }) {
  const files = useDbData(() => listFiles(client.id), [client.id]) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_500_000) return toast.error("Files are limited to 1.5 MB in this demo.");
    const data = await readFileAsDataUrl(file);
    await addFile({
      client_id: client.id,
      name: file.name,
      size: file.size,
      type: file.type,
      data,
      uploaded_by: "studio",
    });
    toast.success("File shared with client");
  };

  return (
    <div className="space-y-3">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{f.name}</div>
            <div className="text-xs text-white/40">
              {f.uploaded_by === "studio" ? "From studio" : "From client"} · {formatBytes(f.size)} ·{" "}
              {timeAgo(f.created_at)}
            </div>
          </div>
          <button
            onClick={() => (f.data ? downloadStoredFile(f) : toast.info("No file data"))}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
          >
            Download
          </button>
          <button
            onClick={() => deleteFile(f.id)}
            aria-label="Delete file"
            className="text-white/30 hover:text-rose-400 p-1"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
      {files.length === 0 && <p className="text-sm text-white/40">No files shared yet.</p>}
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10"
      >
        + Upload file for client
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
  );
}

/* ------------------------------ access ------------------------------ */
function AccessPanel({
  client,
  onCopyLink,
  onDeleteClient,
}: {
  client: Client;
  onCopyLink: () => void;
  onDeleteClient: () => void;
}) {
  const [form, setForm] = useState({
    name: client.name,
    email: client.email,
    company: client.company,
    access_code: client.access_code,
  });

  return (
    <div className="max-w-md space-y-4">
      <div className="rounded-xl border border-lime/30 bg-lime/5 p-4 text-xs space-y-2">
        <div className="font-semibold text-lime">Client Portal Invite Link</div>
        <p className="text-white/60 leading-relaxed">
          Send this 1-click magic link to your client so they can access their project without typing their credentials manually.
        </p>
        <button
          onClick={onCopyLink}
          className="rounded-lg bg-lime px-3 py-1.5 text-xs font-semibold text-ink hover:bg-lime-deep transition-colors"
        >
          Copy 1-click invite link
        </button>
      </div>

      <label className="block">
        <span className="text-xs text-white/40 block mb-1">Full Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputCls}
          placeholder="Name"
        />
      </label>
      <label className="block">
        <span className="text-xs text-white/40 block mb-1">Email (used to log in)</span>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputCls}
          placeholder="Email"
        />
      </label>
      <label className="block">
        <span className="text-xs text-white/40 block mb-1">Company</span>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className={inputCls}
          placeholder="Company"
        />
      </label>
      <label className="block">
        <span className="text-xs text-white/40 block mb-1">Access Code</span>
        <input
          value={form.access_code}
          onChange={(e) => setForm({ ...form, access_code: e.target.value })}
          className={cn(inputCls, "uppercase tracking-wider font-mono")}
          placeholder="Access code"
        />
      </label>

      <button
        onClick={async () => {
          await updateClient(client.id, form);
          toast.success("Client updated");
        }}
        className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-deep"
      >
        Save changes
      </button>

      <div className="mt-6 border-t border-white/10 pt-5">
        <button
          onClick={onDeleteClient}
          className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
        >
          Delete client &amp; all portal data
        </button>
      </div>
    </div>
  );
}
