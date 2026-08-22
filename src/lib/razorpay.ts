import crypto from "node:crypto";

import type { PaymentMode } from "@/lib/types";

function cleanEnv(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "") ?? "";
}

export function razorpayKeyId() {
  return cleanEnv(process.env.RAZORPAY_KEY_ID) || cleanEnv(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
}

export function razorpayKeySecret() {
  return cleanEnv(process.env.RAZORPAY_KEY_SECRET);
}

export function isRazorpayConfigured() {
  const id = razorpayKeyId();
  const secret = razorpayKeySecret();
  return Boolean(id && secret && id.startsWith("rzp_"));
}

type RazorpayErrorBody = {
  error?: { description?: string; reason?: string };
};

async function razorpayRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isRazorpayConfigured()) {
    throw new Error("Razorpay keys are not set. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }

  const auth = Buffer.from(`${razorpayKeyId()}:${razorpayKeySecret()}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json()) as T & RazorpayErrorBody;
  if (!response.ok) {
    throw new Error(
      data.error?.description || data.error?.reason || `Razorpay request failed (${response.status}).`,
    );
  }
  return data;
}

export function createRazorpayOrder(input: {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
}) {
  return razorpayRequest<{ id: string; amount: number | string; currency: string }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes,
    }),
  });
}

export function fetchRazorpayOrder(orderId: string) {
  return razorpayRequest<{ id: string; amount: number | string; currency: string }>(
    `/orders/${encodeURIComponent(orderId)}`,
  );
}

export function fetchRazorpayPayment(paymentId: string) {
  return razorpayRequest<{
    id: string;
    order_id: string;
    amount: number | string;
    status: string;
    method?: string;
  }>(`/payments/${encodeURIComponent(paymentId)}`);
}

export function amountToPaise(rupees: number) {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number) {
  return Math.round(paise / 100);
}

export function signOrderTicket(input: {
  orderId: string;
  slug: string;
  seats: number;
  amountPaise: number;
}) {
  const body = `${input.orderId}|${input.slug}|${input.seats}|${input.amountPaise}`;
  return crypto.createHmac("sha256", razorpayKeySecret()).update(body).digest("hex");
}

export function orderTicketMatches(input: {
  ticket: string;
  orderId: string;
  slug: string;
  seats: number;
  amountPaise: number;
}) {
  const expected = signOrderTicket(input);
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(input.ticket, "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function verifyCheckoutSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const expected = crypto
    .createHmac("sha256", razorpayKeySecret())
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(input.signature, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function paymentMethodToMode(method: string | undefined): PaymentMode {
  if (method === "card") return "card";
  if (method === "upi") return "upi";
  return "razorpay";
}

export function razorpayErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Razorpay request failed.";
}
