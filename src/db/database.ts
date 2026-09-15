import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { adminConfig } from "../config";
import { dispatchToBackend } from "../lib/backendSync";
import {
  SCHEMA_SQL,
  type ActivityItem,
  type Client,
  type ClientFile,
  type ClientProject,
  type Invoice,
  type InvoiceStatus,
  type Lead,
  type LeadStatus,
  type Message,
  type Milestone,
  type PageView,
  type Project,
  type Subscriber,
} from "./schema";

const STORAGE_KEY = "osborne-fernandes-db-v1";

let db: Database | null = null;
let SQLModule: Awaited<ReturnType<typeof initSqlJs>> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const syncChannel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("of_db_sync") : null;

if (syncChannel) {
  syncChannel.onmessage = (e) => {
    if (e.data === "db_updated" && SQLModule) {
      reloadDbFromStorage();
    }
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && SQLModule) {
      reloadDbFromStorage();
    }
  });
}

function reloadDbFromStorage() {
  if (!SQLModule) return;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      db = new SQLModule.Database(fromBase64(saved));
      notify();
    } catch {
      // ignore
    }
  }
}

/* ------------------------------------------------------------------ */
/* pub/sub so React can re-render after writes                          */
/* ------------------------------------------------------------------ */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() {
  listeners.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* base64 helpers (chunked to avoid call-stack limits)                  */
/* ------------------------------------------------------------------ */
function toBase64(u8: Uint8Array): string {
  let bin = "";
  const CHUNK = 8192;
  for (let i = 0; i < u8.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + CHUNK)));
  }
  return btoa(bin);
}
function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

/* ------------------------------------------------------------------ */
/* init + persistence                                                   */
/* ------------------------------------------------------------------ */
let initPromise: Promise<Database> | null = null;

export function getDb(): Promise<Database> {
  if (db) return Promise.resolve(db);
  if (!initPromise) {
    initPromise = (async () => {
      const SQL = await initSqlJs({ locateFile: () => wasmUrl });
      SQLModule = SQL;
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {
        // localStorage unavailable (e.g. strict private mode), fallback to in-memory
      }
      try {
        db = saved ? new SQL.Database(fromBase64(saved)) : new SQL.Database();
      } catch {
        db = new SQL.Database();
      }
      db.run(SCHEMA_SQL);
      migrate(db);
      const empty = db.exec("SELECT COUNT(*) AS c FROM leads")[0]?.values[0]?.[0] === 0;
      const noProjects = db.exec("SELECT COUNT(*) AS c FROM projects")[0]?.values[0]?.[0] === 0;
      const noClients = db.exec("SELECT COUNT(*) AS c FROM clients")[0]?.values[0]?.[0] === 0;
      if (adminConfig.seedDemoData) {
        if (empty) seedDemo(db);
        if (noProjects) seedProjects(db);
        if (noClients) seedClients(db);
      }
      if (empty || noProjects) scheduleSave();
      return db;
    })();
  }
  return initPromise;
}

export function scheduleSave(immediate = false) {
  if (saveTimer) clearTimeout(saveTimer);
  const doSave = () => {
    if (!db) return;
    try {
      localStorage.setItem(STORAGE_KEY, toBase64(db.export()));
      syncChannel?.postMessage("db_updated");
    } catch {
      /* storage full — ignore in demo */
    }
  };
  if (immediate) {
    doSave();
  } else {
    saveTimer = setTimeout(doSave, 300);
  }
}

/** Adds columns introduced after a user may already have a saved database. */
function migrate(d: Database) {
  const hasColumn = (table: string, column: string) => {
    const info = d.exec(`PRAGMA table_info(${table})`);
    if (!info.length) return true;
    const nameIdx = info[0].columns.indexOf("name");
    return info[0].values.some((row) => row[nameIdx] === column);
  };
  if (!hasColumn("projects", "link")) {
    d.run("ALTER TABLE projects ADD COLUMN link TEXT DEFAULT ''");
  }

  // Optimize query performance with indices
  d.run(`
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort, visible);
    CREATE INDEX IF NOT EXISTS idx_client_projects ON client_projects(client_id);
    CREATE INDEX IF NOT EXISTS idx_milestones_proj ON milestones(project_id, sort);
    CREATE INDEX IF NOT EXISTS idx_messages_client ON messages(client_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_files_client ON client_files(client_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
    CREATE INDEX IF NOT EXISTS idx_views_path ON page_views(path);
  `);
}

function rowsToObjects<T>(d: Database, sql: string, params: unknown[] = []): T[] {
  const stmt = d.prepare(sql);
  stmt.bind(params as (string | number | null)[]);
  const out: T[] = [];
  while (stmt.step()) out.push(stmt.getAsObject() as T);
  stmt.free();
  return out;
}

function logActivity(kind: string, detail: string) {
  if (!db) return;
  db.run("INSERT INTO activity (kind, detail, created_at) VALUES (?, ?, ?)", [
    kind,
    detail,
    new Date().toISOString(),
  ]);
}

/* ------------------------------------------------------------------ */
/* leads                                                                */
/* ------------------------------------------------------------------ */
export interface NewLead {
  name: string;
  email: string;
  company?: string;
  types?: string;
  budget?: string;
  message?: string;
  source?: string;
}

export async function addLead(input: NewLead): Promise<number> {
  const d = await getDb();
  d.run(
    `INSERT INTO leads (name, email, company, types, budget, message, source, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', '', ?)`,
    [
      input.name,
      input.email,
      input.company ?? "",
      input.types ?? "",
      input.budget ?? "",
      input.message ?? "",
      input.source ?? "contact",
      new Date().toISOString(),
    ],
  );
  const id = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;
  logActivity("lead", `New lead from ${input.name} (${input.email})`);
  scheduleSave();
  notify();

  // Async dispatch to any linked live backends (Resend, Webhook, Telegram, Formspree)
  dispatchToBackend("lead", {
    leadId: id,
    name: input.name,
    email: input.email,
    company: input.company,
    types: input.types,
    budget: input.budget,
    message: input.message,
    source: input.source,
  }).catch((err) => console.warn("Backend dispatch failed:", err));

  return id;
}

export async function listLeads(): Promise<Lead[]> {
  const d = await getDb();
  return rowsToObjects<Lead>(d, "SELECT * FROM leads ORDER BY created_at DESC");
}

export async function setLeadStatus(id: number, status: LeadStatus): Promise<void> {
  const d = await getDb();
  d.run("UPDATE leads SET status = ? WHERE id = ?", [status, id]);
  const lead = rowsToObjects<Lead>(d, "SELECT * FROM leads WHERE id = ?", [id])[0];
  if (lead) logActivity("status", `${lead.name} → ${status}`);
  scheduleSave();
  notify();
}

export async function setLeadNotes(id: number, notes: string): Promise<void> {
  const d = await getDb();
  d.run("UPDATE leads SET notes = ? WHERE id = ?", [notes, id]);
  scheduleSave();
  notify();
}

export async function deleteLead(id: number): Promise<void> {
  const d = await getDb();
  const lead = rowsToObjects<Lead>(d, "SELECT * FROM leads WHERE id = ?", [id])[0];
  d.run("DELETE FROM leads WHERE id = ?", [id]);
  if (lead) logActivity("delete", `Deleted lead from ${lead.name}`);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* subscribers                                                          */
/* ------------------------------------------------------------------ */
export async function addSubscriber(email: string): Promise<{ ok: boolean; duplicate: boolean }> {
  const d = await getDb();
  const normalized = email.trim().toLowerCase();
  const existing = rowsToObjects<Subscriber>(d, "SELECT id FROM subscribers WHERE lower(email) = ?", [normalized]);
  if (existing.length > 0) return { ok: true, duplicate: true };
  d.run("INSERT INTO subscribers (email, created_at) VALUES (?, ?)", [normalized, new Date().toISOString()]);
  logActivity("newsletter", `${normalized} subscribed to the newsletter`);
  scheduleSave();
  notify();

  // Async dispatch to linked live backends
  dispatchToBackend("subscriber", { email }).catch((err) =>
    console.warn("Backend dispatch failed:", err),
  );

  return { ok: true, duplicate: false };
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const d = await getDb();
  return rowsToObjects<Subscriber>(d, "SELECT * FROM subscribers ORDER BY created_at DESC");
}

/* ------------------------------------------------------------------ */
/* activity                                                             */
/* ------------------------------------------------------------------ */
export async function listActivity(limit = 8): Promise<ActivityItem[]> {
  const d = await getDb();
  return rowsToObjects<ActivityItem>(d, "SELECT * FROM activity ORDER BY id DESC LIMIT ?", [limit]);
}

/* ------------------------------------------------------------------ */
/* analytics                                                            */
/* ------------------------------------------------------------------ */
export interface Kpis {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  wonLeads: number;
  lostLeads: number;
  conversionRate: number;
  subscribers: number;
  leadsLast30d: { label: string; date: string; value: number }[];
  demand: { label: string; value: number }[];
  weeklyTrend: number;
}

export async function getKpis(): Promise<Kpis> {
  const d = await getDb();
  const leads = rowsToObjects<Lead>(d, "SELECT * FROM leads");
  const subs = rowsToObjects<Subscriber>(d, "SELECT * FROM subscribers");

  const byStatus: Record<LeadStatus, number> = { new: 0, contacted: 0, won: 0, lost: 0 };
  leads.forEach((l) => {
    if (l.status in byStatus) byStatus[l.status]++;
  });

  // last 30 days series
  const days: { label: string; date: string; value: number }[] = [];
  const now = new Date();
  const dayMs = 86400000;
  const counts: Record<string, number> = {};
  leads.forEach((l) => {
    const key = l.created_at.slice(0, 10);
    counts[key] = (counts[key] ?? 0) + 1;
  });
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now.getTime() - i * dayMs);
    const key = day.toISOString().slice(0, 10);
    days.push({
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      date: key,
      value: counts[key] ?? 0,
    });
  }

  // service demand from `types` (comma separated)
  const demandMap: Record<string, number> = {};
  leads.forEach((l) => {
    l.types.split(",").forEach((t) => {
      const k = t.trim();
      if (k) demandMap[k] = (demandMap[k] ?? 0) + 1;
    });
  });
  const demand = Object.entries(demandMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const resolved = byStatus.won + byStatus.lost;
  const conversionRate = resolved > 0 ? Math.round((byStatus.won / resolved) * 100) : 0;

  // weekly trend: leads in last 7d vs previous 7d
  const inRange = (iso: string, from: number, to: number) => {
    const t = new Date(iso).getTime();
    return t >= from && t < to;
  };
  const last7 = leads.filter((l) => inRange(l.created_at, now.getTime() - 7 * dayMs, now.getTime())).length;
  const prev7 = leads.filter((l) =>
    inRange(l.created_at, now.getTime() - 14 * dayMs, now.getTime() - 7 * dayMs),
  ).length;
  const weeklyTrend = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;

  return {
    totalLeads: leads.length,
    newLeads: byStatus.new,
    contactedLeads: byStatus.contacted,
    wonLeads: byStatus.won,
    lostLeads: byStatus.lost,
    conversionRate,
    subscribers: subs.length,
    leadsLast30d: days,
    demand,
    weeklyTrend,
  };
}

/* ------------------------------------------------------------------ */
/* demo seed — only runs on first launch when the DB is empty           */
/* ------------------------------------------------------------------ */
function seedDemo(d: Database) {
  const now = Date.now();
  const day = 86400000;
  const demo: Array<[string, string, string, string, string, string, LeadStatus, number, string]> = [
    // name, email, company, types, budget, message, status, daysAgo, notes
    ["Daniel Okafor", "daniel@halcyon.fin", "Halcyon", "Product Design,Web App Development", "$25k+",
      "We need a full redesign of our banking dashboard. Current one feels dated and conversion is dropping.", "won", 1, "Booked kickoff for next week."],
    ["Priya Raman", "priya@fieldnote.io", "Fieldnote", "Website Design & Development,Web App Development", "$10k – $25k",
      "Launching a new AI note-taking product. Need a marketing site that explains it without hype.", "contacted", 1, "Sent proposal, awaiting reply."],
    ["Tom Lindqvist", "tom@kestrel.se", "Kestrel", "Brand Identity,Website Design & Development", "$10k – $25k",
      "Rebranding our drone logistics company. Want something sharp, minimal, industrial.", "won", 2, ""],
    ["Sofia Marchetti", "sofia@orbital.dev", "Orbital", "Product Design", "$10k – $25k",
      "Building an analytics dashboard for DevOps teams. Need design system + core screens.", "contacted", 3, ""],
    ["James Whitfield", "james@northwind.co", "Northwind", "Website Design & Development,IT Support & Services", "$5k – $10k",
      "Our Squarespace site is slow and ugly. Want something fast and custom, plus help maintaining it.", "new", 4, ""],
    ["Amara Diallo", "amara@lumenlabs.ai", "Lumen Labs", "Brand Identity,Product Design", "$25k+",
      "Series A startup, raising in Q4. Need identity + pitch site before the roadshow.", "contacted", 5, "Intro call scheduled."],
    ["Lukas Meyer", "lukas@arcadia.earth", "Arcadia", "Website Design & Development", "$5k – $10k",
      "Climate non-profit. Need a story-driven site for our annual report.", "lost", 7, "Went with an agency."],
    ["Hannah Berg", "hannah@monoandco.com", "Mono & Co.", "Product Design,Website Design & Development", "$10k – $25k",
      "Furniture e-commerce. Want a site that feels like a gallery.", "new", 9, ""],
    ["Ravi Patel", "ravi@fieldnote.io", "Fieldnote", "Website Design & Development,Desktop App Development", "$5k – $10k",
      "Referral from Priya — landing page for our mobile app launch, plus a desktop companion.", "won", 12, "Deposit paid."],
    ["Elena Petrova", "elena@halcyon.fin", "Halcyon", "Product Design,Web App Development", "$25k+",
      "Phase two of the dashboard: web app and design system handoff.", "contacted", 15, ""],
    ["Marcus Chen", "marcus@kestrel.se", "Kestrel", "Brand Identity", "< $5k",
      "Need a logo refresh for our new sub-brand.", "lost", 18, "Budget too low."],
    ["Clara Jensen", "clara@orbital.dev", "Orbital", "Product Design,Web App Development", "$10k – $25k",
      "Marketing site refresh + onboarding flow redesign.", "new", 22, ""],
    ["Yuki Tanaka", "yuki@lumenlabs.ai", "Lumen Labs", "Website Design & Development", "$10k – $25k",
      "Careers page and culture section.", "contacted", 27, ""],
    ["Omar Farouk", "omar@northwind.co", "Northwind", "Website Design & Development,Brand Identity,IT Support & Services", "$5k – $10k",
      "Complete rebrand + new site for our consulting arm, plus ongoing IT support.", "new", 33, ""],
  ];

  demo.forEach(([name, email, company, types, budget, message, status, daysAgo, notes]) => {
    d.run(
      `INSERT INTO leads (name, email, company, types, budget, message, source, status, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'contact', ?, ?, ?)`,
      [name, email, company, types, budget, message, status, notes, new Date(now - daysAgo * day).toISOString()],
    );
  });

  const subs = [
    "daniel@halcyon.fin", "priya@fieldnote.io", "tom@kestrel.se", "sofia@orbital.dev",
    "james@northwind.co", "amara@lumenlabs.ai", "lukas@arcadia.earth", "hannah@monoandco.com",
    "ravi@fieldnote.io", "elena@halcyon.fin", "clara@orbital.dev", "yuki@lumenlabs.ai",
    "omar@northwind.co", "newsletter@arcdigital.com", "hello@studio-north.com", "max@pixelcraft.io",
  ];
  subs.forEach((email, i) => {
    d.run("INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)", [
      email,
      new Date(now - (subs.length - i) * 2 * day).toISOString(),
    ]);
  });

  const acts: Array<[string, string, number]> = [
    ["lead", "New lead from Daniel Okafor (daniel@halcyon.fin)", 1],
    ["status", "Daniel Okafor → won", 0.5],
    ["lead", "New lead from Priya Raman (priya@fieldnote.io)", 1],
    ["lead", "New lead from Tom Lindqvist (tom@kestrel.se)", 2],
    ["newsletter", "max@pixelcraft.io subscribed to the newsletter", 3],
    ["status", "Tom Lindqvist → won", 2],
    ["lead", "New lead from Sofia Marchetti (sofia@orbital.dev)", 3],
  ];
  acts.forEach(([kind, detail, daysAgo]) => {
    d.run("INSERT INTO activity (kind, detail, created_at) VALUES (?, ?, ?)", [
      kind,
      detail,
      new Date(now - daysAgo * day).toISOString(),
    ]);
  });
}

/* ------------------------------------------------------------------ */
/* demo client portal data                                              */
/* ------------------------------------------------------------------ */
function seedClients(d: Database) {
  const now = Date.now();
  const day = 86400000;
  const clients: Array<[string, string, string, string]> = [
    ["Daniel Okafor", "daniel@halcyon.fin", "Halcyon", "HALCYON-2026"],
    ["Priya Raman", "priya@fieldnote.io", "Fieldnote", "FIELDNOTE-2026"],
  ];
  clients.forEach(([name, email, company, code], ci) => {
    d.run("INSERT INTO clients (name, email, company, access_code, created_at) VALUES (?, ?, ?, ?, ?)", [
      name, email, company, code, new Date(now - (40 - ci * 10) * day).toISOString(),
    ]);
    const clientId = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;

    // project
    d.run(
      "INSERT INTO client_projects (client_id, name, phase, progress, summary, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        clientId,
        ci === 0 ? "Banking Dashboard Redesign" : "Marketing Site & Onboarding",
        ci === 0 ? "Build" : "Review",
        ci === 0 ? 62 : 85,
        ci === 0
          ? "A complete redesign of the customer banking dashboard with a new design system and mobile-first flows."
          : "A fast, story-driven marketing site plus a rebuilt onboarding flow.",
        "",
        new Date(now - 35 * day).toISOString(),
      ],
    );
    const projectId = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;

    const mss: Array<[string, string, number]> =
      ci === 0
        ? [["Kickoff & research", "2026-01-10", 1], ["Wireframes approved", "2026-02-02", 1], ["UI design system", "2026-03-05", 1], ["Development sprint 1", "2026-03-28", 0], ["Launch", "2026-05-15", 0]]
        : [["Content strategy", "2026-01-20", 1], ["Design concepts", "2026-02-14", 1], ["Build & CMS", "2026-03-20", 1], ["Final review", "2026-04-10", 0], ["Go live", "2026-04-25", 0]];
    mss.forEach(([title, due, done], i) => {
      d.run("INSERT INTO milestones (project_id, title, due, done, sort) VALUES (?, ?, ?, ?, ?)", [projectId, title, due, done, i]);
    });

    // messages
    const msgs: Array<["client" | "studio", string, number]> =
      ci === 0
        ? [
            ["studio", "Hi Daniel — kickoff went great! I've shared the initial research notes in Files.", 30],
            ["client", "Looks fantastic. The team is really excited about the new flows.", 28],
            ["studio", "Sprint 1 of the build starts Monday. I'll post progress every Friday.", 12],
            ["client", "Perfect, thanks. Any blockers I should know about?", 3],
          ]
        : [
            ["studio", "Hi Priya — the staging site is ready for your review.", 20],
            ["client", "Just went through it. Love the new onboarding, one tiny copy tweak on the pricing page.", 6],
          ];
    msgs.forEach(([sender, body, daysAgo]) => {
      d.run("INSERT INTO messages (client_id, sender, body, read, created_at) VALUES (?, ?, ?, 1, ?)", [
        clientId, sender, body, new Date(now - daysAgo * day).toISOString(),
      ]);
    });

    // invoices
    const invs: Array<[string, number, string, string, string]> =
      ci === 0
        ? [["INV-1042", 12000, "paid", "2026-01-12", "2026-01-26"], ["INV-1049", 12000, "sent", "2026-02-20", "2026-03-06"], ["INV-1055", 8000, "draft", "2026-03-22", "2026-04-05"]]
        : [["INV-2081", 6500, "paid", "2026-01-25", "2026-02-08"], ["INV-2090", 6500, "overdue", "2026-02-28", "2026-03-14"]];
    invs.forEach(([number, amount, status, issued, due]) => {
      d.run(
        "INSERT INTO invoices (client_id, number, amount, currency, status, issued, due, notes, created_at) VALUES (?, ?, ?, 'USD', ?, ?, ?, '', ?)",
        [clientId, number, amount, status, issued, due, new Date(now - 25 * day).toISOString()],
      );
    });

    // a shared document placeholder (no binary data in seed)
    d.run(
      "INSERT INTO client_files (client_id, name, size, type, data, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [clientId, ci === 0 ? "Research-notes.pdf" : "Content-plan.pdf", 0, "application/pdf", "", "studio", new Date(now - 30 * day).toISOString()],
    );
  });
}

/* ------------------------------------------------------------------ */
/* demo projects — same work shown on the public site                   */
/* ------------------------------------------------------------------ */
function seedProjects(d: Database) {
  const projects: Array<[string, string, string, string, string, string, "large" | "small", string]> = [
    [
      "Halcyon Banking Redesign",
      "Halcyon",
      "Product",
      "2025",
      "https://images.pexels.com/photos/33797643/pexels-photo-33797643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "from-violet-500/40",
      "large",
      "https://example.com/halcyon",
    ],
    [
      "Fieldnote Marketing Site",
      "Fieldnote",
      "Web",
      "2025",
      "https://images.pexels.com/photos/9999716/pexels-photo-9999716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
      "from-amber-500/40",
      "small",
      "https://example.com/fieldnote",
    ],
    [
      "Kestrel Identity System",
      "Kestrel",
      "Brand",
      "2024",
      "https://images.pexels.com/photos/29450014/pexels-photo-29450014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
      "from-pink-500/40",
      "small",
      "https://example.com/kestrel",
    ],
    [
      "Orbital Analytics Dashboard",
      "Orbital",
      "Product",
      "2024",
      "https://images.pexels.com/photos/34939150/pexels-photo-34939150.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "from-blue-500/40",
      "large",
      "https://example.com/orbital",
    ],
  ];
  projects.forEach(([title, client, category, year, image, tone, size, link], i) => {
    d.run(
      `INSERT INTO projects (title, client, category, year, image, tone, size, link, visible, sort, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [title, client, category, year, image, tone, size, link, i, new Date(Date.now() - (projects.length - i) * 7 * 86400000).toISOString()],
    );
  });
}

/* ------------------------------------------------------------------ */
/* projects                                                             */
/* ------------------------------------------------------------------ */
export async function listProjects(includeHidden = true): Promise<Project[]> {
  const d = await getDb();
  const sql = includeHidden
    ? "SELECT * FROM projects ORDER BY sort ASC, id ASC"
    : "SELECT * FROM projects WHERE visible = 1 ORDER BY sort ASC, id ASC";
  return rowsToObjects<Project>(d, sql);
}

export type NewProject = Omit<Project, "id" | "created_at" | "visible" | "sort" | "link"> & {
  visible?: number;
  link?: string;
};

export async function addProject(p: NewProject): Promise<number> {
  const d = await getDb();
  const maxSort = d.exec("SELECT COALESCE(MAX(sort), 0) AS m FROM projects")[0]?.values[0]?.[0] as number;
  d.run(
    `INSERT INTO projects (title, client, category, year, image, tone, size, link, visible, sort, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.title,
      p.client,
      p.category,
      p.year,
      p.image,
      p.tone,
      p.size,
      p.link ?? "",
      p.visible ?? 1,
      maxSort + 1,
      new Date().toISOString(),
    ],
  );
  const id = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;
  logActivity("project", `Project “${p.title}” added`);
  scheduleSave();
  notify();
  return id;
}

export async function updateProject(id: number, patch: Partial<Project>): Promise<void> {
  const d = await getDb();
  const current = rowsToObjects<Project>(d, "SELECT * FROM projects WHERE id = ?", [id])[0];
  if (!current) return;
  const next = { ...current, ...patch };
  d.run(
    `UPDATE projects SET title=?, client=?, category=?, year=?, image=?, tone=?, size=?, link=?, visible=? WHERE id=?`,
    [
      next.title,
      next.client,
      next.category,
      next.year,
      next.image,
      next.tone,
      next.size,
      next.link,
      next.visible,
      id,
    ],
  );
  logActivity("project", `Project “${next.title}” updated`);
  scheduleSave();
  notify();
}

export async function deleteProject(id: number): Promise<void> {
  const d = await getDb();
  const p = rowsToObjects<Project>(d, "SELECT * FROM projects WHERE id = ?", [id])[0];
  d.run("DELETE FROM projects WHERE id = ?", [id]);
  if (p) logActivity("project", `Project “${p.title}” deleted`);
  scheduleSave();
  notify();
}

export async function reorderProjects(orderedIds: number[]): Promise<void> {
  const d = await getDb();
  d.run("BEGIN TRANSACTION");
  try {
    orderedIds.forEach((id, i) => d.run("UPDATE projects SET sort = ? WHERE id = ?", [i, id]));
    d.run("COMMIT");
  } catch (err) {
    d.run("ROLLBACK");
    throw err;
  }
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* page views + analytics                                               */
/* ------------------------------------------------------------------ */
export async function trackView(path: string, title: string): Promise<void> {
  const d = await getDb();
  d.run("INSERT INTO page_views (path, title, created_at) VALUES (?, ?, ?)", [
    path,
    title,
    new Date().toISOString(),
  ]);
  scheduleSave();
  notify();
}

export interface AnalyticsData {
  totalViews: number;
  uniqueDays: number;
  avgPerDay: number;
  viewsLast14d: { label: string; value: number }[];
  pages: { label: string; path: string; views: number }[];
  projectViews: { title: string; views: number }[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const d = await getDb();
  const views = rowsToObjects<PageView>(d, "SELECT * FROM page_views");
  const projects = rowsToObjects<Project>(d, "SELECT id, title FROM projects");
  const projectTitles = new Map(projects.map((p) => [`project:${p.id}`, p.title]));

  const dayMs = 86400000;
  const now = new Date();
  const dayCounts: Record<string, number> = {};
  const pageCounts: Record<string, { path: string; title: string; views: number }> = {};
  const projectCounts: Record<string, number> = {};

  views.forEach((v) => {
    const key = v.created_at.slice(0, 10);
    dayCounts[key] = (dayCounts[key] ?? 0) + 1;

    if (v.path.startsWith("project:")) {
      const title = projectTitles.get(v.path) ?? (v.title || v.path);
      projectCounts[title] = (projectCounts[title] ?? 0) + 1;
    } else {
      const label = v.title || v.path || "/";
      if (!pageCounts[v.path]) pageCounts[v.path] = { path: v.path, title: label, views: 0 };
      pageCounts[v.path].views++;
      if (label && !pageCounts[v.path].title) pageCounts[v.path].title = label;
    }
  });

  const days: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now.getTime() - i * dayMs);
    const key = day.toISOString().slice(0, 10);
    days.push({
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: dayCounts[key] ?? 0,
    });
  }

  const pages = Object.values(pageCounts)
    .map((p) => ({ label: p.title, path: p.path, views: p.views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const projectViews = Object.entries(projectCounts)
    .map(([title, views]) => ({ title, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const uniqueDays = Object.keys(dayCounts).length;
  return {
    totalViews: views.length,
    uniqueDays,
    avgPerDay: uniqueDays > 0 ? Math.round(views.length / uniqueDays) : 0,
    viewsLast14d: days,
    pages,
    projectViews,
  };
}

/* ------------------------------------------------------------------ */
/* settings                                                             */
/* ------------------------------------------------------------------ */
export async function getAllSettings(): Promise<Record<string, string>> {
  const d = await getDb();
  const rows = rowsToObjects<{ key: string; value: string }>(d, "SELECT key, value FROM settings");
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSetting(key: string): Promise<string | null> {
  const d = await getDb();
  const rows = rowsToObjects<{ value: string }>(d, "SELECT value FROM settings WHERE key = ?", [key]);
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const d = await getDb();
  d.run(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* database export / import / reset                                     */
/* ------------------------------------------------------------------ */
export async function exportDatabaseFile(): Promise<Uint8Array> {
  const d = await getDb();
  return d.export();
}

export async function importDatabaseFile(bytes: Uint8Array): Promise<void> {
  if (!SQLModule) throw new Error("SQL module not initialised");
  const imported = new SQLModule.Database(bytes);
  imported.run(SCHEMA_SQL);
  db?.close();
  db = imported;
  scheduleSave();
  logActivity("system", "Database imported from file");
  notify();
}

export function resetDatabase(): void {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

export async function clearAllData(): Promise<void> {
  const d = await getDb();
  d.run(`
    DELETE FROM leads;
    DELETE FROM subscribers;
    DELETE FROM activity;
    DELETE FROM projects;
    DELETE FROM page_views;
    DELETE FROM settings;
    DELETE FROM clients;
    DELETE FROM client_projects;
    DELETE FROM milestones;
    DELETE FROM messages;
    DELETE FROM client_files;
    DELETE FROM invoices;
  `);
  logActivity("system", "All data cleared");
  scheduleSave(true);
  notify();
}

/* ------------------------------------------------------------------ */
/* clients                                                              */
/* ------------------------------------------------------------------ */
export async function listClients(): Promise<Client[]> {
  const d = await getDb();
  return rowsToObjects<Client>(d, "SELECT * FROM clients ORDER BY created_at DESC");
}

export async function findClientByEmail(email: string): Promise<Client | null> {
  const d = await getDb();
  const rows = rowsToObjects<Client>(d, "SELECT * FROM clients WHERE lower(email) = lower(?)", [email.trim()]);
  return rows[0] ?? null;
}

export async function addClient(input: { name: string; email: string; company?: string; access_code: string }) {
  const d = await getDb();
  d.run("INSERT INTO clients (name, email, company, access_code, created_at) VALUES (?, ?, ?, ?, ?)", [
    input.name.trim(),
    input.email.trim(),
    input.company?.trim() ?? "",
    input.access_code.trim(),
    new Date().toISOString(),
  ]);
  const id = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;
  logActivity("client", `Client “${input.name}” added`);
  scheduleSave();
  notify();
  return id;
}

export async function updateClient(id: number, patch: Partial<Client>): Promise<void> {
  const d = await getDb();
  const cur = rowsToObjects<Client>(d, "SELECT * FROM clients WHERE id = ?", [id])[0];
  if (!cur) return;
  const n = { ...cur, ...patch };
  d.run("UPDATE clients SET name=?, email=?, company=?, access_code=? WHERE id=?", [
    n.name, n.email, n.company, n.access_code, id,
  ]);
  scheduleSave();
  notify();
}

export async function deleteClient(id: number): Promise<void> {
  const d = await getDb();
  const c = rowsToObjects<Client>(d, "SELECT * FROM clients WHERE id = ?", [id])[0];
  d.run("DELETE FROM messages WHERE client_id = ?", [id]);
  d.run("DELETE FROM client_files WHERE client_id = ?", [id]);
  d.run("DELETE FROM invoices WHERE client_id = ?", [id]);
  const projs = rowsToObjects<ClientProject>(d, "SELECT id FROM client_projects WHERE client_id = ?", [id]);
  projs.forEach((p) => d.run("DELETE FROM milestones WHERE project_id = ?", [p.id]));
  d.run("DELETE FROM client_projects WHERE client_id = ?", [id]);
  d.run("DELETE FROM clients WHERE id = ?", [id]);
  if (c) logActivity("client", `Client “${c.name}” removed`);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* client projects + milestones                                         */
/* ------------------------------------------------------------------ */
export async function listClientProjects(clientId?: number): Promise<ClientProject[]> {
  const d = await getDb();
  return clientId
    ? rowsToObjects<ClientProject>(d, "SELECT * FROM client_projects WHERE client_id = ? ORDER BY id DESC", [clientId])
    : rowsToObjects<ClientProject>(d, "SELECT * FROM client_projects ORDER BY id DESC");
}

export async function addClientProject(input: {
  client_id: number;
  name: string;
  phase?: string;
  progress?: number;
  summary?: string;
  link?: string;
}): Promise<number> {
  const d = await getDb();
  d.run(
    "INSERT INTO client_projects (client_id, name, phase, progress, summary, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [input.client_id, input.name.trim(), input.phase ?? "Discovery", input.progress ?? 0, input.summary ?? "", input.link ?? "", new Date().toISOString()],
  );
  const id = d.exec("SELECT last_insert_rowid() AS id")[0].values[0][0] as number;
  logActivity("project", `Client project “${input.name}” created`);
  scheduleSave();
  notify();
  return id;
}

export async function updateClientProject(id: number, patch: Partial<ClientProject>): Promise<void> {
  const d = await getDb();
  const cur = rowsToObjects<ClientProject>(d, "SELECT * FROM client_projects WHERE id = ?", [id])[0];
  if (!cur) return;
  const n = { ...cur, ...patch };
  d.run("UPDATE client_projects SET name=?, phase=?, progress=?, summary=?, link=? WHERE id=?", [
    n.name, n.phase, n.progress, n.summary, n.link, id,
  ]);
  scheduleSave();
  notify();
}

export async function deleteClientProject(id: number): Promise<void> {
  const d = await getDb();
  d.run("DELETE FROM milestones WHERE project_id = ?", [id]);
  d.run("DELETE FROM client_projects WHERE id = ?", [id]);
  scheduleSave();
  notify();
}

export async function listMilestones(projectId: number): Promise<Milestone[]> {
  const d = await getDb();
  return rowsToObjects<Milestone>(d, "SELECT * FROM milestones WHERE project_id = ? ORDER BY sort ASC, id ASC", [projectId]);
}

export async function listAllMilestones(): Promise<Milestone[]> {
  const d = await getDb();
  return rowsToObjects<Milestone>(d, "SELECT * FROM milestones");
}

export async function addMilestone(projectId: number, title: string, due = ""): Promise<void> {
  const d = await getDb();
  const res = d.exec("SELECT COALESCE(MAX(sort), 0) AS m FROM milestones WHERE project_id = ?", [projectId]);
  const max = (res[0]?.values[0]?.[0] as number) ?? 0;
  d.run("INSERT INTO milestones (project_id, title, due, done, sort) VALUES (?, ?, ?, 0, ?)", [projectId, title.trim(), due, max + 1]);
  scheduleSave();
  notify();
}

export async function toggleMilestone(id: number, done: number): Promise<void> {
  const d = await getDb();
  d.run("UPDATE milestones SET done = ? WHERE id = ?", [done ? 1 : 0, id]);
  scheduleSave();
  notify();
}

export async function deleteMilestone(id: number): Promise<void> {
  const d = await getDb();
  d.run("DELETE FROM milestones WHERE id = ?", [id]);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* messages                                                             */
/* ------------------------------------------------------------------ */
export async function listMessages(clientId: number): Promise<Message[]> {
  const d = await getDb();
  return rowsToObjects<Message>(d, "SELECT * FROM messages WHERE client_id = ? ORDER BY created_at ASC", [clientId]);
}

export async function listAllMessages(): Promise<Message[]> {
  const d = await getDb();
  return rowsToObjects<Message>(d, "SELECT * FROM messages ORDER BY created_at DESC");
}

export async function addMessage(clientId: number, sender: "client" | "studio", body: string): Promise<void> {
  const d = await getDb();
  d.run("INSERT INTO messages (client_id, sender, body, read, created_at) VALUES (?, ?, ?, 0, ?)", [
    clientId, sender, body.trim(), new Date().toISOString(),
  ]);
  if (sender === "client") {
    logActivity("message", `New message from client #${clientId}`);
    const client = rowsToObjects<Client>(d, "SELECT name, email FROM clients WHERE id = ?", [clientId])[0];
    dispatchToBackend("client_message", {
      clientId,
      clientName: client?.name || `Client #${clientId}`,
      clientEmail: client?.email || "",
      body: body.trim(),
    }).catch((err) => console.warn("Backend dispatch failed:", err));
  }
  scheduleSave(true);
  notify();
}

export async function markMessagesRead(clientId: number, sender: "client" | "studio"): Promise<void> {
  const d = await getDb();
  d.run("UPDATE messages SET read = 1 WHERE client_id = ? AND sender = ? AND read = 0", [clientId, sender]);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* client files                                                         */
/* ------------------------------------------------------------------ */
export async function listFiles(clientId: number): Promise<ClientFile[]> {
  const d = await getDb();
  return rowsToObjects<ClientFile>(d, "SELECT * FROM client_files WHERE client_id = ? ORDER BY created_at DESC", [clientId]);
}

export async function addFile(input: {
  client_id: number;
  name: string;
  size: number;
  type: string;
  data: string;
  uploaded_by: "client" | "studio";
}): Promise<void> {
  const d = await getDb();
  d.run(
    "INSERT INTO client_files (client_id, name, size, type, data, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [input.client_id, input.name, input.size, input.type, input.data, input.uploaded_by, new Date().toISOString()],
  );
  scheduleSave();
  notify();
}

export async function deleteFile(id: number): Promise<void> {
  const d = await getDb();
  d.run("DELETE FROM client_files WHERE id = ?", [id]);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* invoices                                                             */
/* ------------------------------------------------------------------ */
export async function listInvoices(clientId?: number): Promise<Invoice[]> {
  const d = await getDb();
  return clientId
    ? rowsToObjects<Invoice>(d, "SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC", [clientId])
    : rowsToObjects<Invoice>(d, "SELECT * FROM invoices ORDER BY created_at DESC");
}

export async function addInvoice(input: {
  client_id: number;
  number: string;
  amount: number;
  currency?: string;
  status?: InvoiceStatus;
  issued?: string;
  due?: string;
  notes?: string;
}): Promise<void> {
  const d = await getDb();
  d.run(
    "INSERT INTO invoices (client_id, number, amount, currency, status, issued, due, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      input.client_id, input.number.trim(), input.amount, input.currency ?? "USD",
      input.status ?? "draft", input.issued ?? new Date().toISOString().slice(0, 10),
      input.due ?? "", input.notes ?? "", new Date().toISOString(),
    ],
  );
  scheduleSave();
  notify();
}

export async function updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<void> {
  const d = await getDb();
  d.run("UPDATE invoices SET status = ? WHERE id = ?", [status, id]);
  const inv = rowsToObjects<Invoice>(d, "SELECT * FROM invoices WHERE id = ?", [id])[0];
  if (inv) logActivity("invoice", `Invoice ${inv.number} → ${status}`);
  scheduleSave();
  notify();
}

export async function deleteInvoice(id: number): Promise<void> {
  const d = await getDb();
  d.run("DELETE FROM invoices WHERE id = ?", [id]);
  scheduleSave();
  notify();
}

/* ------------------------------------------------------------------ */
/* CSV export                                                           */
/* ------------------------------------------------------------------ */
export function toCsv(rows: object[]): string {
  if (rows.length === 0) return "";
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = Object.keys(rows[0] as Record<string, unknown>);
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    const rec = r as Record<string, unknown>;
    lines.push(headers.map((h) => esc(rec[h])).join(","));
  });
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
