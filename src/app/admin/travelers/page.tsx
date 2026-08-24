"use client";

import { useEffect, useState } from "react";

type Traveler = {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  created_at: string;
};

export default function TravelersPage() {
  const [people, setPeople] = useState<Traveler[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/travelers")
      .then(async (response) => {
        const data = (await response.json()) as { travelers?: Traveler[]; error?: string };
        if (!response.ok) {
          setError(data.error || "Could not load profiles.");
          setPeople([]);
          return;
        }
        setPeople(data.travelers ?? []);
      })
      .catch(() => setError("Could not load profiles."));
  }, []);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Registered women</p>
      <h1 className="mt-2 font-heading text-4xl">Profiles from the public site</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Anyone who created an account on the booking portal appears here. You do not need the
        database screens for this list.
      </p>
      {error ? <p className="mt-8 text-sm text-destructive">{error}</p> : null}
      {!people ? (
        <p className="mt-10 text-muted-foreground">Loading profiles…</p>
      ) : people.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No accounts yet. When someone registers on the public site, they show up here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Place</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{person.name || "—"}</td>
                  <td className="px-4 py-3">{person.email}</td>
                  <td className="px-4 py-3">{person.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {[person.city, person.state, person.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(person.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
