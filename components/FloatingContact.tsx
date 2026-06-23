"use client";

import { MessageCircle } from "lucide-react";
import { whatsappHref, type SiteContact } from "@/lib/contact";

export function FloatingContact({ contact }: { contact: SiteContact }) {
  return (
    <a
      href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I'm interested in a vehicle.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
      style={{ background: "linear-gradient(180deg,#2bd44f,#1faa3d)" }}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
