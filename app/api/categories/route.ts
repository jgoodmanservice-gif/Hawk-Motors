import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { getFilterOptions } from "@/lib/vehicles";
import { slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(await getFilterOptions());
}

const schema = z.object({
  kind: z.enum(["make", "model", "fuelType", "bodyStyle", "colour"]),
  name: z.string().min(1).max(80),
  makeId: z.string().optional(), // required for model
  hex: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const { kind, name, makeId, hex } = parsed.data;

  try {
    if (kind === "make") {
      const row = await prisma.make.create({ data: { name, slug: slugify(name) } });
      return NextResponse.json(row, { status: 201 });
    }
    if (kind === "model") {
      if (!makeId) return NextResponse.json({ error: "makeId required" }, { status: 400 });
      const row = await prisma.model.create({ data: { name, slug: slugify(name), makeId } });
      return NextResponse.json(row, { status: 201 });
    }
    if (kind === "fuelType") return NextResponse.json(await prisma.fuelType.create({ data: { name } }), { status: 201 });
    if (kind === "bodyStyle") return NextResponse.json(await prisma.bodyStyle.create({ data: { name } }), { status: 201 });
    if (kind === "colour") return NextResponse.json(await prisma.colour.create({ data: { name, hex } }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already exists" }, { status: 409 });
  }
  return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
}
