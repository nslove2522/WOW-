import { NextResponse } from "next/server";

import { isOwnerSignedIn } from "@/lib/admin-auth";
import { isAdminDatabaseReady } from "@/lib/supabase/admin";

export async function requireOwner() {
  if (!(await isOwnerSignedIn())) {
    return NextResponse.json({ error: "Sign in to the owner desk first." }, { status: 401 });
  }
  if (!isAdminDatabaseReady()) {
    return NextResponse.json(
      {
        error:
          "Add SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL on the host, then redeploy. The service role key is under Supabase → Project Settings → API. Never put it in NEXT_PUBLIC_ names.",
      },
      { status: 503 },
    );
  }
  return null;
}
