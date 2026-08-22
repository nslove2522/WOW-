import { NextResponse } from "next/server";

import { isRazorpayConfigured } from "@/lib/razorpay";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";

export function GET() {
  const url = supabaseUrl();
  const anonKey = supabaseAnonKey();
  return NextResponse.json({
    supabaseUrl: url,
    supabaseAnonKey: anonKey,
    supabase: Boolean(url && anonKey),
    razorpay: isRazorpayConfigured(),
  });
}
