// Pure, dependency-free contact helpers + types.
// Safe to import from client components (no Prisma / server-only code here).

export const SITE = {
  name: "Hawk Motors",
  tagline: "Premium cars, exceptional service",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export type SiteContact = {
  phone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  openingHours: string;
  mapEmbedUrl: string;
  accent: { r: number; g: number; b: number };
};

export const DEFAULT_CONTACT: SiteContact = {
  phone: process.env.NEXT_PUBLIC_PHONE || "07514552586",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "447514552586",
  email: process.env.NEXT_PUBLIC_EMAIL || "enquiries@hawkmotors.co.uk",
  addressLine: "",
  openingHours: "Mon–Sat 9:00–18:00 · Sun by appointment",
  mapEmbedUrl: "",
  accent: { r: 197, g: 199, b: 205 },
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function whatsappHref(whatsapp: string, text?: string) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}${q}`;
}

export function mailtoHref(email: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}
