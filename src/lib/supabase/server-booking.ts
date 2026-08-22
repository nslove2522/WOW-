import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/env";
import type { PaymentMode } from "@/lib/types";

export async function saveServerBooking(input: {
  id: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  seats: number;
  amount: number;
  paymentMode: PaymentMode;
}) {
  if (!isSupabaseEnabled()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("bookings")
    .select(
      "id, user_id, tour_slug, tour_title, travel_date, seats, amount, payment_mode, status, paid_at",
    )
    .eq("id", input.id)
    .maybeSingle();
  if (existing) return existing;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      id: input.id,
      user_id: user.id,
      tour_slug: input.tourSlug,
      tour_title: input.tourTitle,
      travel_date: input.travelDate,
      seats: input.seats,
      amount: input.amount,
      payment_mode: input.paymentMode,
      status: "confirmed",
    })
    .select(
      "id, user_id, tour_slug, tour_title, travel_date, seats, amount, payment_mode, status, paid_at",
    )
    .single();
  if (error) throw new Error(error.message);
  return data;
}
