import { NextResponse } from "next/server";

import { brand } from "@/lib/brand";
import {
  amountToPaise,
  getRazorpayClient,
  isRazorpayConfigured,
  razorpayKeyId,
} from "@/lib/razorpay";
import { getTour } from "@/lib/tours";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 503 },
    );
  }

  let body: { slug?: string; seats?: number; userId?: string; preferredMethod?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const tour = typeof body.slug === "string" ? getTour(body.slug) : undefined;
  const seats = Number(body.seats);
  if (!tour) {
    return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  }
  if (!Number.isInteger(seats) || seats < 1) {
    return NextResponse.json({ error: "Choose at least one traveler." }, { status: 400 });
  }

  const amount = amountToPaise(tour.price * seats);
  const receipt = `wow_${Date.now().toString(36)}`.slice(0, 40);

  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        tour_slug: tour.slug,
        seats: String(seats),
        user_id: body.userId?.slice(0, 40) ?? "",
        preferred_method: body.preferredMethod === "card" ? "card" : "upi",
      },
    });

    return NextResponse.json({
      keyId: razorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: brand.full,
      description: `${tour.title} · ${seats} traveler${seats > 1 ? "s" : ""}`,
      image: "/wow-logo.png",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create Razorpay order.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
