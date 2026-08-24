import type { ReactNode } from "react";

export function AdminSetupNotice({ error, children }: { error: string; children: ReactNode }) {
  return (
    <div className="mt-8 space-y-3 rounded-xl bg-destructive/10 p-4 text-sm leading-6 text-destructive">
      <p>{error}</p>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}

export function AdminDatabaseSetupHint() {
  return (
    <>
      After you add <code className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</code> and run{" "}
      <code className="text-foreground">supabase/schema.sql</code>, the owner desk reads live rows
      instead of this setup message.
    </>
  );
}
