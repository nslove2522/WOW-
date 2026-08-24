export const ADMIN_COOKIE = "wow_owner";

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function adminSessionToken() {
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret) return "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode("wow-owner-desk"));
  return hex(signature);
}

export async function isAdminToken(value: string | undefined | null) {
  const expected = await adminSessionToken();
  if (!expected || !value) return false;
  return safeEqual(value, expected);
}
