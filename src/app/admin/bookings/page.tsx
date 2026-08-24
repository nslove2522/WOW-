"use client";

import { useEffect, useState } from "react";

import { AdminDatabaseSetupHint, AdminSetupNotice } from "@/components/admin/setup-notice";
import { formatPrice } from "@/lib/tours";

type BookingRow = {
  id: string;
  tour_title: string;
  tour_slug: string;
  travel_date: string;
  seats: number;
  amount: number;
  payment_mode: string;
  status: string;
  paid_at: string;
  traveler: { name: string; email: string; phone: string; city: string } | null;
};

export default function BookingsPage() {
  const [rows, setRows] = useState<BookingRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/bookings")
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { bookings?: BookingRow[]; error?: string };
        if (!response.ok) {
          setError(data.error || "Could not load bookings.");
          return;
        }
        setRows(data.bookings ?? []);
      })
      .catch(() => setError("Could not load bookings."));
  }, []);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Bookings</p>
      <h1 className="mt-2 font-heading text-4xl">Who paid for which trip</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Confirmed after Razorpay verifies the payment. Amounts are in rupees.
      </p>
      {error ? (
        <AdminSetupNotice error={error}>
          This is not “no bookings yet.” Guests still pay on the public checkout.{" "}
          <AdminDatabaseSetupHint />
        </AdminSetupNotice>
      ) : null}
      {error ? null : !rows ? (
        <p className="mt-10 text-muted-foreground">Loading bookings…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No bookings yet. They appear here once a guest completes Razorpay checkout.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Travelers</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Paid</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.traveler?.name || "Guest"}</p>
                    <p className="text-muted-foreground">{row.traveler?.email || row.id}</p>
                    <p className="text-muted-foreground">{row.traveler?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{row.tour_title}</p>
                    <p className="text-muted-foreground">{row.travel_date}</p>
                  </td>
                  <td className="px-4 py-3">{row.seats}</td>
                  <td className="px-4 py-3">
                    {formatPrice(row.amount)} · {row.payment_mode}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(row.paid_at).toLocaleString("en-IN")}
                    <span className="mt-1 block capitalize">{row.status}</span>
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
