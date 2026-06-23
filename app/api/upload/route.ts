import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/guard";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll("files") as File[];
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const name = `vehicles/${randomUUID()}.${ext}`;
    const blob = await put(name, file, { access: "public" });
    urls.push(blob.url);
  }
  return NextResponse.json({ urls });
}
