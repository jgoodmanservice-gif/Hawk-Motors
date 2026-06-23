import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

const patchSchema = z.object({ status: z.enum(["NEW", "CONTACTED", "COMPLETED", "ARCHIVED"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const updated = await prisma.enquiry.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.enquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
