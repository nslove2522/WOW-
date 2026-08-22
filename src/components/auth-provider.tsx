"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
import {
  cancelCloudBooking,
  createCloudBooking,
  listCloudBookings,
  loadCloudSession,
  registerCloudUser,
  signInCloud,
  signOutCloud,
  subscribeCloudAuth,
  updateCloudProfile,
} from "@/lib/supabase/cloud-store";
import { isSupabaseEnabled } from "@/lib/supabase/env";
import type { Booking, PaymentMode, PublicUser } from "@/lib/types";

type Snapshot = {
  user: PublicUser | null;
  bookings: Booking[];
  ready: boolean;
};

type AuthContextValue = {
  user: PublicUser | null;
  bookings: Booking[];
  ready: boolean;
  cloud: boolean;
  register: (input: {
    name: string;
    email: string;
    password: string;
    country: string;
    state: string;
    city: string;
    phone: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (patch: {
    name: string;
    city: string;
    phone: string;
    state?: string;
  }) => Promise<void>;
  payForTour: (input: {
    id?: string;
    tourSlug: string;
    tourTitle: string;
    travelDate: string;
    seats: number;
    amount: number;
    paymentMode: PaymentMode;
  }) => Promise<Booking>;
  cancel: (bookingId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readLocalSnapshot(): Snapshot {
  const user = getSessionUser();
  return {
    user,
    bookings: user ? listBookings(user.id) : [],
    ready: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const cloud = isSupabaseEnabled();
  const [snapshot, setSnapshot] = useState<Snapshot>({
    user: null,
    bookings: [],
    ready: false,
  });

  const refreshCloud = useCallback(async () => {
    const next = await loadCloudSession();
    setSnapshot({ ...next, ready: true });
  }, []);

  useEffect(() => {
    if (!cloud) {
      setSnapshot(readLocalSnapshot());
      return subscribeStore(() => setSnapshot(readLocalSnapshot()));
    }
    void refreshCloud();
    return subscribeCloudAuth(() => {
      void refreshCloud();
    });
  }, [cloud, refreshCloud]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: snapshot.user,
      bookings: snapshot.bookings,
      ready: snapshot.ready,
      cloud,
      register: async (input) => {
        if (cloud) {
          await registerCloudUser(input);
          await refreshCloud();
          return;
        }
        registerUser(input);
        setSnapshot(readLocalSnapshot());
      },
      signIn: async (email, password) => {
        if (cloud) {
          await signInCloud(email, password);
          await refreshCloud();
          return;
        }
        signInUser(email, password);
        setSnapshot(readLocalSnapshot());
      },
      signOut: async () => {
        if (cloud) {
          await signOutCloud();
          await refreshCloud();
          return;
        }
        signOutUser();
        setSnapshot(readLocalSnapshot());
      },
      saveProfile: async (patch) => {
        if (!snapshot.user) return;
        if (cloud) {
          await updateCloudProfile(snapshot.user.id, patch);
          await refreshCloud();
          return;
        }
        updateUser(snapshot.user.id, patch);
        setSnapshot(readLocalSnapshot());
      },
      payForTour: async (input) => {
        if (!snapshot.user) throw new Error("Sign in to pay.");
        if (cloud) {
          const booking = await createCloudBooking({
            ...input,
            userId: snapshot.user.id,
          });
          const bookings = await listCloudBookings();
          setSnapshot((current) => ({ ...current, bookings }));
          return booking;
        }
        const booking = createBooking({ ...input, userId: snapshot.user.id });
        setSnapshot(readLocalSnapshot());
        return booking;
      },
      cancel: async (bookingId) => {
        if (!snapshot.user) return;
        if (cloud) {
          await cancelCloudBooking(bookingId);
          await refreshCloud();
          return;
        }
        cancelBooking(snapshot.user.id, bookingId);
        setSnapshot(readLocalSnapshot());
      },
    }),
    [cloud, refreshCloud, snapshot],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
