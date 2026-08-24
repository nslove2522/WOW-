import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/require-owner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { supabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";

const BUCKET = "tour-photos";

export async function POST(request: Request) {
  const blocked = await requireOwner();
  if (blocked) return blocked;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Keep photos under 8 MB." }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type && !allowed.includes(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, or GIF photo." }, { status: 400 });
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) {
    return NextResponse.json(
      {
        error: error.message.includes("Bucket not found")
          ? "The tour-photos storage bucket is missing. Run supabase/schema.sql in the SQL editor (it creates the bucket)."
          : error.message,
      },
      { status: 500 },
    );
  }

  const publicUrl = `${supabaseUrl().replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({ url: publicUrl });
}
