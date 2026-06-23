"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "hawk:saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function SaveVehicleButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(read().includes(slug)), [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list = read();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
    window.dispatchEvent(new Event("hawk:saved-changed"));
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from saved" : "Save vehicle"}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition hover:scale-110"
    >
      <Heart size={16} className={saved ? "fill-rose-500 text-rose-500" : "text-white"} />
    </button>
  );
}
