import { prisma } from "./prisma";
import { DEFAULT_CONTACT, type SiteContact } from "./contact";

// Re-export pure helpers/types so existing `@/lib/site` server imports keep working.
export { SITE, telHref, whatsappHref, mailtoHref, type SiteContact } from "./contact";

/** Server-side: read live settings, falling back to env defaults. */
export async function getSiteContact(): Promise<SiteContact> {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (!s) return DEFAULT_CONTACT;
    return {
      phone: s.phone,
      whatsapp: s.whatsapp,
      email: s.email,
      addressLine: s.addressLine,
      openingHours: s.openingHours,
      mapEmbedUrl: s.mapEmbedUrl,
      accent: { r: s.accentR, g: s.accentG, b: s.accentB },
    };
  } catch {
    return DEFAULT_CONTACT;
  }
}
