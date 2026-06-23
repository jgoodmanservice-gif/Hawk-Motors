import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public: increment view counter (fire-and-forget from the detail page).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vehicle.update({ where: { id: params.id }, data: { views: { increment: 1 } } });
  } catch {
    /* ignore unknown id */
  }
  return NextResponse.json({ ok: true });
}
