"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { FilterOptions } from "@/lib/types";

export function InventoryFilters({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  const val = (k: string) => sp.get(k) ?? "";
  const models = options.makes.find((m) => m.name === val("make"))?.models ?? [];

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      if (patch.make !== undefined) next.delete("model");
      router.push(`/inventory?${next.toString()}`);
    },
    [router, sp]
  );

  const hasFilters = Array.from(sp.keys()).some((k) => k !== "sort");

  return (
    <aside className="glass h-fit lg:sticky lg:top-24">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 lg:hidden"
      >
        <span className="flex items-center gap-2 font-display text-base font-semibold">
          <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="chip border-accent/40 text-accent text-xs">Active</span>}
        </span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`${open ? "block" : "hidden"} p-5 pt-0 lg:block lg:p-5`}>
        <div className="mb-4 hidden items-center justify-between lg:flex">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><SlidersHorizontal size={18} /> Filters</h3>
          {hasFilters && (
            <button onClick={() => router.push("/inventory")} className="flex items-center gap-1 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
              <X size={13} /> Clear
            </button>
          )}
        </div>
        {hasFilters && (
          <button onClick={() => router.push("/inventory")} className="mb-4 flex items-center gap-1 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] lg:hidden">
            <X size={13} /> Clear filters
          </button>
        )}

      <div className="space-y-4">
        <div>
          <label className="label">Keyword</label>
          <input className="input" defaultValue={val("q")} placeholder="e.g. AMG, RS6, panoramic"
            onKeyDown={(e) => { if (e.key === "Enter") update({ q: (e.target as HTMLInputElement).value }); }}
            onBlur={(e) => update({ q: e.target.value })} />
        </div>

        <div>
          <label className="label">Make</label>
          <select className="input" value={val("make")} onChange={(e) => update({ make: e.target.value })}>
            <option value="">Any make</option>
            {options.makes.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Model</label>
          <select className="input" value={val("model")} onChange={(e) => update({ model: e.target.value })} disabled={!val("make")}>
            <option value="">Any model</option>
            {models.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Min £</label>
            <input className="input" type="number" defaultValue={val("minPrice")} onBlur={(e) => update({ minPrice: e.target.value })} />
          </div>
          <div>
            <label className="label">Max £</label>
            <input className="input" type="number" defaultValue={val("maxPrice")} onBlur={(e) => update({ maxPrice: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Year from</label>
            <input className="input" type="number" defaultValue={val("minYear")} onBlur={(e) => update({ minYear: e.target.value })} />
          </div>
          <div>
            <label className="label">Year to</label>
            <input className="input" type="number" defaultValue={val("maxYear")} onBlur={(e) => update({ maxYear: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Max mileage</label>
          <input className="input" type="number" defaultValue={val("maxMileage")} onBlur={(e) => update({ maxMileage: e.target.value })} />
        </div>

        <div>
          <label className="label">Fuel type</label>
          <select className="input" value={val("fuel")} onChange={(e) => update({ fuel: e.target.value })}>
            <option value="">Any</option>
            {options.fuelTypes.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Transmission</label>
          <select className="input" value={val("transmission")} onChange={(e) => update({ transmission: e.target.value })}>
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="label">Body style</label>
          <select className="input" value={val("body")} onChange={(e) => update({ body: e.target.value })}>
            <option value="">Any</option>
            {options.bodyStyles.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Colour</label>
          <select className="input" value={val("colour")} onChange={(e) => update({ colour: e.target.value })}>
            <option value="">Any</option>
            {options.colours.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Max owners</label>
          <select className="input" value={val("owners")} onChange={(e) => update({ owners: e.target.value })}>
            <option value="">Any</option>
            {[1, 2, 3].map((n) => <option key={n} value={n}>{n} or fewer</option>)}
          </select>
        </div>
      </div>
      </div>
    </aside>
  );
}

export function SortBar({ count }: { count: number }) {
  const router = useRouter();
  const sp = useSearchParams();
  const setSort = (v: string) => {
    const next = new URLSearchParams(sp.toString());
    if (v) next.set("sort", v); else next.delete("sort");
    router.push(`/inventory?${next.toString()}`);
  };
  return (
    <div className="glass mb-5 flex items-center justify-between p-3">
      <p className="text-sm text-[rgb(var(--muted))]">{count} {count === 1 ? "vehicle" : "vehicles"}</p>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-[rgb(var(--muted))] sm:inline">Sort by</span>
        <select className="input max-w-[200px] py-2 text-sm" value={sp.get("sort") ?? "newest"} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="mileage-asc">Lowest mileage</option>
          <option value="mileage-desc">Highest mileage</option>
        </select>
      </div>
    </div>
  );
}
