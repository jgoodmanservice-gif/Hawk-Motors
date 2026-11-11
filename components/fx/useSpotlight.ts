"use client";

import type React from "react";

/** Writes pointer position into --mx / --my so CSS can draw a spotlight or glare. */
export function spotlightMove(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
