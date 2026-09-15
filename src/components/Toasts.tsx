import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast, type Toast } from "../lib/toast";

const ICONS: Record<Toast["kind"], string> = {
  success: "M5 12l5 5L20 7",
  error: "M6 6l12 12M18 6L6 18",
  info: "M12 8h.01M12 12v4",
};

const STYLES: Record<Toast["kind"], string> = {
  success: "bg-ink text-white border-lime",
  error: "bg-ink text-white border-rose-400",
  info: "bg-ink text-white border-sky-300",
};

const DOT: Record<Toast["kind"], string> = {
  success: "bg-lime",
  error: "bg-rose-400",
  info: "bg-sky-300",
};

export function Toasts() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => toast.subscribe(setItems), []);

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-[120] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 sm:items-end">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex w-full items-center gap-3 rounded-2xl border-l-4 px-4 py-3 shadow-2xl ${STYLES[t.kind]}`}
            onClick={() => toast.dismiss(t.id)}
            role="status"
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${DOT[t.kind]}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f0f0f"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d={ICONS[t.kind]} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-sm font-medium text-white">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
