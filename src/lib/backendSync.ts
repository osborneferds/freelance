import { site } from "../config";
import { getSetting } from "../db/database";

export interface BackendConfig {
  webhookUrl: string;
  formspreeId: string;
  resendApiKey: string;
  resendToEmail: string;
  telegramBotToken: string;
  telegramChatId: string;
}

/**
 * Reads configured backend delivery options.
 * Values can come from:
 * 1. Admin UI database settings (persisted in SQLite `settings` table, customizable in Admin -> Settings -> Integrations)
 * 2. Vite environment variables (.env / VITE_* flags)
 */
export async function getBackendConfig(): Promise<BackendConfig> {
  const [
    dbWebhook,
    dbFormspree,
    dbResendKey,
    dbResendTo,
    dbTgToken,
    dbTgChat,
  ] = await Promise.all([
    getSetting("backend_webhook_url"),
    getSetting("backend_formspree_id"),
    getSetting("backend_resend_key"),
    getSetting("backend_resend_to"),
    getSetting("backend_telegram_token"),
    getSetting("backend_telegram_chat"),
  ]);

  return {
    webhookUrl: (dbWebhook || (import.meta as any).env?.VITE_WEBHOOK_URL || "").trim(),
    formspreeId: (dbFormspree || (import.meta as any).env?.VITE_FORMSPREE_ID || "").trim(),
    resendApiKey: (dbResendKey || (import.meta as any).env?.VITE_RESEND_API_KEY || "").trim(),
    resendToEmail: (dbResendTo || (import.meta as any).env?.VITE_RESEND_TO_EMAIL || site.email || "").trim(),
    telegramBotToken: (dbTgToken || (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || "").trim(),
    telegramChatId: (dbTgChat || (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || "").trim(),
  };
}

export interface DispatchResult {
  sentToCloud: boolean;
  providersNotified: string[];
  errors: string[];
}

/**
 * Dispatches an event (Lead submission, Newsletter subscriber, or Client Portal message)
 * to any configured live backend services simultaneously with timeout handling.
 */
export async function dispatchToBackend(
  event: "lead" | "subscriber" | "client_message",
  payload: Record<string, any>,
): Promise<DispatchResult> {
  const cfg = await getBackendConfig();
  const providersNotified: string[] = [];
  const errors: string[] = [];

  const tasks: Promise<void>[] = [];

  // 1. Generic Webhook (Zapier, Make, n8n, Custom Node/Python server, Slack incoming webhook)
  if (cfg.webhookUrl) {
    tasks.push(
      fetch(cfg.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "osborne-fernandes-hub",
          event,
          timestamp: new Date().toISOString(),
          ...payload,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          providersNotified.push("Webhook");
        })
        .catch((err) => {
          errors.push(`Webhook: ${err.message}`);
        }),
    );
  }

  // 2. Formspree (Direct contact / lead email forwarder)
  if (cfg.formspreeId && (event === "lead" || event === "subscriber")) {
    const endpoint = cfg.formspreeId.startsWith("http")
      ? cfg.formspreeId
      : `https://formspree.io/f/${cfg.formspreeId}`;

    tasks.push(
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject:
            event === "lead"
              ? `🚀 New Lead: ${payload.name} (${payload.company || "Individual"})`
              : `📬 New Newsletter Subscriber: ${payload.email}`,
          ...payload,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          providersNotified.push("Formspree");
        })
        .catch((err) => {
          errors.push(`Formspree: ${err.message}`);
        }),
    );
  }

  // 3. Resend API (Direct transactional email sending)
  if (cfg.resendApiKey && cfg.resendToEmail) {
    let subject = "New Notification from Portfolio Hub";
    let html = `<div style="font-family:sans-serif;line-height:1.6;color:#111">`;

    if (event === "lead") {
      subject = `[New Project Lead] ${payload.name} - ${payload.company || "No company"}`;
      html += `
        <h2 style="color:#0f0f0f">New Project Lead Inquiry</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>Company:</strong> ${payload.company || "None"}</p>
        <p><strong>Services Needed:</strong> ${payload.types || "Not specified"}</p>
        <p><strong>Budget:</strong> ${payload.budget || "Not specified"}</p>
        <div style="background:#f4f3ee;padding:12px;border-radius:8px;margin-top:10px">
          <strong>Message:</strong><br/>
          ${(payload.message || "").replace(/\n/g, "<br/>")}
        </div>
      `;
    } else if (event === "subscriber") {
      subject = `[Newsletter Subscriber] ${payload.email}`;
      html += `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Subscribed on:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (event === "client_message") {
      subject = `[Client Portal Message] from ${payload.clientName || "Client"}`;
      html += `
        <h2>New Client Portal Message</h2>
        <p><strong>Client:</strong> ${payload.clientName} (${payload.clientEmail})</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f4f3ee;padding:12px;border-left:4px solid #0f0f0f;margin:10px 0">
          ${(payload.body || "").replace(/\n/g, "<br/>")}
        </blockquote>
      `;
    }
    html += `</div>`;

    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [cfg.resendToEmail],
          subject,
          html,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const txt = await res.text();
            throw new Error(`HTTP ${res.status}: ${txt}`);
          }
          providersNotified.push("Resend Email");
        })
        .catch((err) => {
          errors.push(`Resend: ${err.message}`);
        }),
    );
  }

  // 4. Telegram Bot (Instant smartphone push notifications on new leads/messages)
  if (cfg.telegramBotToken && cfg.telegramChatId) {
    let text = "";
    if (event === "lead") {
      text = `🚀 *New Portfolio Lead*\n\n*Name:* ${payload.name}\n*Email:* ${payload.email}\n*Company:* ${payload.company || "—"}\n*Services:* ${payload.types || "—"}\n*Budget:* ${payload.budget || "—"}\n\n*Message:*\n${payload.message || "—"}`;
    } else if (event === "subscriber") {
      text = `📬 *New Newsletter Subscriber*\n\n${payload.email}`;
    } else if (event === "client_message") {
      text = `💬 *Client Portal Message*\n\n*Client:* ${payload.clientName || "Client"}\n\n${payload.body}`;
    }

    tasks.push(
      fetch(
        `https://api.telegram.org/bot${cfg.telegramBotToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: cfg.telegramChatId,
            text,
            parse_mode: "Markdown",
          }),
        },
      )
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          providersNotified.push("Telegram");
        })
        .catch((err) => {
          errors.push(`Telegram: ${err.message}`);
        }),
    );
  }

  if (tasks.length > 0) {
    // Wait for all remote webhooks with a max timeout of 6 seconds so UI never hangs
    await Promise.allSettled(tasks);
  }

  return {
    sentToCloud: providersNotified.length > 0,
    providersNotified,
    errors,
  };
}
