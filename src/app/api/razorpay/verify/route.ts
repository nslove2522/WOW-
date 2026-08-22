import { NextResponse } from "next/server";

import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  isRazorpayConfigured,
  orderTicketMatches,
  paiseToRupees,
  paymentMethodToMode,
  razorpayErrorMessage,
  verifyCheckoutSignature,
} from "@/lib/razorpay";
import { getTour } from "@/lib/tours";
import { saveServerBooking } from "@/lib/supabase/server-booking";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  ticket?: string;
  slug?: string;
  seats?: number;
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
  const ticket = body.ticket?.trim() ?? "";
  const slug = body.slug?.trim() ?? "";
  const seats = Number(body.seats);
  if (!orderId || !paymentId || !signature || !ticket || !slug) {
    return NextResponse.json({ error: "Missing Razorpay payment fields." }, { status: 400 });
  }

  const tour = getTour(slug);
  if (!tour || !Number.isInteger(seats) || seats < 1) {
    return NextResponse.json({ error: "Trip details for this payment are invalid." }, { status: 400 });
  }

  const amountPaise = tour.price * seats * 100;
  if (
    !orderTicketMatches({
      ticket,
      orderId,
      slug,
      seats,
      amountPaise,
    })
  ) {
    return NextResponse.json({ error: "Payment ticket did not match this order." }, { status: 400 });
  }

  if (!verifyCheckoutSignature({ orderId, paymentId, signature })) {
    return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });
  }

  try {
    const [order, payment] = await Promise.all([
      fetchRazorpayOrder(orderId),
      fetchRazorpayPayment(paymentId),
    ]);

    if (String(payment.order_id) !== String(order.id)) {
      return NextResponse.json({ error: "Payment does not belong to this order." }, { status: 400 });
    }

    const status = String(payment.status);
    if (status !== "captured" && status !== "authorized") {
      return NextResponse.json({ error: `Payment is ${status}, not complete.` }, { status: 400 });
    }

    if (Number(order.amount) !== amountPaise || Number(payment.amount) !== amountPaise) {
      return NextResponse.json({ error: "Paid amount does not match the trip price." }, { status: 400 });
    }

    const paymentMode = paymentMethodToMode(payment.method);
    const amount = paiseToRupees(amountPaise);

    try {
      await saveServerBooking({
        id: paymentId,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        travelDate: tour.nextDate,
        seats,
        amount,
        paymentMode,
      });
    } catch (error) {
      return NextResponse.json({
        ok: true,
        bookingId: paymentId,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        travelDate: tour.nextDate,
        seats,
        amount,
        paymentMode,
        persistError: razorpayErrorMessage(error),
      });
    }

    return NextResponse.json({
      ok: true,
      bookingId: paymentId,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      travelDate: tour.nextDate,
      seats,
      amount,
      paymentMode,
    });
  } catch (error) {
    return NextResponse.json({ error: razorpayErrorMessage(error) }, { status: 502 });
  }
}
