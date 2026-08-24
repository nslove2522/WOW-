import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { supabaseUrl } from "@/lib/supabase/env";

export function supabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isAdminDatabaseReady() {
  return Boolean(supabaseUrl() && supabaseServiceRoleKey());
}

export function createSupabaseAdminClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error(
      "Owner desk needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the host.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
