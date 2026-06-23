import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/guard";

/**
 * Local disk upload (development default). For production, swap this handler
 * for an S3 / Cloudflare R2 / Vercel Blob presigned upload and return the CDN URL.
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll("files") as File[];
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, name), bytes);
    urls.push(`/uploads/${name}`);
  }
  return NextResponse.json({ urls });
}
