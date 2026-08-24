import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/require-owner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await requireOwner();
  if (blocked) return blocked;

  const supabase = createSupabaseAdminClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, user_id, tour_slug, tour_title, travel_date, seats, amount, payment_mode, status, paid_at")
    .order("paid_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = [...new Set((bookings ?? []).map((row) => row.user_id).filter(Boolean))];
  let profiles: Record<string, { name: string; email: string; phone: string; city: string }> = {};
  if (userIds.length > 0) {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, name, email, phone, city")
      .in("id", userIds);
    for (const person of people ?? []) {
      profiles[person.id] = {
        name: person.name,
        email: person.email,
        phone: person.phone,
        city: person.city,
      };
    }
  }

  return NextResponse.json({
    bookings: (bookings ?? []).map((row) => ({
      ...row,
      traveler: profiles[row.user_id] ?? null,
    })),
  });
}
