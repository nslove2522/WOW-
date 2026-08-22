import crypto from "node:crypto";
import Razorpay from "razorpay";

import type { PaymentMode } from "@/lib/types";

export function razorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID?.trim() || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";
}

export function razorpayKeySecret() {
  return process.env.RAZORPAY_KEY_SECRET?.trim() || "";
}

export function isRazorpayConfigured() {
  return Boolean(razorpayKeyId() && razorpayKeySecret());
}

export function getRazorpayClient() {
  if (!isRazorpayConfigured()) {
    throw new Error("Razorpay keys are not set. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return new Razorpay({
    key_id: razorpayKeyId(),
    key_secret: razorpayKeySecret(),
  });
}

export function amountToPaise(rupees: number) {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number) {
  return Math.round(paise / 100);
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
