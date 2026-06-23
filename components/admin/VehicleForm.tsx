"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Save, Plus, X, ArrowUp, ArrowDown, Upload, Loader2, Video } from "lucide-react";
import type { FilterOptions } from "@/lib/types";
import { youtubeThumb } from "@/lib/utils";

type MediaItem = { type: string; url: string; embedUrl?: string | null; alt?: string | null; position: number };

export type VehicleFormData = {
  id?: string;
  title?: string;
  status: string;
  featured: boolean;
  price: number | "";
  makeId: string;
  modelId: string;
  fuelTypeId: string;
  bodyStyleId: string;
  colourId: string;
  variant: string;
  year: number | "";
  registration: string;
  mileage: number | "";
  engineSize: string;
  horsepower: number | "";
  transmission: string;
  drivetrain: string;
  doors: number | "";
  seats: number | "";
  description: string;
  features: string[];
  serviceHistory: string;
  motExpiry: string;
  owners: number | "";
  warranty: string;
  metaTitle: string;
  metaDescription: string;
  media: MediaItem[];
};

export const emptyVehicle: VehicleFormData = {
  status: "AVAILABLE", featured: false, price: "", makeId: "", modelId: "", fuelTypeId: "",
  bodyStyleId: "", colourId: "", variant: "", year: "", registration: "", mileage: "",
  engineSize: "", horsepower: "", transmission: "", drivetrain: "", doors: "", seats: "",
  description: "", features: [], serviceHistory: "", motExpiry: "", owners: "", warranty: "",
  metaTitle: "", metaDescription: "", media: [],
};

const VIDEO_TYPES = ["VIDEO_YOUTUBE", "VIDEO_VIMEO", "VIDEO_WALKAROUND", "VIDEO_INTERIOR"];

export function VehicleForm({ initial, options }: { initial: VehicleFormData; options: FilterOptions }) {
  const router = useRouter();
  const [v, setV] = useState<VehicleFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const set = <K extends keyof VehicleFormData>(k: K, val: VehicleFormData[K]) => setV((p) => ({ ...p, [k]: val }));
  const models = useMemo(() => options.makes.find((m) => m.id === v.makeId)?.models ?? [], [options.makes, v.makeId]);

  function addMedia(item: Omit<MediaItem, "position">) {
    setV((p) => ({ ...p, media: [...p.media, { ...item, position: p.media.length }] }));
  }
  function removeMedia(i: number) {
    setV((p) => ({ ...p, media: p.media.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, position: idx })) }));
  }
  function moveMedia(i: number, dir: -1 | 1) {
    setV((p) => {
      const arr = [...p.media];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, media: arr.map((m, idx) => ({ ...m, position: idx })) };
    });
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      (data.urls as string[] | undefined)?.forEach((url) => addMedia({ type: "IMAGE", url, alt: v.title || "" }));
    } catch {
      setError("Upload failed. Check your storage configuration.");
    }
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!v.makeId || !v.modelId || v.price === "" || v.year === "" || v.mileage === "") {
      setError("Make, model, price, year and mileage are required.");
      return;
    }
    setSaving(true);
    const payload = {
      ...v,
      price: Number(v.price), year: Number(v.year), mileage: Number(v.mileage),
      horsepower: v.horsepower === "" ? null : Number(v.horsepower),
      doors: v.doors === "" ? null : Number(v.doors),
      seats: v.seats === "" ? null : Number(v.seats),
      owners: v.owners === "" ? null : Number(v.owners),
      motExpiry: v.motExpiry || null,
    };
    const res = await fetch(v.id ? `/api/vehicles/${v.id}` : "/api/vehicles", {
      method: v.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Save failed. Please check the fields and try again.");
      return;
    }
    router.push("/admin/vehicles");
    router.refresh();
  }

  const field = "space-y-1";
  return (
    <form onSubmit={submit} className="space-y-6">
      {error && <div className="glass border-rose-400/30 p-3 text-sm text-rose-300">{error}</div>}

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={field}><label className="label">Make *</label>
            <select className="input" value={v.makeId} onChange={(e) => { set("makeId", e.target.value); set("modelId", ""); }}>
              <option value="">Select make</option>
              {options.makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className={field}><label className="label">Model *</label>
            <select className="input" value={v.modelId} onChange={(e) => set("modelId", e.target.value)} disabled={!v.makeId}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className={field}><label className="label">Variant / trim</label><input className="input" value={v.variant} onChange={(e) => set("variant", e.target.value)} placeholder="e.g. AMG Line Premium Plus" /></div>
          <div className={field}><label className="label">Title (auto if blank)</label><input className="input" value={v.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
          <div className={field}><label className="label">Price (£) *</label><input type="number" className="input" value={v.price} onChange={(e) => set("price", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Status</label>
            <select className="input" value={v.status} onChange={(e) => set("status", e.target.value)}>
              {["AVAILABLE", "RESERVED", "SOLD", "DRAFT"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} /> Feature on homepage</label>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Specifications</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={field}><label className="label">Year *</label><input type="number" className="input" value={v.year} onChange={(e) => set("year", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Mileage *</label><input type="number" className="input" value={v.mileage} onChange={(e) => set("mileage", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Registration</label><input className="input" value={v.registration} onChange={(e) => set("registration", e.target.value)} /></div>
          <div className={field}><label className="label">Fuel type</label>
            <select className="input" value={v.fuelTypeId} onChange={(e) => set("fuelTypeId", e.target.value)}>
              <option value="">—</option>{options.fuelTypes.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className={field}><label className="label">Transmission</label>
            <select className="input" value={v.transmission} onChange={(e) => set("transmission", e.target.value)}>
              <option value="">—</option><option>Automatic</option><option>Manual</option>
            </select>
          </div>
          <div className={field}><label className="label">Drivetrain</label>
            <select className="input" value={v.drivetrain} onChange={(e) => set("drivetrain", e.target.value)}>
              <option value="">—</option><option>FWD</option><option>RWD</option><option>AWD</option>
            </select>
          </div>
          <div className={field}><label className="label">Engine size</label><input className="input" value={v.engineSize} onChange={(e) => set("engineSize", e.target.value)} placeholder="2.0L" /></div>
          <div className={field}><label className="label">Horsepower</label><input type="number" className="input" value={v.horsepower} onChange={(e) => set("horsepower", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Body style</label>
            <select className="input" value={v.bodyStyleId} onChange={(e) => set("bodyStyleId", e.target.value)}>
              <option value="">—</option>{options.bodyStyles.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className={field}><label className="label">Colour</label>
            <select className="input" value={v.colourId} onChange={(e) => set("colourId", e.target.value)}>
              <option value="">—</option>{options.colours.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className={field}><label className="label">Doors</label><input type="number" className="input" value={v.doors} onChange={(e) => set("doors", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Seats</label><input type="number" className="input" value={v.seats} onChange={(e) => set("seats", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">Owners</label><input type="number" className="input" value={v.owners} onChange={(e) => set("owners", e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div className={field}><label className="label">MOT expiry</label><input type="date" className="input" value={v.motExpiry} onChange={(e) => set("motExpiry", e.target.value)} /></div>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Description &amp; features</h2>
        <div className={field}><label className="label">Description</label><textarea rows={5} className="input resize-none" value={v.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div className="mt-4">
          <label className="label">Key features</label>
          <div className="flex gap-2">
            <input className="input" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (featureInput.trim()) { set("features", [...v.features, featureInput.trim()]); setFeatureInput(""); } } }}
              placeholder="Type a feature and press Enter" />
            <button type="button" className="btn-ghost" onClick={() => { if (featureInput.trim()) { set("features", [...v.features, featureInput.trim()]); setFeatureInput(""); } }}><Plus size={16} /></button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {v.features.map((f, i) => (
              <span key={i} className="chip border-accent/30">{f}<button type="button" onClick={() => set("features", v.features.filter((_, idx) => idx !== i))}><X size={12} /></button></span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className={field}><label className="label">Service history</label><input className="input" value={v.serviceHistory} onChange={(e) => set("serviceHistory", e.target.value)} /></div>
          <div className={field}><label className="label">Warranty</label><input className="input" value={v.warranty} onChange={(e) => set("warranty", e.target.value)} /></div>
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Media</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Add image by URL</label>
            <div className="flex gap-2">
              <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
              <button type="button" className="btn-ghost" onClick={() => { if (imageUrl.trim()) { addMedia({ type: "IMAGE", url: imageUrl.trim(), alt: v.title || "" }); setImageUrl(""); } }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <label className="label">Upload images</label>
            <label className="btn-ghost w-full cursor-pointer">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {uploading ? "Uploading…" : "Choose files"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Add video (YouTube / Vimeo / walkaround URL)</label>
            <div className="flex gap-2">
              <input className="input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" />
              <button type="button" className="btn-ghost" onClick={() => {
                if (!videoUrl.trim()) return;
                const type = videoUrl.includes("vimeo") ? "VIDEO_VIMEO" : "VIDEO_YOUTUBE";
                addMedia({ type, url: videoUrl.trim(), embedUrl: videoUrl.trim(), alt: v.title || "" });
                setVideoUrl("");
              }}><Video size={16} /></button>
            </div>
          </div>
        </div>

        {v.media.length > 0 && (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {v.media.map((m, i) => {
              const isVid = VIDEO_TYPES.includes(m.type);
              const thumb = isVid ? youtubeThumb(m.embedUrl || m.url) : m.url;
              return (
                <li key={i} className="glass overflow-hidden">
                  <div className="relative aspect-video bg-ink-800">
                    {thumb ? <Image src={thumb} alt="" fill className="object-cover" sizes="240px" /> : <div className="grid h-full place-items-center text-xs text-[rgb(var(--muted))]">{isVid ? "Video" : "Image"}</div>}
                    {i === 0 && !isVid && <span className="absolute left-2 top-2 chip border-accent/40 bg-black/50 text-white">Cover</span>}
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="truncate text-xs text-[rgb(var(--muted))]">{isVid ? "🎬 Video" : `Image ${i + 1}`}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveMedia(i, -1)} className="grid h-7 w-7 place-items-center rounded hover:bg-white/10"><ArrowUp size={13} /></button>
                      <button type="button" onClick={() => moveMedia(i, 1)} className="grid h-7 w-7 place-items-center rounded hover:bg-white/10"><ArrowDown size={13} /></button>
                      <button type="button" onClick={() => removeMedia(i)} className="grid h-7 w-7 place-items-center rounded text-rose-300 hover:bg-rose-500/10"><X size={13} /></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">SEO</h2>
        <div className="grid gap-4">
          <div className={field}><label className="label">Meta title</label><input className="input" value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></div>
          <div className={field}><label className="label">Meta description</label><textarea rows={2} className="input resize-none" value={v.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></div>
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end gap-2">
        <button type="button" onClick={() => router.push("/admin/vehicles")} className="btn-ghost">Cancel</button>
        <button disabled={saving} className="btn-accent"><Save size={16} /> {saving ? "Saving…" : v.id ? "Save changes" : "Create vehicle"}</button>
      </div>
    </form>
  );
}
