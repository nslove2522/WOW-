import { NextResponse } from "next/server";

import { isRazorpayConfigured, razorpayKeyId } from "@/lib/razorpay";

export const runtime = "nodejs";

export function GET() {
  const id = razorpayKeyId();
  const mode = id.startsWith("rzp_live_") ? "live" : id.startsWith("rzp_test_") ? "test" : null;
  return NextResponse.json({ enabled: isRazorpayConfigured(), mode });
}
