"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";

type Settings = {
  accentR: number; accentG: number; accentB: number;
  phone: string; whatsapp: string; email: string;
  addressLine: string; openingHours: string; mapEmbedUrl: string;
};

const PRESETS: { name: string; rgb: [number, number, number] }[] = [
  { name: "Silver / chrome", rgb: [197, 199, 205] },
  { name: "Gold", rgb: [212, 175, 55] },
  { name: "Electric blue", rgb: [56, 132, 255] },
  { name: "Deep red", rgb: [220, 38, 38] },
];

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hex = `#${[s.accentR, s.accentG, s.accentB].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  function setHex(h: string) {
    const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    setS({ ...s, accentR: r, accentG: g, accentB: b });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); router.refresh(); }
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6" style={{ ["--accent" as string]: `${s.accentR} ${s.accentG} ${s.accentB}` }}>
      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Accent colour</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-12 w-16 cursor-pointer rounded-lg border bg-transparent" />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button type="button" key={p.name} onClick={() => setS({ ...s, accentR: p.rgb[0], accentG: p.rgb[1], accentB: p.rgb[2] })}
                className="chip" style={{ borderColor: `rgb(${p.rgb.join(",")})`, color: `rgb(${p.rgb.join(",")})` }}>
                {p.name}
              </button>
            ))}
          </div>
          <span className="btn-accent pointer-events-none ml-auto">Preview</span>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Contact details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1"><label className="label">Phone (display + click-to-call)</label><input className="input" value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} /></div>
          <div className="space-y-1"><label className="label">WhatsApp number (international, e.g. 447…)</label><input className="input" value={s.whatsapp} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} /></div>
          <div className="space-y-1"><label className="label">Email</label><input className="input" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></div>
          <div className="space-y-1"><label className="label">Address line</label><input className="input" value={s.addressLine} onChange={(e) => setS({ ...s, addressLine: e.target.value })} /></div>
          <div className="space-y-1 md:col-span-2"><label className="label">Opening hours</label><input className="input" value={s.openingHours} onChange={(e) => setS({ ...s, openingHours: e.target.value })} /></div>
          <div className="space-y-1 md:col-span-2"><label className="label">Google Maps embed URL</label><input className="input" value={s.mapEmbedUrl} onChange={(e) => setS({ ...s, mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?…" /></div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-emerald-400">Saved ✓</span>}
        <button disabled={saving} className="btn-accent"><Save size={16} /> {saving ? "Saving…" : "Save settings"}</button>
      </div>
    </form>
  );
}
