import { Phone, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { telHref, mailtoHref, whatsappHref, type SiteContact } from "@/lib/site";

export function ContactSection({ contact }: { contact: SiteContact }) {
  return (
    <section id="contact" className="mx-auto max-w-screen-2xl px-4 py-20">
      <div className="glass grid gap-8 p-6 md:grid-cols-2 md:p-10">
        <div>
          <h2 className="font-display text-3xl font-extrabold heading-gradient">Get in touch</h2>
          <p className="mt-2 text-[rgb(var(--muted))]">
            Speak to the team directly. Call, WhatsApp or email and we&apos;ll get straight back to you.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telHref(contact.phone)} className="btn-accent"><Phone size={16} /> {contact.phone}</a>
            <a href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I have an enquiry.")} className="btn-whatsapp"><MessageCircle size={16} /> WhatsApp</a>
            <a href={mailtoHref(contact.email)} className="btn-ghost"><Mail size={16} /> Email</a>
          </div>

          <ul className="mt-7 space-y-3 text-sm text-[rgb(var(--muted))]">
            <li className="flex items-center gap-2"><Clock size={16} className="text-accent" /> {contact.openingHours}</li>
            {contact.addressLine && <li className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> {contact.addressLine}</li>}
            <li className="flex items-center gap-2"><Mail size={16} className="text-accent" /> {contact.email}</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 min-h-[260px]">
          {contact.mapEmbedUrl ? (
            <iframe
              title="Hawk Motors location"
              src={contact.mapEmbedUrl}
              className="h-full min-h-[260px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="grid h-full min-h-[260px] place-items-center bg-ink-800 p-6 text-center text-sm text-[rgb(var(--muted))]">
              <div>
                <MapPin className="mx-auto mb-2 text-accent" />
                Add your Google Maps embed URL in the admin Settings to display your location here.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
