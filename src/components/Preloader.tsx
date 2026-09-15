import { animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "./motion";
import { LogoMark } from "./Logo";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const c = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setExit(true);
        setTimeout(onDone, 900);
      },
    });
    return () => c.stop();
  }, [onDone]);

  return (
    <motion.div
      initial={false}
      animate={exit ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: EASE }}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 sm:p-10 text-white safe-top safe-bottom"
      aria-hidden
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white/50">
        <span className="flex items-center gap-2 sm:gap-3">
          <LogoMark tone="light" className="h-6 sm:h-7" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider">Osborne Ferds</span>
        </span>
        <span className="text-[10px] sm:text-xs">Portfolio 2026</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={exit ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-serif text-2xl xs:text-3xl italic text-white/80 sm:text-5xl"
        >
          Design <span className="text-lime">×</span> Code
        </motion.div>
        <motion.div
          animate={exit ? { opacity: 0, y: -20 } : { opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[18vw] leading-[0.8] tracking-[-0.05em] tabular-nums sm:text-[10rem]"
        >
          {n}
        </motion.div>
      </div>

      <div className="h-px w-full overflow-hidden bg-white/10">
        <motion.div className="h-full bg-lime" style={{ width: `${n}%` }} />
      </div>
    </motion.div>
  );
}
