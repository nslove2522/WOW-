"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAYMENT_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/tours";

function PortalBody() {
  const { user, ready, bookings, saveProfile, cancel, signOut } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paidId = searchParams.get("paid");
  const paid = bookings.find((booking) => booking.id === paidId);

  const confirmed = useMemo(
    () => bookings.filter((booking) => booking.status === "confirmed"),
    [bookings],
  );
  const cancelled = useMemo(
    () => bookings.filter((booking) => booking.status === "cancelled"),
    [bookings],
  );

  if (!ready) {
    return <div className="py-20 text-center text-muted-foreground">Opening your portal…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-heading text-3xl">Sign in to your portal</h1>
        <p className="mt-3 text-muted-foreground">
          Bookings, receipts, and your traveler profile live here.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button nativeButton={false} render={<Link href="/sign-in?next=/portal" />}>
            Sign in
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/register?next=/portal" />}>
            Register
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Traveler portal</p>
          <h1 className="mt-1 font-heading text-4xl">Hello, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { signOut(); router.push("/"); }}>
          Sign out
        </Button>
      </div>

      {paid ? (
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-medium text-primary">Payment received (demo)</p>
          <p className="mt-1 text-sm leading-6">
            Booking {paid.id} is confirmed for {paid.tourTitle} on {paid.travelDate}. Receipt
            is in Trips below.
          </p>
        </div>
      ) : null}

      <Tabs defaultValue="trips" className="mt-10">
        <TabsList>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="trips" className="mt-6 space-y-6">
          {confirmed.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="font-heading text-2xl">No trips yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse the catalog and pay from a tour page. Your receipt will land here.
              </p>
              <Button className="mt-5" nativeButton={false} render={<Link href="/tours" />}>
                See tours
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {confirmed.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-heading text-2xl">{booking.tourTitle}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {booking.travelDate} · {booking.seats} traveler
                        {booking.seats > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Badge>Confirmed</Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {booking.id} · {PAYMENT_LABELS[booking.paymentMode]} ·{" "}
                      {formatPrice(booking.amount)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/tours/${booking.tourSlug}`} />}
                      >
                        Tour details
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => cancel(booking.id)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {cancelled.length > 0 ? (
            <div>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">Cancelled</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {cancelled.map((booking) => (
                  <li key={booking.id}>
                    {booking.tourTitle} · {booking.id}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileForm
            name={user.name}
            city={user.city}
            phone={user.phone}
            onSave={saveProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileForm({
  name: initialName,
  city: initialCity,
  phone: initialPhone,
  onSave,
}: {
  name: string;
  city: string;
  phone: string;
  onSave: (patch: { name: string; city: string; phone: string }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [phone, setPhone] = useState(initialPhone);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ name, city, phone });
        setSaved(true);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <p className="text-sm text-muted-foreground">Email cannot be changed in this demo.</p>
      <Button type="submit">Save profile</Button>
      {saved ? <p className="text-sm text-primary">Profile updated on this device.</p> : null}
    </form>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Opening portal…</div>}>
      <PortalBody />
    </Suspense>
  );
}
