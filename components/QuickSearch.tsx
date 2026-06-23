"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import type { FilterOptions } from "@/lib/types";

export function QuickSearch({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fuel, setFuel] = useState("");

  const models = options.makes.find((m) => m.name === make)?.models ?? [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (make) p.set("make", make);
    if (model) p.set("model", model);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (fuel) p.set("fuel", fuel);
    router.push(`/inventory?${p.toString()}`);
  }

  return (
    <section className="mx-auto -mt-6 max-w-screen-2xl px-4 hidden md:block">
      <form onSubmit={submit} className="glass relative z-10 grid gap-3 p-4 md:grid-cols-5 md:items-end">
        <div>
          <label className="label">Make</label>
          <select className="input" value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}>
            <option value="">Any make</option>
            {options.makes.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Model</label>
          <select className="input" value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
            <option value="">Any model</option>
            {models.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Max price</label>
          <select className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">No max</option>
            {[20000, 30000, 40000, 50000, 75000, 100000].map((n) => (
              <option key={n} value={n}>£{n.toLocaleString()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Fuel</label>
          <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
            <option value="">Any fuel</option>
            {options.fuelTypes.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
          </select>
        </div>
        <button className="btn-accent h-[42px]"><Search size={16} /> Search</button>
      </form>
    </section>
  );
}
