import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { telHref, mailtoHref, whatsappHref, type SiteContact } from "@/lib/site";

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
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Get in touch</h3>
          <ul className="space-y-2.5 text-sm text-[rgb(var(--muted))]">
            <li><a href={telHref(contact.phone)} className="flex items-center gap-2 hover:text-[rgb(var(--fg))]"><Phone size={15} /> {contact.phone}</a></li>
            <li><a href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I have an enquiry.")} className="flex items-center gap-2 hover:text-[rgb(var(--fg))]">WhatsApp {contact.phone}</a></li>
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
