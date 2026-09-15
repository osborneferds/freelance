import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "../Logo";
import {
  portalLockoutRemainingMs,
  portalLogin,
} from "../../lib/portalAuth";
import { toast } from "../../lib/toast";

export function PortalLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const [locked, setLocked] = useState(portalLockoutRemainingMs() > 0);

  // Monitor lockout countdown
  useEffect(() => {
    const t = setInterval(() => {
      const rem = portalLockoutRemainingMs();
      setLocked(rem > 0);
      if (rem <= 0 && error && error.includes("Locked out")) {
        setError(null);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [error]);

  // Check URL parameters for 1-click invite link: #/portal?portal_email=...&portal_code=...
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const qIdx = hash.indexOf("?");
      if (qIdx !== -1) {
        const query = hash.slice(qIdx + 1);
        const params = new URLSearchParams(query);
        const pEmail = params.get("portal_email");
        const pCode = params.get("portal_code");
        if (pEmail && pCode) {
          setEmail(pEmail);
          setCode(pCode);
          // Auto login via magic link
          setBusy(true);
          portalLogin(pEmail, pCode, true).then((res) => {
            setBusy(false);
            if (res.ok) {
              toast.success(`Welcome to your project hub, ${res.client?.name.split(" ")[0]}!`);
              // Clean the query string from the hash to keep the URL tidy
              window.location.hash = "#/portal";
              onSuccess();
            } else {
              setError(res.error ?? "Invalid invite link.");
            }
          });
        }
      }
    } catch {
      // ignore param parsing failure
    }
  }, [onSuccess]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || locked) return;
    setBusy(true);
    const res = await portalLogin(email, code, remember);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome back, ${res.client?.name.split(" ")[0]}`);
      onSuccess();
    } else {
      setError(res.error ?? "Could not sign in.");
      setShake((s) => s + 1);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-paper px-5 py-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lime/40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-300/30 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <a href="#/" className="mb-8 flex items-center justify-center">
          <Logo />
        </a>

        <motion.div
          key={shake}
          animate={error ? { x: [0, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="rounded-2xl sm:rounded-3xl border border-ink/10 bg-white/70 p-6 sm:p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)] backdrop-blur"
        >
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Client portal</div>
          <h1 className="mt-2 text-2xl tracking-tight">Sign in to your project</h1>
          <p className="mt-1 text-sm text-muted">
            Track progress, message me, and view files &amp; invoices.
          </p>

          <form onSubmit={submit} className="mt-6 sm:mt-8 space-y-4" onChange={() => setError(null)}>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                placeholder="you@company.com"
                required
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted">Access code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PROJECT-2026"
                required
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base uppercase tracking-wider outline-none transition-colors focus:border-ink font-mono"
              />
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-muted pt-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-ink/20 accent-ink cursor-pointer"
              />
              <span>Remember me on this device (30 days)</span>
            </label>

            {error && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: busy || locked ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={busy || locked}
              className="w-full rounded-xl bg-ink py-3.5 text-sm font-semibold text-lime transition-colors hover:bg-ink/85 disabled:opacity-60"
            >
              {busy ? "Signing in…" : locked ? "Temporarily locked" : "Enter portal"}
            </motion.button>
          </form>
        </motion.div>

        <a href="#/" className="mt-8 block text-center text-xs text-muted transition-colors hover:text-ink">
          ← Back to website
        </a>
      </motion.div>
    </div>
  );
}
