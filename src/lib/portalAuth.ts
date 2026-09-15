import { adminConfig } from "../config";
import { findClientByEmail } from "../db/database";
import type { Client } from "../db/schema";

const SESSION_KEY = "of_portal_session";
const ATTEMPTS_KEY = "of_portal_attempts";
const SHORT_SESSION_MINUTES = 60;
const LONG_SESSION_DAYS = 30;

export interface PortalSession {
  clientId: number;
  name: string;
  email: string;
  expiresAt: number;
  remember: boolean;
}

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

export function portalLockoutRemainingMs(): number {
  const a = readAttempts();
  return Math.max(0, a.lockedUntil - Date.now());
}

/* ------------------------------------------------------------------ */
/* session management                                                  */
/* ------------------------------------------------------------------ */
export function getPortalSession(): PortalSession | null {
  try {
    // Check sessionStorage first, then localStorage for "remember me"
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PortalSession;
    if (!s.expiresAt || Date.now() > s.expiresAt) {
      endPortalSession();
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function endPortalSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function touchPortalSession() {
  const s = getPortalSession();
  if (s) {
    const duration = s.remember
      ? LONG_SESSION_DAYS * 24 * 60 * 60 * 1000
      : SHORT_SESSION_MINUTES * 60 * 1000;
    s.expiresAt = Date.now() + duration;
    const payload = JSON.stringify(s);
    if (s.remember) {
      localStorage.setItem(SESSION_KEY, payload);
    } else {
      sessionStorage.setItem(SESSION_KEY, payload);
    }
  }
}

/* ------------------------------------------------------------------ */
/* login with rate limiting & lockout                                  */
/* ------------------------------------------------------------------ */
export interface PortalLoginResult {
  ok: boolean;
  client?: Client;
  error?: string;
}

export async function portalLogin(
  email: string,
  code: string,
  remember = false,
): Promise<PortalLoginResult> {
  const remaining = portalLockoutRemainingMs();
  if (remaining > 0) {
    const mins = Math.ceil(remaining / 60000);
    return { ok: false, error: `Too many attempts. Portal access locked for ${mins} min.` };
  }

  const cleanEmail = email.trim();
  const cleanCode = code.trim().toUpperCase();

  if (!cleanEmail || !cleanCode) {
    return { ok: false, error: "Please enter both your email and access code." };
  }

  const client = await findClientByEmail(cleanEmail);
  const codeMatches = client && client.access_code.trim().toUpperCase() === cleanCode;

  if (!client || !codeMatches) {
    const a = readAttempts();
    const count = a.count + 1;
    const lockedUntil =
      count >= adminConfig.maxAttempts ? Date.now() + adminConfig.lockoutMinutes * 60000 : 0;
    writeAttempts({ count: lockedUntil ? 0 : count, lockedUntil });
    const left = adminConfig.maxAttempts - count;
    return {
      ok: false,
      error: lockedUntil
        ? `Too many failed attempts. Locked out for ${adminConfig.lockoutMinutes} minutes.`
        : `Incorrect email or access code. ${left > 0 ? `${left} attempt${left === 1 ? "" : "s"} remaining.` : ""}`,
    };
  }

  // Success — clear any failed attempts
  writeAttempts({ count: 0, lockedUntil: 0 });

  const duration = remember
    ? LONG_SESSION_DAYS * 24 * 60 * 60 * 1000
    : SHORT_SESSION_MINUTES * 60 * 1000;

  const session: PortalSession = {
    clientId: client.id,
    name: client.name,
    email: client.email,
    expiresAt: Date.now() + duration,
    remember,
  };

  const payload = JSON.stringify(session);
  if (remember) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
  }

  return { ok: true, client };
}

/* ------------------------------------------------------------------ */
/* Magic link / invite URL helpers                                     */
/* ------------------------------------------------------------------ */
export function generateClientInviteUrl(client: Client): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const params = new URLSearchParams({
    portal_email: client.email,
    portal_code: client.access_code,
  });
  return `${origin}${pathname}#/portal?${params.toString()}`;
}
