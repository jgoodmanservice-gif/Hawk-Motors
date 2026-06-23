import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { sendEnquiryNotification } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  vehicleId: z.string().optional(),
  vehicleTitle: z.string().optional(),
  type: z.enum(["EMAIL", "CALLBACK", "WHATSAPP"]).default("EMAIL"),
  website: z.string().optional(), // honeypot
});

// Public: submit an enquiry.
export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid enquiry", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // silently drop spam

  const enquiry = await prisma.enquiry.create({
    data: {
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      message: d.message || null,
      type: d.type,
      vehicleId: d.vehicleId || null,
      vehicleTitle: d.vehicleTitle || null,
    },
  });

  // Fire-and-forget email notification.
  void sendEnquiryNotification({
    name: d.name, email: d.email, phone: d.phone, message: d.message, vehicleTitle: d.vehicleTitle,
  });

  return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
}

// Admin: list enquiries.
export async function GET(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const enquiries = await prisma.enquiry.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(enquiries);
}
