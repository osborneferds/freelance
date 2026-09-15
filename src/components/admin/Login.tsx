import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { LogoMark } from "../Logo";
import { login, lockoutRemainingMs } from "../../lib/auth";
import { toast } from "../../lib/toast";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(lockoutRemainingMs() > 0);

  useEffect(() => {
    const t = setInterval(() => setLocked(lockoutRemainingMs() > 0), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const res = await login(user, pass);
    setBusy(false);
    if (res.ok) {
      toast.success("Welcome back, Osborne");
      onSuccess();
    } else {
      setError(res.error ?? "Invalid credentials.");
      setPass("");
      setShake((s) => s + 1);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-5 py-16 text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lime/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-500/25 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <a href="#/" className="mb-10 flex items-center justify-center gap-2.5 text-sm font-semibold">
          <LogoMark tone="light" className="h-8" />
          <span className="text-white/40">/ admin</span>
        </a>

        <motion.div
          key={shake}
          animate={error ? { x: [0, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur"
        >
          <h1 className="text-2xl tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-white/50">Access the leads dashboard.</p>

          <form onSubmit={submit} className="mt-6 sm:mt-8 space-y-4" onChange={() => setError(null)}>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/50">Username</span>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition-colors focus:border-lime"
                placeholder="admin"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/50">Password</span>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition-colors focus:border-lime"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </p>
            )}

          <motion.button
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={busy || locked}
            className="w-full rounded-xl bg-lime py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep disabled:opacity-60"
          >
            {busy ? "Signing in…" : locked ? "Temporarily locked" : "Sign in"}
          </motion.button>
        </form>
      </motion.div>

        <a href="#/" className="mt-8 block text-center text-xs text-white/40 transition-colors hover:text-white">
          ← Back to website
        </a>
      </motion.div>
    </div>
  );
}
