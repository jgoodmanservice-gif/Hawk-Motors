"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Copy, Trash2, Pencil, MoreVertical } from "lucide-react";
import { formatPrice, formatMileage, STATUS_LABEL } from "@/lib/utils";
import type { VehicleCardData } from "@/lib/types";

const statusColors: Record<string, string> = {
  AVAILABLE: "text-emerald-300",
  RESERVED: "text-amber-300",
  SOLD: "text-rose-300",
  DRAFT: "text-white/50",
};

export function VehicleTable({ vehicles }: { vehicles: VehicleCardData[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id);
    await fetch(`/api/vehicles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(null);
    router.refresh();
  }
  async function duplicate(id: string) {
    setBusy(id);
    await fetch(`/api/vehicles/${id}/duplicate`, { method: "POST" });
    setBusy(null);
    setMenu(null);
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this vehicle permanently? This cannot be undone.")) return;
    setBusy(id);
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (!vehicles.length) {
    return <div className="glass p-12 text-center text-[rgb(var(--muted))]">No vehicles yet. Add your first one.</div>;
  }

  return (
    <div className="glass overflow-hidden">
      <div className="hidden grid-cols-[64px_1fr_120px_110px_120px_140px] gap-3 border-b border-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))] md:grid">
        <span />
        <span>Vehicle</span>
        <span>Price</span>
        <span>Status</span>
        <span>Featured</span>
        <span className="text-right">Actions</span>
      </div>
      <ul className="divide-y divide-white/5">
        {vehicles.map((v) => (
          <li key={v.id} className={`grid grid-cols-[64px_1fr] items-center gap-3 px-4 py-3 md:grid-cols-[64px_1fr_120px_110px_120px_140px] ${busy === v.id ? "opacity-50" : ""}`}>
            <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-ink-800">
              {v.image && <Image src={v.image} alt="" fill className="object-cover" sizes="64px" />}
            </div>
            <div className="min-w-0">
              <Link href={`/admin/vehicles/${v.id}/edit`} className="block truncate font-medium hover:text-accent">{v.title}</Link>
              <p className="text-xs text-[rgb(var(--muted))]">{v.year} · {formatMileage(v.mileage)} · {v.fuelType}</p>
            </div>
            <span className="hidden font-semibold md:block">{formatPrice(v.price)}</span>
            <div className="hidden md:block">
              <select value={v.status} onChange={(e) => patch(v.id, { status: e.target.value })} className={`bg-transparent text-sm font-medium outline-none ${statusColors[v.status]}`}>
                {["AVAILABLE", "RESERVED", "SOLD", "DRAFT"].map((s) => <option key={s} value={s} className="bg-ink-900 text-white">{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <button onClick={() => patch(v.id, { featured: !v.featured })} className="hidden md:block" aria-label="Toggle featured">
              <Star size={20} className={v.featured ? "fill-accent text-accent" : "text-[rgb(var(--muted))]"} />
            </button>
            <div className="relative col-start-2 flex items-center justify-end gap-1 md:col-start-auto">
              <Link href={`/admin/vehicles/${v.id}/edit`} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10" aria-label="Edit"><Pencil size={15} /></Link>
              <button onClick={() => remove(v.id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-300 hover:bg-rose-500/10" aria-label="Delete"><Trash2 size={15} /></button>
              <button onClick={() => setMenu(menu === v.id ? null : v.id)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10" aria-label="More"><MoreVertical size={15} /></button>
              {menu === v.id && (
                <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-glass">
                  <button onClick={() => duplicate(v.id)} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5"><Copy size={14} /> Duplicate</button>
                  <button onClick={() => patch(v.id, { featured: !v.featured })} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5"><Star size={14} /> {v.featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => remove(v.id)} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"><Trash2 size={14} /> Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
