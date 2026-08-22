import crypto from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";

import type { PaymentMode } from "@/lib/types";

type RazorpayClient = {
  orders: {
    create: (payload: {
      amount: number;
      currency: string;
      receipt: string;
      notes?: Record<string, string>;
    }) => Promise<{ id: string; amount: number | string; currency: string }>;
    fetch: (id: string) => Promise<{
      id: string;
      amount: number | string;
      currency: string;
      notes?: Record<string, string> | null;
    }>;
  };
  payments: {
    fetch: (id: string) => Promise<{
      id: string;
      order_id: string;
      amount: number | string;
      status: string;
      method?: string;
    }>;
  };
};

type RazorpayCtor = new (options: { key_id: string; key_secret: string }) => RazorpayClient;

function loadRazorpayCtor(): RazorpayCtor {
  const require = createRequire(path.join(process.cwd(), "package.json"));
  const mod = require("razorpay") as RazorpayCtor | { default: RazorpayCtor };
  if (typeof mod === "function") return mod;
  return mod.default;
}

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

export function getRazorpayClient() {
  if (!isRazorpayConfigured()) {
    throw new Error("Razorpay keys are not set. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  const Razorpay = loadRazorpayCtor();
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
  if (typeof error === "object" && error) {
    const record = error as {
      error?: { description?: string; reason?: string };
      description?: string;
      message?: string;
    };
    if (record.error?.description) return record.error.description;
    if (record.error?.reason) return record.error.reason;
    if (typeof record.description === "string") return record.description;
    if (typeof record.message === "string") return record.message;
  }
  return "Razorpay request failed.";
}
