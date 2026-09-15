import type { ClientFile, Invoice } from "../db/schema";

export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  if (dd < 30) return `${dd}d ago`;
  return formatDate(iso);
}

/** Triggers a browser download for a stored (base64) file. */
export function downloadStoredFile(file: ClientFile) {
  if (!file.data) return;
  const a = document.createElement("a");
  a.href = file.data;
  a.download = file.name;
  a.click();
}

/** Reads a File into a base64 data URL. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** Read a local image, downscale it, and return a compact JPEG data URL */
export function compressImage(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** Opens a printable invoice (Save as PDF from the print dialog). */
export function printInvoice(inv: Invoice, clientName: string, company: string, studio = "Osborne Fernandes Studio") {
  const rows = `
    <tr><td>${inv.number} — ${company || "Professional services"}</td><td style="text-align:right">${formatMoney(inv.amount, inv.currency)}</td></tr>
  `;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${inv.number}</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#0f0f0f;max-width:640px;margin:48px auto;padding:0 24px}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f0f0f;padding-bottom:20px}
    h1{margin:0;font-size:26px;letter-spacing:-.02em}
    .muted{color:#6b6b66;font-size:13px}
    table{width:100%;border-collapse:collapse;margin-top:32px}
    td{padding:14px 0;border-bottom:1px solid #e5e5e0;font-size:14px}
    .total{margin-top:20px;text-align:right;font-size:22px;font-weight:600}
    .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#d9ff3d;font-size:12px;font-weight:600;text-transform:uppercase}
    .foot{margin-top:48px;font-size:12px;color:#6b6b66}
  </style></head><body>
    <div class="top">
      <div>
        <h1>${studio}</h1>
        <div class="muted">Web, Software &amp; AI Development</div>
      </div>
      <div style="text-align:right">
        <div class="badge">${inv.status}</div>
        <div class="muted" style="margin-top:8px">Issued ${formatDate(inv.issued)}<br/>Due ${formatDate(inv.due)}</div>
      </div>
    </div>
    <div style="margin-top:28px">
      <div class="muted">Billed to</div>
      <div style="font-size:16px;font-weight:600;margin-top:4px">${clientName}</div>
      <div class="muted">${company || ""}</div>
    </div>
    <table>${rows}</table>
    <div class="total">Total: ${formatMoney(inv.amount, inv.currency)}</div>
    ${inv.notes ? `<div class="foot">${inv.notes}</div>` : ""}
    <div class="foot">Thank you for your business. Payment terms: net 14 days.</div>
  </body></html>`;
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 350);
}
