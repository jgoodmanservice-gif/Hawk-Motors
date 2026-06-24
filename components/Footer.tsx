import Link from "next/link";
import { Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { Logo } from "./Logo";
import { telHref, whatsappHref, type SiteContact } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Footer({ contact }: { contact: SiteContact }) {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="full" className="h-20 w-40" />
          <p className="mt-3 max-w-sm text-sm text-[rgb(var(--muted))]">
            Leicester&apos;s premium used car dealer. Handpicked and fully prepared vehicles, competitive prices, and a fast, friendly, no-pressure buying experience.
          </p>
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">Serving Leicester, Leicestershire &amp; the East Midlands.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://www.facebook.com/hawkmotorsleicester" target="_blank" rel="noopener noreferrer" aria-label="Hawk Motors on Facebook" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 transition"><Facebook size={15} /></a>
            <a href="https://www.instagram.com/hawkmotorsleicester" target="_blank" rel="noopener noreferrer" aria-label="Hawk Motors on Instagram" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 transition"><Instagram size={15} /></a>
            <a href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I have an enquiry.")} target="_blank" rel="noopener noreferrer" aria-label="Message Hawk Motors on WhatsApp" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 transition"><WhatsAppIcon /></a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Explore</h3>
          <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
            <li><Link href="/inventory" className="hover:text-[rgb(var(--fg))]">All vehicles</Link></li>
            <li><Link href="/inventory?status=AVAILABLE" rel="nofollow" className="hover:text-[rgb(var(--fg))]">Available now</Link></li>
            <li><Link href="/#why" className="hover:text-[rgb(var(--fg))]">Why choose us</Link></li>
            <li><Link href="/#contact" className="hover:text-[rgb(var(--fg))]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Contact us</h3>
          <ul className="space-y-2.5 text-sm text-[rgb(var(--muted))]">
            <li><a href={telHref(contact.phone)} className="flex items-center gap-2 hover:text-[rgb(var(--fg))]"><Phone size={15} /> {contact.phone}</a></li>
            <li><a href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I have an enquiry.")} className="flex items-center gap-2 hover:text-[rgb(var(--fg))]"><WhatsAppIcon /> WhatsApp us</a></li>
            {contact.addressLine && <li className="flex items-center gap-2"><MapPin size={15} /> {contact.addressLine}</li>}
            <li className="flex items-center gap-2"><Clock size={15} /> {contact.openingHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-[rgb(var(--muted))]">
        © {new Date().getFullYear()} Hawk Motors. All rights reserved. ·{" "}
        <Link href="/admin" className="hover:text-[rgb(var(--fg))]">Admin</Link>
      </div>
    </footer>
  );
}
