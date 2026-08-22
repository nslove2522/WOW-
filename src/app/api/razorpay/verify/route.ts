import { NextResponse } from "next/server";

import {
  getRazorpayClient,
  isRazorpayConfigured,
  paiseToRupees,
  paymentMethodToMode,
  verifyCheckoutSignature,
} from "@/lib/razorpay";
import { getTour } from "@/lib/tours";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const orderId = body.razorpay_order_id?.trim() ?? "";
  const paymentId = body.razorpay_payment_id?.trim() ?? "";
  const signature = body.razorpay_signature?.trim() ?? "";
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing Razorpay payment fields." }, { status: 400 });
  }

  if (!verifyCheckoutSignature({ orderId, paymentId, signature })) {
    return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayClient();
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      razorpay.payments.fetch(paymentId),
    ]);

    if (payment.order_id !== order.id) {
      return NextResponse.json({ error: "Payment does not belong to this order." }, { status: 400 });
    }

    const status = String(payment.status);
    if (status !== "captured" && status !== "authorized") {
      return NextResponse.json({ error: `Payment is ${status}, not complete.` }, { status: 400 });
    }

    const notes = (order.notes ?? {}) as Record<string, string>;
    const slug = notes.tour_slug;
    const seats = Number(notes.seats);
    const tour = slug ? getTour(slug) : undefined;
    if (!tour || !Number.isInteger(seats) || seats < 1) {
      return NextResponse.json({ error: "Order notes are incomplete." }, { status: 400 });
    }

    const expectedPaise = tour.price * seats * 100;
    if (Number(order.amount) !== expectedPaise || Number(payment.amount) !== expectedPaise) {
      return NextResponse.json({ error: "Paid amount does not match the trip price." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      bookingId: paymentId,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      travelDate: tour.nextDate,
      seats,
      amount: paiseToRupees(expectedPaise),
      paymentMode: paymentMethodToMode(String(payment.method)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not confirm payment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
