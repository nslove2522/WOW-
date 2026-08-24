import { NextResponse } from "next/server";

import { adminPasswordConfigured, isOwnerSignedIn } from "@/lib/admin-auth";
import { isAdminDatabaseReady } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    signedIn: await isOwnerSignedIn(),
    passwordConfigured: adminPasswordConfigured(),
    databaseReady: isAdminDatabaseReady(),
  });
}
