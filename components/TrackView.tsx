"use client";

import { useEffect } from "react";

const KEY = "hawk:recent";

/** Records a vehicle view (server count + localStorage recently-viewed list). */
export function TrackView({ id, slug }: { id: string; slug: string }) {
  useEffect(() => {
    fetch(`/api/vehicles/${id}/view`, { method: "POST" }).catch(() => {});
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      const next = [slug, ...list.filter((s) => s !== slug)].slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }, [id, slug]);
  return null;
}
