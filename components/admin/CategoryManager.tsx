"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { FilterOptions } from "@/lib/types";

export function CategoryManager({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [makeName, setMakeName] = useState("");
  const [modelMakeId, setModelMakeId] = useState("");
  const [modelName, setModelName] = useState("");
  const [fuel, setFuel] = useState("");
  const [body, setBody] = useState("");
  const [colour, setColour] = useState("");

  async function add(kind: string, body: Record<string, unknown>, reset: () => void) {
    setBusy(true);
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, ...body }) });
    setBusy(false);
    if (res.ok) { reset(); router.refresh(); }
    else alert("Could not add — it may already exist.");
  }

  const Card = ({ title, children, list }: { title: string; children: React.ReactNode; list: string[] }) => (
    <section className="glass p-5">
      <h2 className="mb-3 font-display text-lg font-semibold">{title}</h2>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {list.length ? list.map((n) => <span key={n} className="chip">{n}</span>) : <span className="text-xs text-[rgb(var(--muted))]">None yet</span>}
      </div>
      {children}
    </section>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Makes" list={options.makes.map((m) => m.name)}>
        <div className="flex gap-2">
          <input className="input" value={makeName} onChange={(e) => setMakeName(e.target.value)} placeholder="e.g. Porsche" />
          <button disabled={busy || !makeName} className="btn-ghost" onClick={() => add("make", { name: makeName }, () => setMakeName(""))}><Plus size={16} /></button>
        </div>
      </Card>

      <Card title="Models" list={options.makes.flatMap((m) => m.models.map((md) => `${m.name} ${md.name}`))}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select className="input" value={modelMakeId} onChange={(e) => setModelMakeId(e.target.value)}>
            <option value="">Select make</option>
            {options.makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input className="input" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Model name" />
          <button disabled={busy || !modelMakeId || !modelName} className="btn-ghost" onClick={() => add("model", { makeId: modelMakeId, name: modelName }, () => setModelName(""))}><Plus size={16} /></button>
        </div>
      </Card>

      <Card title="Fuel types" list={options.fuelTypes.map((f) => f.name)}>
        <div className="flex gap-2">
          <input className="input" value={fuel} onChange={(e) => setFuel(e.target.value)} placeholder="e.g. Plug-in Hybrid" />
          <button disabled={busy || !fuel} className="btn-ghost" onClick={() => add("fuelType", { name: fuel }, () => setFuel(""))}><Plus size={16} /></button>
        </div>
      </Card>

      <Card title="Body styles" list={options.bodyStyles.map((b) => b.name)}>
        <div className="flex gap-2">
          <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="e.g. Convertible" />
          <button disabled={busy || !body} className="btn-ghost" onClick={() => add("bodyStyle", { name: body }, () => setBody(""))}><Plus size={16} /></button>
        </div>
      </Card>

      <Card title="Colours" list={options.colours.map((c) => c.name)}>
        <div className="flex gap-2">
          <input className="input" value={colour} onChange={(e) => setColour(e.target.value)} placeholder="e.g. British Racing Green" />
          <button disabled={busy || !colour} className="btn-ghost" onClick={() => add("colour", { name: colour }, () => setColour(""))}><Plus size={16} /></button>
        </div>
      </Card>
    </div>
  );
}
