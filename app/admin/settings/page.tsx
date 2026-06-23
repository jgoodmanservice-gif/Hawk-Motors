import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const s = await prisma.siteSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold heading-gradient">Settings</h1>
      <p className="mb-6 text-sm text-[rgb(var(--muted))]">Configure your brand accent colour and contact details. Changes apply across the whole site.</p>
      <SettingsForm initial={{
        accentR: s.accentR, accentG: s.accentG, accentB: s.accentB,
        phone: s.phone, whatsapp: s.whatsapp, email: s.email,
        addressLine: s.addressLine, openingHours: s.openingHours, mapEmbedUrl: s.mapEmbedUrl,
      }} />
    </div>
  );
}
