import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/guard";

// Issues short-lived tokens so the browser uploads images straight to Vercel Blob.
// Files never pass through this function, which avoids Vercel's 4.5 MB request body limit.
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not set. Add Vercel Blob storage in your Vercel project." }, { status: 500 });
  }

  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await requireAdmin())) throw new Error("Unauthorized");
        if (!pathname.startsWith("vehicles/")) throw new Error("Invalid upload path");
        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 400 });
  }
}
