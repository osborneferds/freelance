export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT DEFAULT '',
    types TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    message TEXT DEFAULT '',
    source TEXT DEFAULT 'contact',
    status TEXT DEFAULT 'new',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    detail TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    client TEXT DEFAULT '',
    category TEXT DEFAULT 'Web',
    year TEXT DEFAULT '',
    image TEXT DEFAULT '',
    tone TEXT DEFAULT 'from-violet-500/40',
    size TEXT DEFAULT 'small',
    link TEXT DEFAULT '',
    visible INTEGER DEFAULT 1,
    sort INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    title TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT DEFAULT '',
    access_code TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS client_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phase TEXT DEFAULT 'Discovery',
    progress INTEGER DEFAULT 0,
    summary TEXT DEFAULT '',
    link TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    due TEXT DEFAULT '',
    done INTEGER DEFAULT 0,
    sort INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    sender TEXT NOT NULL,
    body TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS client_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    size INTEGER DEFAULT 0,
    type TEXT DEFAULT '',
    data TEXT DEFAULT '',
    uploaded_by TEXT DEFAULT 'studio',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    number TEXT NOT NULL,
    amount REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'draft',
    issued TEXT DEFAULT '',
    due TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
`;

export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  types: string;
  budget: string;
  message: string;
  source: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export interface ActivityItem {
  id: number;
  kind: string;
  detail: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  tone: string;
  size: "large" | "small";
  link: string;
  visible: number;
  sort: number;
  created_at: string;
}

export interface PageView {
  id: number;
  path: string;
  title: string;
  created_at: string;
}

/* ------------------------------ client portal ------------------------------ */
export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  access_code: string;
  created_at: string;
}

export interface ClientProject {
  id: number;
  client_id: number;
  name: string;
  phase: string;
  progress: number;
  summary: string;
  link: string;
  created_at: string;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  due: string;
  done: number;
  sort: number;
}

export interface Message {
  id: number;
  client_id: number;
  sender: "client" | "studio";
  body: string;
  read: number;
  created_at: string;
}

export interface ClientFile {
  id: number;
  client_id: number;
  name: string;
  size: number;
  type: string;
  data: string;
  uploaded_by: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  client_id: number;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued: string;
  due: string;
  notes: string;
  created_at: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export const INVOICE_STATUSES: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];
export const PROJECT_PHASES = ["Discovery", "Design", "Build", "Review", "Launch", "Complete"];

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];
