"use client";

import { motion } from "framer-motion";

/** Fades/slides children in the first time they scroll into view. */
export function Reveal({
  children, delay = 0, y = 28, className, as = "div",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
