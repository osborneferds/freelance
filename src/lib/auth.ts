import { adminConfig } from "../config";
import { getSetting, setSetting } from "../db/database";

const SESSION_KEY = "of_admin_session";
const ATTEMPTS_KEY = "of_admin_attempts";
const HASH_SETTING_KEY = "admin_password_hash";

export interface Session {
  user: string;
  expiresAt: number;
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ------------------------------------------------------------------ */
/* session                                                             */
/* ------------------------------------------------------------------ */
export function getSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s.expiresAt || Date.now() > s.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function isAuthed(): boolean {
  return getSession() !== null;
}

function startSession(user: string) {
  const session: Session = {
    user,
    expiresAt: Date.now() + adminConfig.sessionMinutes * 60 * 1000,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Refreshes the session expiry while the admin is active. */
export function touchSession() {
  const s = getSession();
  if (s) startSession(s.user);
}

/* ------------------------------------------------------------------ */
/* failed-attempt lockout                                              */
/* ------------------------------------------------------------------ */
interface Attempts {
  count: number;
  lockedUntil: number;
}

function readAttempts(): Attempts {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? '{"count":0,"lockedUntil":0}') as Attempts;
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeAttempts(a: Attempts) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(a));
}

export function lockoutRemainingMs(): number {
  const a = readAttempts();
  return Math.max(0, a.lockedUntil - Date.now());
}

/* ------------------------------------------------------------------ */
/* password                                                            */
/* ------------------------------------------------------------------ */
async function currentHash(): Promise<string> {
  return (await getSetting(HASH_SETTING_KEY)) || adminConfig.passwordHash;
}

export async function changePassword(newPassword: string): Promise<void> {
  await setSetting(HASH_SETTING_KEY, await sha256(newPassword));
}

/** Checks a password without triggering lockout — used to confirm the current one. */
export async function verifyPassword(password: string): Promise<boolean> {
  return (await sha256(password)) === (await currentHash());
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const remaining = lockoutRemainingMs();
  if (remaining > 0) {
    const mins = Math.ceil(remaining / 60000);
    return { ok: false, error: `Too many attempts. Try again in ${mins} min.` };
  }

  const [userOk, passHash, expectedHash] = await Promise.all([
    Promise.resolve(username.trim().toLowerCase() === adminConfig.username.toLowerCase()),
    sha256(password),
    currentHash(),
  ]);
  const passOk = passHash === expectedHash;

  if (!userOk || !passOk) {
    const a = readAttempts();
    const count = a.count + 1;
    const lockedUntil = count >= adminConfig.maxAttempts ? Date.now() + adminConfig.lockoutMinutes * 60000 : 0;
    writeAttempts({ count: lockedUntil ? 0 : count, lockedUntil });
    const left = adminConfig.maxAttempts - count;
    return {
      ok: false,
      error: lockedUntil
        ? `Too many attempts. Locked for ${adminConfig.lockoutMinutes} min.`
        : `Invalid credentials. ${left} attempt${left === 1 ? "" : "s"} left.`,
    };
  }

  writeAttempts({ count: 0, lockedUntil: 0 });
  startSession(adminConfig.username);
  return { ok: true };
}
