import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/require-owner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rowToTour, tourToRow, type TourRecord } from "@/lib/catalog";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = await requireOwner();
  if (blocked) return blocked;
  const { id } = await params;

  let body: Partial<TourRecord>;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: existing, error: loadError } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError) return NextResponse.json({ error: loadError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: "Trip not found." }, { status: 404 });

  const merged = { ...rowToTour(existing), ...body };
  const { data, error } = await supabase
    .from("tours")
    .update(tourToRow({ ...merged, slug: merged.slug, title: merged.title }))
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tour: rowToTour(data) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = await requireOwner();
  if (blocked) return blocked;
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
