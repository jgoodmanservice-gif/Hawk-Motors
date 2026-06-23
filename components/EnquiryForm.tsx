"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function EnquiryForm({ vehicleId, vehicleTitle }: { vehicleId?: string; vehicleTitle?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: vehicleTitle ? `I'm interested in the ${vehicleTitle}. Please get in touch.` : "" });
  // Honeypot — bots fill this hidden field; humans don't.
  const [website, setWebsite] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // spam
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vehicleId, vehicleTitle, type: "EMAIL" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass p-6 text-center">
        <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
        <h3 className="mt-3 font-display text-lg font-semibold">Enquiry sent</h3>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">Thanks — we&apos;ll be in touch shortly. For a faster response, call or WhatsApp us.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass space-y-3 p-6">
      <h3 className="font-display text-lg font-semibold">Email enquiry</h3>
      {vehicleTitle && <p className="text-xs text-[rgb(var(--muted))]">About: {vehicleTitle}</p>}

      <input className="hidden" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} aria-hidden />

      <div>
        <label className="label">Name</label>
        <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Message</label>
        <textarea rows={4} className="input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>

      {status === "error" && <p className="text-sm text-rose-400">Something went wrong. Please try again or call us.</p>}

      <button disabled={status === "sending"} className="btn-accent w-full">
        <Send size={16} /> {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
