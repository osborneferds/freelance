import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  addProject,
  deleteProject,
  listProjects,
  reorderProjects,
  updateProject,
} from "../../db/database";
import { useDbData } from "../../hooks/useDbData";
import { cn } from "../../utils/cn";
import { toast } from "../../lib/toast";

const PRESET_IMAGES = [
  "https://images.pexels.com/photos/33797643/pexels-photo-33797643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/9999716/pexels-photo-9999716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  "https://images.pexels.com/photos/29450014/pexels-photo-29450014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  "https://images.pexels.com/photos/34939150/pexels-photo-34939150.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  "https://images.pexels.com/photos/8534457/pexels-photo-8534457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
];
const TONES = [
  { value: "from-white/40", label: "White", swatch: "bg-gradient-to-br from-white to-white/70 border border-white/60 shadow-sm" },
  { value: "from-violet-500/40", label: "Violet", swatch: "bg-gradient-to-br from-violet-400 to-violet-700" },
  { value: "from-blue-500/40", label: "Blue", swatch: "bg-gradient-to-br from-blue-400 to-blue-700" },
  { value: "from-emerald-500/40", label: "Emerald", swatch: "bg-gradient-to-br from-emerald-400 to-emerald-700" },
  { value: "from-amber-500/40", label: "Amber", swatch: "bg-gradient-to-br from-amber-400 to-amber-700" },
  { value: "from-rose-500/40", label: "Rose", swatch: "bg-gradient-to-br from-rose-400 to-rose-700" },
  { value: "from-pink-500/40", label: "Pink", swatch: "bg-gradient-to-br from-pink-400 to-pink-700" },
];
const CATEGORIES = ["Web", "Product", "Brand"] as const;

/* Read a local image, downscale it, and return a compact JPEG data URL */
function compressImage(file: File, maxDim = 1600): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

interface Draft {
  id?: number;
  title: string;
  client: string;
  category: (typeof CATEGORIES)[number];
  year: string;
  size: "large" | "small";
  tone: string;
  image: string;
  link: string;
  visible: boolean;
}

const EMPTY: Draft = {
  title: "",
  client: "",
  category: "Web",
  year: String(new Date().getFullYear()),
  size: "small",
  tone: TONES[0].value,
  image: PRESET_IMAGES[0],
  link: "",
  visible: true,
};

const URL_RE = /^https?:\/\/.+/i;

function normalizeUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return URL_RE.test(t) ? t : `https://${t}`;
}

export function Projects() {
  const projects = useDbData(listProjects) ?? [];
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That image is over 15 MB — please choose a smaller file.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      setDraft((d) => (d ? { ...d, image: dataUrl } : d));
      toast.success("Image uploaded and compressed.");
    } catch {
      toast.error("Could not process that image.");
    } finally {
      setUploading(false);
    }
  };

  const ordered = [...projects].sort((a, b) => a.sort - b.sort);

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error("Give the project a title.");
      return;
    }
    const payload = {
      title: draft.title.trim(),
      client: draft.client.trim(),
      category: draft.category,
      year: draft.year,
      size: draft.size,
      tone: draft.tone,
      image: draft.image,
      link: normalizeUrl(draft.link),
      visible: draft.visible ? 1 : 0,
    };
    if (draft.id) {
      await updateProject(draft.id, payload);
      toast.success("Project updated — changes are live on the site.");
    } else {
      await addProject(payload);
      toast.success("Project added — it's now on the site.");
    }
    setDraft(null);
  };

  const move = async (id: number, dir: -1 | 1) => {
    const idx = ordered.findIndex((p) => p.id === id);
    const target = idx + dir;
    if (target < 0 || target >= ordered.length) return;
    const ids = ordered.map((p) => p.id);
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    await reorderProjects(ids);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-white/50">
            {projects.length} projects · this drives the work section of the live site.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setDraft({ ...EMPTY })}
          className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New project
        </motion.button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="scroll-x">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.12em] text-white/45">
                <th className="px-5 py-3.5 font-medium">Project</th>
                <th className="px-5 py-3.5 font-medium">Client</th>
                <th className="px-5 py-3.5 font-medium">Category</th>
                <th className="px-5 py-3.5 font-medium">Size</th>
                <th className="px-5 py-3.5 font-medium">Visible</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "border-b border-white/5 transition-colors last:border-0 hover:bg-white/5",
                    !p.visible && "opacity-50",
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-white">{p.title}</span>
                          {p.link && (
                            <span title="Has a live link" className="shrink-0 text-lime">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/40">{p.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/70">{p.client}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-white/70">{p.size}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => {
                        updateProject(p.id, { visible: p.visible ? 0 : 1 });
                        toast.info(p.visible ? `${p.title} hidden on the site` : `${p.title} is live again`);
                      }}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        p.visible ? "bg-lime" : "bg-white/15",
                      )}
                      aria-label="Toggle visibility"
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 32 }}
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
                          p.visible ? "right-0.5" : "left-0.5",
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn label="Move up" onClick={() => move(p.id, -1)} disabled={i === 0}>
                        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                      <IconBtn
                        label="Move down"
                        onClick={() => move(p.id, 1)}
                        disabled={i === ordered.length - 1}
                      >
                        <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open live site"
                          title="Open live site"
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/60 transition-colors hover:bg-lime hover:text-ink"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4">
                            <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}
                      <IconBtn
                        label="Edit"
                        onClick={() =>
                          setDraft({
                            ...p,
                            visible: !!p.visible,
                            category: (CATEGORIES.includes(p.category as (typeof CATEGORIES)[number])
                              ? p.category
                              : "Web") as Draft["category"],
                          })
                        }
                      >
                        <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                      <IconBtn label="Delete" danger onClick={() => setConfirmId(p.id)}>
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {ordered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-white/40">
                    No projects yet — add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor modal */}
      <AnimatePresence>
        {draft && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDraft(null)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-1/2 top-3 z-[80] max-h-[92vh] w-[min(680px,94vw)] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-ink p-5 shadow-2xl sm:top-1/2 sm:max-h-[90vh] sm:p-8 sm:-translate-y-1/2"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl tracking-tight">{draft.id ? "Edit project" : "New project"}</h2>
                <button
                  onClick={() => setDraft(null)}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Title">
                  <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Client">
                  <input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Category">
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as Draft["category"] })}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-ink">
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Year">
                  <input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} className={inputCls} />
                </Field>
              </div>

              <div className="mt-5">
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Cover image</div>

                {/* Upload dropzone */}
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  className={cn(
                    "mb-2 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors",
                    dragOver
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80",
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  {uploading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-lime" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
                      <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="text-xs font-medium">
                    {uploading ? "Processing…" : "Drag & drop an image, or click to browse"}
                  </span>
                  <span className="text-[10px] text-white/30">PNG, JPG or WebP · compressed automatically</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {draft.image.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft })}
                      className="relative aspect-[16/10] overflow-hidden rounded-xl border-2 border-lime"
                    >
                      <img src={draft.image} alt="" className="h-full w-full object-cover" />
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-lime px-2 py-0.5 text-[9px] font-semibold text-ink">
                        Uploaded
                      </span>
                    </button>
                  )}
                  {PRESET_IMAGES.map((src) => (
                    <button
                      key={src}
                      onClick={() => setDraft({ ...draft, image: src })}
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all",
                        draft.image === src ? "border-lime" : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  value={
                    draft.image.startsWith("http") && !PRESET_IMAGES.includes(draft.image) ? draft.image : ""
                  }
                  onChange={(e) => setDraft({ ...draft, image: e.target.value || PRESET_IMAGES[0] })}
                  placeholder="…or paste a custom image URL"
                  className={cn(inputCls, "mt-2")}
                />
              </div>

              <div className="mt-5">
                <Field label="Live project URL (optional)">
                  <div className="flex items-stretch gap-2">
                    <span className="grid w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/40">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4">
                        <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      value={draft.link}
                      onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                      placeholder="https://yourproject.com"
                      inputMode="url"
                      className={inputCls}
                    />
                    {draft.link.trim() && (
                      <a
                        href={normalizeUrl(draft.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid w-11 shrink-0 place-items-center rounded-xl border border-lime/50 text-lime transition-colors hover:bg-lime hover:text-ink"
                        aria-label="Open link in new tab"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                          <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/35">
                    Where the “View project” button sends visitors. Leave empty to point to your contact section.
                  </p>
                </Field>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Card size">
                  <div className="flex gap-2">
                    {(["small", "large"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setDraft({ ...draft, size: s })}
                        className={cn(
                          "flex-1 rounded-xl border py-2.5 text-sm capitalize transition-all",
                          draft.size === s ? "border-lime bg-lime/15 text-lime" : "border-white/15 text-white/60",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Overlay tint">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {TONES.map((t) => (
                      <button
                        type="button"
                        key={t.value}
                        title={t.label}
                        onClick={() => setDraft({ ...draft, tone: t.value })}
                        className={cn(
                          "h-9 w-9 rounded-full transition-all",
                          t.swatch,
                          draft.tone === t.value
                            ? "scale-110 ring-2 ring-lime ring-offset-2 ring-offset-ink"
                            : "opacity-75 hover:opacity-100",
                        )}
                        aria-label={`Tint ${t.label}`}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-white/70">
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, visible: !draft.visible })}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    draft.visible ? "bg-lime" : "bg-white/15",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      draft.visible ? "left-[calc(100%-1.375rem)]" : "left-0.5",
                    )}
                  />
                </button>
                Visible on the public site
              </label>

              {/* Preview */}
              <div className="mt-6">
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Live preview</div>
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-ink",
                    draft.size === "large" ? "aspect-[21/9]" : "aspect-[4/3]",
                  )}
                >
                  <img src={draft.image} alt="" className="h-full w-full object-cover" />
                  <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent", draft.tone)} />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-5">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">{draft.client || "Client"}</div>
                      <div className="truncate text-lg tracking-tight text-white">{draft.title || "Project title"}</div>
                    </div>
                    {draft.link.trim() && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-[10px] font-semibold text-ink">
                        View project
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={save}
                  className="flex-1 rounded-xl bg-lime py-3 text-sm font-semibold text-ink transition-colors hover:bg-lime-deep"
                >
                  {draft.id ? "Save changes" : "Add project"}
                </button>
                <button
                  onClick={() => setDraft(null)}
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink p-7 text-center"
            >
              <h3 className="text-lg tracking-tight">Delete this project?</h3>
              <p className="mt-2 text-sm text-white/50">
                It will be removed from the live site immediately. This can't be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={async () => {
                    await deleteProject(confirmId);
                    setConfirmId(null);
                    toast.info("Project deleted");
                  }}
                  className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm text-white/70 transition-colors hover:bg-white/10"
                >
                  Keep
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base sm:text-sm outline-none transition-colors focus:border-lime";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-white/60 transition-colors",
        disabled ? "opacity-25" : danger ? "hover:bg-rose-500/20 hover:text-rose-300" : "hover:bg-white/10 hover:text-white",
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4">
        {children}
      </svg>
    </button>
  );
}
