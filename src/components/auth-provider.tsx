"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import {
  cancelBooking,
  createBooking,
  getSessionUser,
  listBookings,
  registerUser,
  signInUser,
  signOutUser,
  subscribeStore,
  updateUser,
} from "@/lib/store";
import type { Booking, PaymentMode, PublicUser } from "@/lib/types";

type Snapshot = {
  user: PublicUser | null;
  bookings: Booking[];
  ready: boolean;
};

const emptySnapshot: Snapshot = { user: null, bookings: [], ready: false };

let cached: Snapshot = emptySnapshot;

function getClientSnapshot(): Snapshot {
  const user = getSessionUser();
  const bookings = user ? listBookings(user.id) : [];
  const next: Snapshot = { user, bookings, ready: true };
  if (JSON.stringify(cached) === JSON.stringify(next)) return cached;
  cached = next;
  return cached;
}

function getServerSnapshot(): Snapshot {
  return emptySnapshot;
}

type AuthContextValue = {
  user: PublicUser | null;
  bookings: Booking[];
  ready: boolean;
  register: (input: {
    name: string;
    email: string;
    password: string;
    country: string;
    state: string;
    city: string;
    phone: string;
  }) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  saveProfile: (patch: { name: string; city: string; phone: string; state?: string }) => void;
  payForTour: (input: {
    tourSlug: string;
    tourTitle: string;
    travelDate: string;
    seats: number;
    amount: number;
    paymentMode: PaymentMode;
  }) => Booking;
  cancel: (bookingId: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: snapshot.user,
      bookings: snapshot.bookings,
      ready: snapshot.ready,
      register: (input) => {
        registerUser(input);
      },
      signIn: (email, password) => {
        signInUser(email, password);
      },
      signOut: () => {
        signOutUser();
      },
      saveProfile: (patch) => {
        if (!snapshot.user) return;
        updateUser(snapshot.user.id, patch);
      },
      payForTour: (input) => {
        if (!snapshot.user) throw new Error("Sign in to pay.");
        return createBooking({ ...input, userId: snapshot.user.id });
      },
      cancel: (bookingId) => {
        if (!snapshot.user) return;
        cancelBooking(snapshot.user.id, bookingId);
      },
    }),
    [snapshot],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
