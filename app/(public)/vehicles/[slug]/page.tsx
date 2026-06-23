import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Check, Gauge, Calendar, Fuel, Cog, Users, DoorOpen, Palette, Zap } from "lucide-react";
import { getVehicleBySlug, getSimilar } from "@/lib/vehicles";
import { getSiteContact, SITE, telHref, mailtoHref, whatsappHref } from "@/lib/site";
import { formatPrice, formatMileage, formatDate, STATUS_LABEL } from "@/lib/utils";
import { VehicleGallery } from "@/components/VehicleGallery";
import { EnquiryForm } from "@/components/EnquiryForm";
import { VehicleCard } from "@/components/VehicleCard";
import { TrackView } from "@/components/TrackView";
import { ShareButtons } from "@/components/ShareButtons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const v = await getVehicleBySlug(params.slug);
  if (!v) return { title: "Vehicle not found" };
  const image = v.media.find((m) => m.type === "IMAGE")?.url;
  return {
    title: v.metaTitle || v.title,
    description: v.metaDescription || v.description?.slice(0, 155) || v.title,
    alternates: { canonical: `/vehicles/${v.slug}` },
    openGraph: {
      title: v.metaTitle || v.title,
      description: v.metaDescription || v.title,
      images: image ? [image] : undefined,
      type: "website",
    },
  };
}

const SpecRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number | null }) =>
  value ? (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm">
      <span className="flex items-center gap-2 text-[rgb(var(--muted))]"><Icon size={15} /> {label}</span>
      <span className="font-medium">{value}</span>
    </div>
  ) : null;

export default async function VehiclePage({ params }: { params: { slug: string } }) {
  const v = await getVehicleBySlug(params.slug);
  if (!v) notFound();

  const contact = await getSiteContact();
  const similar = await getSimilar(v.id, v.makeId, v.bodyStyleId);
  const url = `${SITE.url}/vehicles/${v.slug}`;
  const image = v.media.find((m) => m.type === "IMAGE")?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: v.title,
    description: v.description ?? undefined,
    image: image ? [image] : undefined,
    brand: { "@type": "Brand", name: v.make.name },
    model: v.model.name,
    vehicleModelDate: String(v.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "SMI" },
    fuelType: v.fuelType?.name,
    vehicleTransmission: v.transmission ?? undefined,
    color: v.colour?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: v.price,
      availability: v.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url,
    },
  };

  const enquiryBody = `I'm interested in the ${v.title} (${formatPrice(v.price)}). Please get in touch.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackView id={v.id} slug={v.slug} />

      <nav className="mb-4 text-sm text-[rgb(var(--muted))]">
        <Link href="/" className="hover:text-[rgb(var(--fg))]">Home</Link> ·{" "}
        <Link href="/inventory" className="hover:text-[rgb(var(--fg))]">Inventory</Link> ·{" "}
        <span className="text-[rgb(var(--fg))]">{v.make.name} {v.model.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: media + info */}
        <div>
          <VehicleGallery items={v.media.map((m) => ({ id: m.id, type: m.type, url: m.url, embedUrl: m.embedUrl, alt: m.alt }))} />

          <div className="mt-6 flex items-center justify-between">
            <span className={`chip border ${v.status === "AVAILABLE" ? "border-emerald-400/30 text-emerald-300" : v.status === "RESERVED" ? "border-amber-400/30 text-amber-300" : "border-rose-400/30 text-rose-300"}`}>
              {STATUS_LABEL[v.status]}
            </span>
            <ShareButtons url={url} title={v.title} />
          </div>

          {v.description && (
            <section className="glass mt-6 p-6">
              <h2 className="font-display text-xl font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[rgb(var(--muted))]">{v.description}</p>
            </section>
          )}

          {v.features.length > 0 && (
            <section className="glass mt-6 p-6">
              <h2 className="font-display text-xl font-semibold">Key features</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {v.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check size={15} className="text-accent" /> {f}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="glass mt-6 p-6">
            <h2 className="font-display text-xl font-semibold">Specifications</h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <div>
                <SpecRow icon={Calendar} label="Year" value={v.year} />
                <SpecRow icon={Gauge} label="Mileage" value={formatMileage(v.mileage)} />
                <SpecRow icon={Cog} label="Transmission" value={v.transmission} />
                <SpecRow icon={Fuel} label="Fuel type" value={v.fuelType?.name} />
                <SpecRow icon={Zap} label="Engine" value={v.engineSize} />
                <SpecRow icon={Zap} label="Horsepower" value={v.horsepower ? `${v.horsepower} bhp` : null} />
                <SpecRow icon={Cog} label="Drivetrain" value={v.drivetrain} />
              </div>
              <div>
                <SpecRow icon={Palette} label="Colour" value={v.colour?.name} />
                <SpecRow icon={DoorOpen} label="Doors" value={v.doors} />
                <SpecRow icon={Users} label="Seats" value={v.seats} />
                <SpecRow icon={Calendar} label="Registration" value={v.registration} />
                <SpecRow icon={Users} label="Owners" value={v.owners} />
                <SpecRow icon={Check} label="MOT until" value={v.motExpiry ? formatDate(v.motExpiry) : null} />
                <SpecRow icon={Check} label="Body style" value={v.bodyStyle?.name} />
              </div>
            </div>
          </section>

          {(v.serviceHistory || v.warranty) && (
            <section className="glass mt-6 p-6">
              <h2 className="font-display text-xl font-semibold">History &amp; assurance</h2>
              <div className="mt-3 space-y-2 text-sm text-[rgb(var(--muted))]">
                {v.serviceHistory && <p><span className="text-[rgb(var(--fg))] font-medium">Service history:</span> {v.serviceHistory}</p>}
                {v.warranty && <p><span className="text-[rgb(var(--fg))] font-medium">Warranty:</span> {v.warranty}</p>}
              </div>
            </section>
          )}
        </div>

        {/* Right: sticky enquiry rail */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
          <div className="glass p-6">
            <h1 className="font-display text-2xl font-extrabold leading-tight">{v.title}</h1>
            <p className="mt-2 text-3xl font-bold heading-gradient">{formatPrice(v.price)}</p>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">{v.year} · {formatMileage(v.mileage)} · {v.fuelType?.name} · {v.transmission}</p>

            <div className="mt-5 space-y-2">
              <a href={telHref(contact.phone)} className="btn-accent w-full"><Phone size={16} /> Call {contact.phone}</a>
              <a href={whatsappHref(contact.whatsapp, enquiryBody)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><MessageCircle size={16} /> WhatsApp enquiry</a>
              <a href={mailtoHref(contact.email, `Enquiry: ${v.title}`, enquiryBody)} className="btn-ghost w-full"><Mail size={16} /> Email enquiry</a>
            </div>
          </div>

          <EnquiryForm vehicleId={v.id} vehicleTitle={v.title} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold heading-gradient">Similar vehicles</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => <VehicleCard key={s.id} v={s} phone={contact.phone} />)}
          </div>
        </section>
      )}
    </div>
  );
}
