import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  clearAllData,
  exportDatabaseFile,
  getAllSettings,
  importDatabaseFile,
  listLeads,
  listSubscribers,
  resetDatabase,
  setSetting,
  toCsv,
} from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { changePassword, verifyPassword } from "../../lib/auth";
import { dispatchToBackend, getBackendConfig, type BackendConfig } from "../../lib/backendSync";
import { compressImage } from "../../lib/format";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";

const pwInput =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base sm:text-sm outline-none transition-colors focus:border-lime";

const PROFILE_FIELDS = [
  { key: "profile_name", label: "Display name", fallback: "Osborne Fernandes" },
  { key: "profile_email", label: "Contact email", fallback: "hello@osbornefernandes.design" },
  { key: "profile_location", label: "Location", fallback: "Philippines" },
  { key: "site_availability", label: "Availability badge", fallback: "Q3 2026" },
];

const SOCIAL_FIELDS = [
  { key: "social_github", label: "GitHub URL", placeholder: "https://github.com/yourusername", fallback: "https://github.com" },
  { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/yourprofile", fallback: "https://linkedin.com" },
  { key: "social_twitter", label: "X / Twitter URL", placeholder: "https://x.com/yourhandle", fallback: "https://x.com" },
  { key: "social_dribbble", label: "Dribbble URL", placeholder: "https://dribbble.com/yourprofile", fallback: "https://dribbble.com" },
  { key: "social_instagram", label: "Instagram URL (optional)", placeholder: "https://instagram.com/yourprofile", fallback: "" },
  { key: "social_youtube", label: "YouTube URL (optional)", placeholder: "https://youtube.com/@yourchannel", fallback: "" },
];

const NOTIFS = [
  { key: "notif_new_lead", label: "Email me when a new lead arrives", on: true },
  { key: "notif_weekly", label: "Weekly pipeline summary on Mondays", on: true },
  { key: "notif_newsletter", label: "Notify me on new subscribers", on: false },
];

export function Settings() {
  const settings = useDbData(getAllSettings);
  const leads = useDbData(listLeads);
  const subs = useDbData(listSubscribers);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const [profile, setProfile] = useState<Record<string, string>>({});
  useEffect(() => {
    if (settings) setProfile(settings);
  }, [settings]);

  // Backend Integration configuration
  const [backend, setBackend] = useState<BackendConfig>({
    webhookUrl: "",
    formspreeId: "",
    resendApiKey: "",
    resendToEmail: "",
    telegramBotToken: "",
    telegramChatId: "",
  });
  const [testingBackend, setTestingBackend] = useState(false);

  useEffect(() => {
    getBackendConfig().then((cfg) => setBackend(cfg));
  }, [settings]);

  const saveBackend = async () => {
    setBusy("backend");
    await Promise.all([
      setSetting("backend_webhook_url", backend.webhookUrl.trim()),
      setSetting("backend_formspree_id", backend.formspreeId.trim()),
      setSetting("backend_resend_key", backend.resendApiKey.trim()),
      setSetting("backend_resend_to", backend.resendToEmail.trim()),
      setSetting("backend_telegram_token", backend.telegramBotToken.trim()),
      setSetting("backend_telegram_chat", backend.telegramChatId.trim()),
    ]);
    toast.success("Backend integrations saved!");
    setBusy(null);
  };

  const testBackendConnection = async () => {
    setTestingBackend(true);
    // save first
    await Promise.all([
      setSetting("backend_webhook_url", backend.webhookUrl.trim()),
      setSetting("backend_formspree_id", backend.formspreeId.trim()),
      setSetting("backend_resend_key", backend.resendApiKey.trim()),
      setSetting("backend_resend_to", backend.resendToEmail.trim()),
      setSetting("backend_telegram_token", backend.telegramBotToken.trim()),
      setSetting("backend_telegram_chat", backend.telegramChatId.trim()),
    ]);
    const res = await dispatchToBackend("lead", {
      name: "Test Lead (Verification)",
      email: "test@example.com",
      company: "Backend Test Inc.",
      types: "Website Design & Development",
      budget: "$10k – $25k",
      message: "This is a real-time test notification confirming your backend is successfully linked to Osborne Fernandes Hub!",
    });
    setTestingBackend(false);
    if (res.sentToCloud) {
      toast.success(`Success! Dispatched test event to: ${res.providersNotified.join(", ")}`);
    } else if (res.errors.length) {
      toast.error(`Dispatch failed: ${res.errors[0]}`);
    } else {
      toast.info("No remote backend service configured yet. Fill in a Webhook, Formspree, Resend, or Telegram option below.");
    }
  };

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setBusy("profile");
    for (const f of PROFILE_FIELDS) await setSetting(f.key, (profile[f.key] ?? "").trim());
    toast.success("Saved — your website details have been updated");
    setBusy(null);
  };

  const saveSocials = async (e: FormEvent) => {
    e.preventDefault();
    setBusy("socials");
    for (const s of SOCIAL_FIELDS) await setSetting(s.key, (profile[s.key] ?? "").trim());
    toast.success("Social links updated on website!");
    setBusy(null);
  };

  const uploadHeroPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    try {
      const dataUrl = await compressImage(file, 1600);
      await setSetting("profile_hero_photo", dataUrl);
      toast.success("Hero photo updated!");
    } catch {
      toast.error("Could not process photo.");
    }
  };

  const uploadAboutPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    try {
      const dataUrl = await compressImage(file, 1600);
      await setSetting("profile_about_photo", dataUrl);
      toast.success("About photo updated!");
    } catch {
      toast.error("Could not process photo.");
    }
  };

  const resetHeroPhoto = async () => {
    await setSetting("profile_hero_photo", "");
    toast.info("Hero photo reset to default");
  };

  const resetAboutPhoto = async () => {
    await setSetting("profile_about_photo", "");
    toast.info("About photo reset to default");
  };

  const changePw = async (e: FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (pwNew.length < 8) return setPwError("New password must be at least 8 characters.");
    if (pwNew !== pwConfirm) return setPwError("New passwords do not match.");
    setBusy("pw");
    if (!(await verifyPassword(pwCurrent))) {
      setBusy(null);
      return setPwError("Current password is incorrect.");
    }
    await changePassword(pwNew);
    setBusy(null);
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    toast.success("Password updated");
  };

  const toggleNotif = async (key: string, value: boolean) => {
    await setSetting(key, value ? "1" : "0");
    toast.success("Preference updated");
  };

  const exportDb = async () => {
    setBusy("db");
    const bytes = await exportDatabaseFile();
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/x-sqlite3" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "osborne-fernandes-db.sqlite";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Database exported as .sqlite");
    setBusy(null);
  };

  const onImportFile = async (file: File) => {
    setBusy("import");
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      await importDatabaseFile(buf);
      toast.success("Database imported — reloading");
      setTimeout(() => location.reload(), 800);
    } catch {
      toast.error("Could not import that file.");
      setBusy(null);
    }
  };

  const exportLeadsCsv = () => {
    if (!leads) return;
    download("leads.csv", toCsv(leads.map((l) => ({ ...l }))));
    toast.success("Leads CSV downloaded");
  };
  const exportSubsCsv = () => {
    if (!subs) return;
    download(
      "subscribers.csv",
      toCsv(subs.map((s) => ({ id: s.id, email: s.email, created_at: s.created_at }))),
    );
    toast.success("Subscribers CSV downloaded");
  };

  const download = (name: string, csv: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-white/50">Profile, preferences, and database management.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profile & Website details */}
        <div className="space-y-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-medium tracking-tight">Website details</h2>
            <p className="mb-5 text-xs text-white/40">
              These appear live on the public website — the contact email, location, and availability badge.
            </p>
            <form onSubmit={saveProfile} className="space-y-4">
              {PROFILE_FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">{f.label}</span>
                  <input
                    value={profile[f.key] ?? f.fallback}
                    placeholder={f.fallback}
                    onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors focus:border-lime"
                  />
                </label>
              ))}
              <button
                disabled={busy === "profile"}
                className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep disabled:opacity-50"
              >
                {busy === "profile" ? "Saving…" : "Save website details"}
              </button>
            </form>
          </motion.section>

          {/* Social Profiles & External Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium tracking-tight">Social &amp; Profile Links</h2>
              <span className="text-[11px] font-medium text-lime bg-lime/10 px-2.5 py-0.5 rounded-full border border-lime/20">
                Live on Contact &amp; Footer
              </span>
            </div>
            <p className="mb-5 text-xs text-white/40">
              Configure your public social media links. Leave empty to omit any specific platform.
            </p>
            <form onSubmit={saveSocials} className="space-y-4">
              {SOCIAL_FIELDS.map((s) => (
                <label key={s.key} className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">{s.label}</span>
                  <input
                    value={profile[s.key] ?? s.fallback}
                    placeholder={s.placeholder}
                    onChange={(e) => setProfile({ ...profile, [s.key]: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors focus:border-lime font-mono text-xs"
                  />
                </label>
              ))}
              <button
                disabled={busy === "socials"}
                className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep disabled:opacity-50"
              >
                {busy === "socials" ? "Saving…" : "Save social links"}
              </button>
            </form>
          </motion.section>
        </div>

        {/* Notifications & Photos */}
        <div className="space-y-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-medium tracking-tight">Profile &amp; Hero Photos</h2>
            <p className="mb-4 text-xs text-white/40">
              Upload your own exact photo to replace the default hero or about section photos.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Hero Photo Uploader */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Hero Photo</span>
                  {settings?.profile_hero_photo && (
                    <button
                      type="button"
                      onClick={resetHeroPhoto}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Reset default
                    </button>
                  )}
                </div>
                {settings?.profile_hero_photo ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-lime/40">
                    <img src={settings.profile_hero_photo} alt="Hero" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-xs text-white/35">
                    Default Photo Active
                  </div>
                )}
                <label className="block">
                  <span className="block text-center cursor-pointer rounded-lg bg-lime/15 hover:bg-lime/25 border border-lime/30 text-lime px-3 py-1.5 text-xs font-medium transition-colors">
                    Upload Your Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      uploadHeroPhoto(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* About Photo Uploader */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">About Section Photo</span>
                  {settings?.profile_about_photo && (
                    <button
                      type="button"
                      onClick={resetAboutPhoto}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Reset default
                    </button>
                  )}
                </div>
                {settings?.profile_about_photo ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-lime/40">
                    <img src={settings.profile_about_photo} alt="About" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-xs text-white/35">
                    Default Photo Active
                  </div>
                )}
                <label className="block">
                  <span className="block text-center cursor-pointer rounded-lg bg-lime/15 hover:bg-lime/25 border border-lime/30 text-lime px-3 py-1.5 text-xs font-medium transition-colors">
                    Upload Your Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      uploadAboutPhoto(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-medium tracking-tight">Notifications</h2>
            <p className="mb-4 text-xs text-white/40">Preferences are stored in SQLite.</p>
            <ul className="divide-y divide-white/5">
              {NOTIFS.map((n) => {
                const on = (settings?.[n.key] ?? (n.on ? "1" : "0")) === "1";
                return (
                  <li key={n.key} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-white/80">{n.label}</span>
                    <button
                      onClick={() => toggleNotif(n.key, !on)}
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                        on ? "bg-lime" : "bg-white/15",
                      )}
                      aria-label="Toggle notification"
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 32 }}
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
                          on ? "right-0.5" : "left-0.5",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        </div>
      </div>

      {/* Backend & Cloud Integrations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-lime/30 bg-lime/[0.03] p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-lime mb-1">
              <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
              Live Backend Delivery
            </div>
            <h2 className="text-xl font-medium tracking-tight text-white">Linked Backend Services</h2>
            <p className="text-xs text-white/50 max-w-xl mt-1 leading-relaxed">
              Connect external APIs, server endpoints, email providers, or push bots so every incoming lead, newsletter subscriber, or client portal message is delivered to you in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={testBackendConnection}
              disabled={testingBackend}
              className="rounded-xl border border-lime/40 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/10 transition-colors"
            >
              {testingBackend ? "Testing..." : "Send test event"}
            </button>
            <button
              type="button"
              onClick={saveBackend}
              disabled={busy === "backend"}
              className="rounded-xl bg-lime px-5 py-2 text-xs font-semibold text-ink hover:bg-lime-deep transition-colors"
            >
              {busy === "backend" ? "Saving..." : "Save integrations"}
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-white flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Quick Setup Guide (Choose 1 or more to receive real emails / alerts):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li><strong className="text-white">Formspree (Easiest - 1 min):</strong> Go to <span className="font-mono text-lime">formspree.io</span>, create a free form, and paste your form ID (e.g. <span className="font-mono text-white/90">xpwzakqr</span>). Every new lead and newsletter subscriber will go directly to your inbox.</li>
            <li><strong className="text-white">Resend (Clean HTML Emails):</strong> Sign up at <span className="font-mono text-lime">resend.com</span>, grab your free API key, and enter your destination email address.</li>
            <li><strong className="text-white">Telegram (Instant Phone Push):</strong> Message <span className="font-mono text-lime">@BotFather</span> to create a free bot, paste your token and chat ID to get notified on your phone.</li>
            <li><strong className="text-white">Custom Webhook:</strong> Works with Zapier, Make.com, n8n, Slack Incoming Webhooks, or any custom API endpoint.</li>
          </ul>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Webhook option */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-lime">
                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Custom Server Webhook (Zapier, Make, n8n, Node, Python)
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Every lead, subscriber, or client portal message sends a JSON POST payload to this endpoint.
            </p>
            <input
              value={backend.webhookUrl}
              onChange={(e) => setBackend({ ...backend, webhookUrl: e.target.value })}
              placeholder="https://your-server.com/api/leads or Zapier webhook"
              className={pwInput}
            />
          </div>

          {/* Formspree */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-lime">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              Formspree Form ID
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Automatically forwards submissions to your personal inbox without writing server code.
            </p>
            <input
              value={backend.formspreeId}
              onChange={(e) => setBackend({ ...backend, formspreeId: e.target.value })}
              placeholder="e.g. xpwzakqr or full Formspree endpoint"
              className={pwInput}
            />
          </div>

          {/* Resend API Key */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-lime">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Resend Transactional Email
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Sends clean HTML emails directly via the Resend API to your verified email.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="password"
                value={backend.resendApiKey}
                onChange={(e) => setBackend({ ...backend, resendApiKey: e.target.value })}
                placeholder="re_123456789..."
                className={pwInput}
              />
              <input
                type="email"
                value={backend.resendToEmail}
                onChange={(e) => setBackend({ ...backend, resendToEmail: e.target.value })}
                placeholder="Send to your@email.com"
                className={pwInput}
              />
            </div>
          </div>

          {/* Telegram notifications */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-lime">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Telegram Bot Notifications (Instant phone push)
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Get an instant ping on your phone whenever a client messages or a lead submits.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={backend.telegramBotToken}
                onChange={(e) => setBackend({ ...backend, telegramBotToken: e.target.value })}
                placeholder="Bot Token (123456:ABC-DEF...)"
                className={pwInput}
              />
              <input
                value={backend.telegramChatId}
                onChange={(e) => setBackend({ ...backend, telegramChatId: e.target.value })}
                placeholder="Chat ID (e.g. 98765432)"
                className={pwInput}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Security */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-medium tracking-tight">Security</h2>
        <p className="mb-5 text-xs text-white/40">
          Change your admin password. Stored as a SHA-256 hash, never in plain text.
        </p>
        <form
          onSubmit={changePw}
          className="grid gap-4 sm:grid-cols-3 sm:items-end"
          onChange={() => setPwError(null)}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">Current password</span>
            <input type="password" autoComplete="current-password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} className={pwInput} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">New password</span>
            <input type="password" autoComplete="new-password" minLength={8} value={pwNew} onChange={(e) => setPwNew(e.target.value)} className={pwInput} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">Confirm</span>
            <input type="password" autoComplete="new-password" minLength={8} value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} className={pwInput} />
          </label>
          {pwError && <p className="text-sm text-rose-400 sm:col-span-3">{pwError}</p>}
          <button
            disabled={busy === "pw"}
            className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep disabled:opacity-50 sm:col-span-3 sm:w-fit"
          >
            {busy === "pw" ? "Updating…" : "Update password"}
          </button>
        </form>
      </motion.section>

      {/* Data management */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-medium tracking-tight">Data management</h2>
        <p className="mb-5 text-xs text-white/40">
          Everything is stored locally in a SQLite database (WebAssembly). Export a real <code>.sqlite</code> file,
          back it up, or restore from a backup.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Action onClick={exportDb} busy={busy === "db"} icon="down" label="Export database" desc="Download .sqlite file" />
          <Action
            onClick={() => fileRef.current?.click()}
            busy={busy === "import"}
            icon="up"
            label="Import database"
            desc="Restore from .sqlite"
          />
          <Action onClick={exportLeadsCsv} icon="table" label="Leads CSV" desc={`${leads?.length ?? 0} rows`} />
          <Action onClick={exportSubsCsv} icon="table" label="Subscribers CSV" desc={`${subs?.length ?? 0} rows`} />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".sqlite,.db,.bin"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
            e.target.value = "";
          }}
        />
      </motion.section>

      {/* Danger zone */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6"
      >
        <h2 className="text-lg font-medium tracking-tight text-rose-300">Danger zone</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm font-medium">Reset demo data</div>
            <p className="mt-1 text-xs text-white/45">
              Restores the original demo leads, subscribers, and projects.
            </p>
            <AnimatePresence mode="wait">
              {confirmReset ? (
                <div key="y" className="mt-4 flex gap-2">
                  <button
                    onClick={resetDatabase}
                    className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  key="n"
                  onClick={() => setConfirmReset(true)}
                  className="mt-4 rounded-lg border border-rose-500/40 px-4 py-2 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500 hover:text-white"
                >
                  Reset demo data
                </button>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm font-medium">Clear all data</div>
            <p className="mt-1 text-xs text-white/45">Deletes every lead, subscriber, project, and view.</p>
            <AnimatePresence mode="wait">
              {confirmClear ? (
                <div key="y" className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      await clearAllData();
                      setConfirmClear(false);
                      toast.info("All data cleared");
                    }}
                    className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  key="n"
                  onClick={() => setConfirmClear(true)}
                  className="mt-4 rounded-lg border border-rose-500/40 px-4 py-2 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500 hover:text-white"
                >
                  Clear all data
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function Action({
  onClick,
  icon,
  label,
  desc,
  busy,
}: {
  onClick: () => void;
  icon: "down" | "up" | "table";
  label: string;
  desc: string;
  busy?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={busy}
      className="group flex items-start gap-3 rounded-xl border border-white/10 p-4 text-left transition-colors hover:border-lime/50 disabled:opacity-50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white/70 transition-colors group-hover:bg-lime group-hover:text-ink">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4">
          {icon === "down" && (
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {icon === "up" && (
            <path d="M12 21V9m0 0l-4 4m4-4l4 4M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {icon === "table" && (
            <path d="M3 5h18v14H3zM3 10h18M9 5v14" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </span>
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="mt-0.5 block text-xs text-white/40">{busy ? "Working…" : desc}</span>
      </span>
    </motion.button>
  );
}
