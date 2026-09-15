import { motion } from "motion/react";
import { useId, useMemo, useState } from "react";

/* Smooth line through points (catmull-rom → cubic bezier) */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0][0]} ${pts[0][1]}` : "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function AreaChart({ data }: { data: { label: string; value: number }[] }) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 220;
  const PAD_X = 8;
  const PAD_Y = 16;

  const max = Math.max(2, ...data.map((d) => d.value));
  const pts: [number, number][] = useMemo(
    () =>
      data.map((d, i) => [
        PAD_X + (i / Math.max(1, data.length - 1)) * (W - PAD_X * 2),
        H - PAD_Y - (d.value / max) * (H - PAD_Y * 2),
      ]),
    [data, max],
  );
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1]?.[0] ?? 0} ${H} L ${pts[0]?.[0] ?? 0} ${H} Z`;

  const onMove = (clientX: number, rect: DOMRect) => {
    const x = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    pts.forEach((p, i) => {
      const dd = Math.abs(p[0] - x);
      if (dd < bestD) {
        bestD = dd;
        best = i;
      }
    });
    setHover(best);
  };

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-pan-x"
        onMouseMove={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            onMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchEnd={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`ag-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9ff3d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d9ff3d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={H * f}
            y2={H * f}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 5"
          />
        ))}
        <motion.path
          d={area}
          fill={`url(#ag-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#d9ff3d"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {hover !== null && pts[hover] && (
          <g>
            <line
              x1={pts[hover][0]}
              x2={pts[hover][0]}
              y1={PAD_Y - 6}
              y2={H - PAD_Y}
              stroke="rgba(255,255,255,0.25)"
            />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r={5} fill="#d9ff3d" stroke="#0f0f0f" strokeWidth={2} />
          </g>
        )}
      </svg>

      {hover !== null && data[hover] && pts[hover] && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-center shadow-xl"
          style={{
            left: `${(pts[hover][0] / W) * 100}%`,
            top: `${(pts[hover][1] / H) * 100}%`,
            transform: `translate(-50%, -120%)`,
          }}
        >
          <div className="text-sm font-semibold text-ink">{data[hover].value} leads</div>
          <div className="text-[11px] text-muted">{data[hover].label}</div>
        </div>
      )}

      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function DemandBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-4">
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-white/85">{it.label}</span>
            <span className="tabular-nums text-white/45">{it.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(it.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-lime-deep to-lime"
            />
          </div>
        </li>
      ))}
      {items.length === 0 && <li className="text-sm text-white/40">No data yet.</li>}
    </ul>
  );
}
