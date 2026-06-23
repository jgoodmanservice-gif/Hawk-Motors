import { prisma } from "@/lib/prisma";
import { EnquiryList } from "@/components/admin/EnquiryList";

export const dynamic = "force-dynamic";

export default async function AdminEnquiries() {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  const enquiries = rows.map((e) => ({
    id: e.id, type: e.type, status: e.status, name: e.name,
    email: e.email, phone: e.phone, message: e.message,
    vehicleTitle: e.vehicleTitle, createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold heading-gradient">Enquiries</h1>
      <p className="mb-6 text-sm text-[rgb(var(--muted))]">Customer contact requests. Email notifications are sent on arrival when SMTP is configured.</p>
      <EnquiryList enquiries={enquiries} />
    </div>
  );
}
