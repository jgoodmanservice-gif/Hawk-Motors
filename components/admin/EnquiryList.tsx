"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MessageCircle, Check, Archive, Trash2, Car } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Enquiry = {
  id: string; type: string; status: string; name: string;
  email: string | null; phone: string | null; message: string | null;
  vehicleTitle: string | null; createdAt: string;
};

const FILTERS = ["ALL", "NEW", "CONTACTED", "COMPLETED", "ARCHIVED"];
const statusChip: Record<string, string> = {
  NEW: "border-accent/40 text-accent",
  CONTACTED: "border-amber-400/30 text-amber-300",
  COMPLETED: "border-emerald-400/30 text-emerald-300",
  ARCHIVED: "text-[rgb(var(--muted))]",
};

export function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState<string | null>(null);

  const shown = filter === "ALL" ? enquiries : enquiries.filter((e) => e.status === filter);

  async function update(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/enquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBusy(null);
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    setBusy(id);
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  const TypeIcon = ({ t }: { t: string }) => t === "CALLBACK" ? <Phone size={14} /> : t === "WHATSAPP" ? <MessageCircle size={14} /> : <Mail size={14} />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? "border-accent/50 text-accent" : ""}`}>
            {f} {f !== "ALL" && `(${enquiries.filter((e) => e.status === f).length})`}
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul className="space-y-3">
          {shown.map((e) => (
            <li key={e.id} className={`glass p-4 ${busy === e.id ? "opacity-50" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{e.name}</span>
                    <span className={`chip ${statusChip[e.status]}`}><TypeIcon t={e.type} /> {e.status}</span>
                  </div>
                  {e.vehicleTitle && <p className="mt-1 flex items-center gap-1.5 text-sm text-accent"><Car size={14} /> {e.vehicleTitle}</p>}
                  <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-[rgb(var(--muted))]">
                    {e.email && <a href={`mailto:${e.email}`} className="hover:text-[rgb(var(--fg))]">{e.email}</a>}
                    {e.phone && <a href={`tel:${e.phone}`} className="hover:text-[rgb(var(--fg))]">{e.phone}</a>}
                    <span>{formatDate(e.createdAt)}</span>
                  </div>
                  {e.message && <p className="mt-2 max-w-2xl text-sm">{e.message}</p>}
                </div>
                <div className="flex gap-1">
                  {e.status !== "CONTACTED" && <button onClick={() => update(e.id, "CONTACTED")} title="Mark contacted" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"><Phone size={15} /></button>}
                  {e.status !== "COMPLETED" && <button onClick={() => update(e.id, "COMPLETED")} title="Mark completed" className="grid h-8 w-8 place-items-center rounded-lg text-emerald-300 hover:bg-emerald-500/10"><Check size={15} /></button>}
                  <button onClick={() => update(e.id, "ARCHIVED")} title="Archive" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"><Archive size={15} /></button>
                  <button onClick={() => remove(e.id)} title="Delete" className="grid h-8 w-8 place-items-center rounded-lg text-rose-300 hover:bg-rose-500/10"><Trash2 size={15} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass p-12 text-center text-[rgb(var(--muted))]">No enquiries in this view.</div>
      )}
    </div>
  );
}
