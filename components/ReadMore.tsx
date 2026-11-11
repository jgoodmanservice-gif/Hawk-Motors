"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** Long SEO copy: stays in the page for search engines, but folded for visitors. */
export function ReadMore({ children, collapsed = 220 }: { children: React.ReactNode; collapsed?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="relative overflow-hidden transition-[max-height] duration-700 ease-in-out" style={{ maxHeight: open ? 4000 : collapsed }}>
        {children}
        {!open && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgb(var(--bg-elev))] to-transparent" />}
      </div>
      <button onClick={() => setOpen((o) => !o)} className="btn-ghost mt-4 py-2 text-xs" aria-expanded={open}>
        {open ? "Show less" : "Read more"} <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
