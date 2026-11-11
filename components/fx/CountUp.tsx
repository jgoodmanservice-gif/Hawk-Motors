"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts up to `to` once visible. `format` renders each frame (e.g. currency). */
export function CountUp({ to, format = (n) => Math.round(n).toLocaleString("en-GB"), duration = 1.4 }: {
  to: number; format?: (n: number) => string; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen || !ref.current) return;
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { if (ref.current) ref.current.textContent = format(v); } });
    return () => c.stop();
  }, [seen, to, duration, format]);
  return <span ref={ref}>{format(to)}</span>;
}
