import { NextResponse } from "next/server";

import { ADMIN_COOKIE, adminPasswordConfigured, adminSessionToken, passwordMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json(
      {
        error:
          "Set ADMIN_PASSWORD on the host (Vercel → Settings → Environment Variables), then Redeploy. That is the password for this owner desk.",
      },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = body.password?.trim() ?? "";
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "That password does not match." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: await adminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
