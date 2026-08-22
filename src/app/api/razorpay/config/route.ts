import { NextResponse } from "next/server";

import { isRazorpayConfigured } from "@/lib/razorpay";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ enabled: isRazorpayConfigured() });
}
