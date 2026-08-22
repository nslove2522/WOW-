import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

let runtimeUrl = "";
let runtimeAnonKey = "";

export function setSupabaseRuntime(url: string, anonKey: string) {
  runtimeUrl = url.trim();
  runtimeAnonKey = anonKey.trim();
}

export function runtimeSupabaseUrl() {
  return runtimeUrl || supabaseUrl();
}

export function runtimeSupabaseAnonKey() {
  return runtimeAnonKey || supabaseAnonKey();
}

export function isRuntimeSupabaseEnabled() {
  return Boolean(runtimeSupabaseUrl() && runtimeSupabaseAnonKey());
}
