import { cookies } from "next/headers";

import { ADMIN_COOKIE, adminSessionToken, isAdminToken } from "@/lib/admin-token";

export { ADMIN_COOKIE };

export function adminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export { adminSessionToken, isAdminToken };

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function isOwnerSignedIn() {
  const store = await cookies();
  return isAdminToken(store.get(ADMIN_COOKIE)?.value);
}
