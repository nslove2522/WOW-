import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/require-owner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await requireOwner();
  if (blocked) return blocked;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, country, state, city, phone, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ travelers: data ?? [] });
}
