import { Phone, MessageCircle, Repeat } from "lucide-react";
import { telHref, whatsappHref, type SiteContact } from "@/lib/contact";
import { Reveal } from "./fx/Reveal";

export function PartExCta({ contact }: { contact: SiteContact }) {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-10">
      <Reveal>
        <div className="spin-border">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[rgb(var(--bg-elev))] px-6 py-12 text-center md:px-12 md:py-16">
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <Repeat className="mx-auto text-accent" size={30} />
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold heading-gradient md:text-5xl">Got a car to part-exchange?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[rgb(var(--muted))]">
              Send us the reg and a few photos on WhatsApp for a fair, no-obligation valuation against your next car.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={whatsappHref(contact.whatsapp, "Hi Hawk Motors, I'd like a part-exchange valuation. My reg is: ")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-6">
                <MessageCircle size={16} /> Get a valuation
              </a>
              <a href={telHref(contact.phone)} className="btn-ghost px-6"><Phone size={16} /> {contact.phone}</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
