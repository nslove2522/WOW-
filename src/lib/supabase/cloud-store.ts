import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Booking, PaymentMode, PublicUser } from "@/lib/types";

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  created_at: string;
};

type BookingRow = {
  id: string;
  user_id: string;
  tour_slug: string;
  tour_title: string;
  travel_date: string;
  seats: number;
  amount: number;
  payment_mode: PaymentMode;
  status: "confirmed" | "cancelled";
  paid_at: string;
};

function toUser(row: ProfileRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    country: row.country,
    state: row.state,
    city: row.city,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    tourSlug: row.tour_slug,
    tourTitle: row.tour_title,
    travelDate: row.travel_date,
    seats: row.seats,
    amount: row.amount,
    paymentMode: row.payment_mode,
    status: row.status,
    paidAt: row.paid_at,
  };
}

async function upsertProfile(row: {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  phone: string;
}): Promise<PublicUser> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "id" })
    .select("id, name, email, country, state, city, phone, created_at")
    .single();
  if (error) throw new Error(error.message);
  return toUser(data as ProfileRow);
}

async function fetchProfile(userId: string, email: string, meta?: Record<string, unknown>): Promise<PublicUser | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, country, state, city, phone, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) {
    const row = data as ProfileRow;
    if (row.name && row.phone) return toUser(row);
  }
  const name = String(meta?.name ?? data?.name ?? "");
  const country = String(meta?.country ?? data?.country ?? "IN");
  const state = String(meta?.state ?? data?.state ?? "");
  const city = String(meta?.city ?? data?.city ?? "");
  const phone = String(meta?.phone ?? data?.phone ?? "");
  try {
    return await upsertProfile({
      id: userId,
      email,
      name,
      country: country || "IN",
      state,
      city,
      phone,
    });
  } catch {
    return data ? toUser(data as ProfileRow) : null;
  }
}

export async function loadCloudSession(): Promise<{
  user: PublicUser | null;
  bookings: Booking[];
}> {
  const supabase = createSupabaseBrowserClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const authUser = sessionData.session?.user;
  if (!authUser) return { user: null, bookings: [] };
  const user = await fetchProfile(
    authUser.id,
    authUser.email ?? "",
    (authUser.user_metadata ?? {}) as Record<string, unknown>,
  );
  if (!user) return { user: null, bookings: [] };
  const bookings = await listCloudBookings();
  return { user, bookings };
}

export function subscribeCloudAuth(onChange: () => void) {
  const supabase = createSupabaseBrowserClient();
  const { data } = supabase.auth.onAuthStateChange(() => {
    onChange();
  });
  return () => data.subscription.unsubscribe();
}

function mapAuthError(message: string) {
  if (/rate limit/i.test(message) && /email/i.test(message)) {
    return "Too many confirmation emails were sent. Wait about an hour, or in Supabase go to Authentication → Providers → Email and turn off Confirm email, then try again. If this email already registered, use Sign in.";
  }
  return message;
}

export async function registerCloudUser(input: {
  name: string;
  email: string;
  password: string;
  country: string;
  state: string;
  city: string;
  phone: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      data: {
        name: input.name.trim(),
        country: input.country,
        state: input.state.trim(),
        city: input.city.trim(),
        phone: input.phone.trim(),
      },
    },
  });
  if (error) throw new Error(mapAuthError(error.message));
  if (!data.session || !data.user) {
    throw new Error(
      "Account created. Confirm your email from the message Supabase sent, then sign in.",
    );
  }
  await upsertProfile({
    id: data.user.id,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    country: input.country,
    state: input.state.trim(),
    city: input.city.trim(),
    phone: input.phone.trim(),
  });
}

export async function signInCloud(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw new Error(mapAuthError(error.message));
}

export async function signOutCloud() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCloudProfile(
  userId: string,
  patch: { name: string; city: string; phone: string; state?: string },
) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: patch.name,
      city: patch.city,
      phone: patch.phone,
      state: patch.state ?? "",
    })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

export async function listCloudBookings(): Promise<Booking[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, tour_slug, tour_title, travel_date, seats, amount, payment_mode, status, paid_at",
    )
    .order("paid_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BookingRow[] | null)?.map(toBooking) ?? [];
}

export async function createCloudBooking(
  input: Omit<Booking, "id" | "paidAt" | "status"> & { id?: string },
): Promise<Booking> {
  const supabase = createSupabaseBrowserClient();
  const id = input.id ?? `WOW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  if (input.id) {
    const { data: existing } = await supabase
      .from("bookings")
      .select(
        "id, user_id, tour_slug, tour_title, travel_date, seats, amount, payment_mode, status, paid_at",
      )
      .eq("id", input.id)
      .maybeSingle();
    if (existing) return toBooking(existing as BookingRow);
  }
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      id,
      user_id: input.userId,
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
  return toBooking(data as BookingRow);
}

export async function cancelCloudBooking(bookingId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}
