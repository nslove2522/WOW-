import { createBrowserClient } from "@supabase/ssr";

import { runtimeSupabaseAnonKey, runtimeSupabaseUrl } from "@/lib/supabase/runtime";

export function createSupabaseBrowserClient() {
  return createBrowserClient(runtimeSupabaseUrl(), runtimeSupabaseAnonKey());
}
