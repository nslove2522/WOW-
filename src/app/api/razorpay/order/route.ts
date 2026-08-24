import { NextResponse } from "next/server";

import { brand } from "@/lib/brand";
import {
  amountToPaise,
  createRazorpayOrder,
  isRazorpayConfigured,
  razorpayErrorMessage,
  razorpayKeyId,
  signOrderTicket,
} from "@/lib/razorpay";
import { getPublishedTour } from "@/lib/catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Razorpay keys are missing on this host. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel Production (and Preview), then redeploy.",
      },
      { status: 503 },
    );
  }

  let body: { slug?: string; seats?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const tour = typeof body.slug === "string" ? await getPublishedTour(body.slug) : undefined;
  const seats = Number(body.seats);
  if (!tour) {
    return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  }
  if (!Number.isInteger(seats) || seats < 1) {
    return NextResponse.json({ error: "Choose at least one traveler." }, { status: 400 });
  }

  const amountPaise = amountToPaise(tour.price * seats);
  const receipt = `wow_${Date.now().toString(36)}`.slice(0, 40);

  try {
    const order = await createRazorpayOrder({
      amountPaise,
      receipt,
      notes: {
        tour_slug: tour.slug,
        seats: String(seats),
      },
    });

    const orderId = String(order.id);
    return NextResponse.json({
      keyId: razorpayKeyId(),
      orderId,
      amount: amountPaise,
      currency: "INR",
      name: brand.full,
      description: `${tour.title} · ${seats} traveler${seats > 1 ? "s" : ""}`,
      ticket: signOrderTicket({
        orderId,
        slug: tour.slug,
        seats,
        amountPaise,
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: razorpayErrorMessage(error) }, { status: 502 });
  }
}
