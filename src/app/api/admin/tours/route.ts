import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/require-owner";
import { slugFromTitle } from "@/lib/slug";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rowToTour, tourToRow, type TourRecord } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await requireOwner();
  if (blocked) return blocked;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("schema cache") || error.message.includes("does not exist")
            ? "The trips table is missing. In Supabase → SQL Editor, run supabase/schema.sql (or the tours section at the bottom), then try again."
            : error.message,
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ tours: (data ?? []).map((row) => rowToTour(row)) });
}

export async function POST(request: Request) {
  const blocked = await requireOwner();
  if (blocked) return blocked;

  let body: Partial<TourRecord>;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim() ?? "";
  if (!title) {
    return NextResponse.json({ error: "Give the trip a name." }, { status: 400 });
  }

  const slug = (body.slug?.trim() || slugFromTitle(title)).toLowerCase();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tours")
    .insert(tourToRow({ ...body, slug, title }))
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Another trip already uses that web address (slug)." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ tour: rowToTour(data) });
}
