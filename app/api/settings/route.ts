import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const s = await prisma.siteSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return NextResponse.json(s);
}

const schema = z.object({
  accentR: z.coerce.number().int().min(0).max(255).optional(),
  accentG: z.coerce.number().int().min(0).max(255).optional(),
  accentB: z.coerce.number().int().min(0).max(255).optional(),
  phone: z.string().max(40).optional(),
  whatsapp: z.string().max(40).optional(),
  email: z.string().email().optional(),
  addressLine: z.string().max(200).optional(),
  openingHours: z.string().max(200).optional(),
  mapEmbedUrl: z.string().max(1000).optional(),
});

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.flatten() }, { status: 400 });
  const s = await prisma.siteSetting.upsert({ where: { id: 1 }, update: parsed.data, create: { id: 1, ...parsed.data } });
  return NextResponse.json(s);
}
