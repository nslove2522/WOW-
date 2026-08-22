import type { Booking, PublicUser, User } from "@/lib/types";

const USERS_KEY = "wow.users";
const SESSION_KEY = "wow.session";
const BOOKINGS_KEY = "wow.bookings";

const demoUser: User = {
  id: "user_demo",
  name: "Aisha Rahman",
  email: "aisha@wingsofwomen.test",
  password: "wander2026",
  city: "Bengaluru",
  phone: "+91 90000 11223",
  createdAt: "2026-04-12T10:00:00.000Z",
};

function emitStoreChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("wow-store"));
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function seedStore() {
  const users = readJson<User[]>(USERS_KEY, []);
  if (!users.some((user) => user.email === demoUser.email)) {
    writeJson(USERS_KEY, [...users, demoUser]);
  }
}

export function listUsers() {
  seedStore();
  return readJson<User[]>(USERS_KEY, [demoUser]);
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  city: string;
  phone: string;
}) {
  const users = listUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const user: User = {
    id: `user_${crypto.randomUUID()}`,
    name: input.name.trim(),
    email,
    password: input.password,
    city: input.city.trim(),
    phone: input.phone.trim(),
    createdAt: new Date().toISOString(),
  };
  writeJson(USERS_KEY, [...users, user]);
  writeJson(SESSION_KEY, user.id);
  emitStoreChange();
  return toPublicUser(user);
}

export function signInUser(email: string, password: string) {
  const users = listUsers();
  const user = users.find(
    (entry) => entry.email === email.trim().toLowerCase() && entry.password === password,
  );
  if (!user) {
    throw new Error("Email or password does not match.");
  }
  writeJson(SESSION_KEY, user.id);
  emitStoreChange();
  return toPublicUser(user);
}

export function signOutUser() {
  window.localStorage.removeItem(SESSION_KEY);
  emitStoreChange();
}

export function getSessionUser(): PublicUser | null {
  seedStore();
  const id = readJson<string | null>(SESSION_KEY, null);
  if (!id) return null;
  const user = listUsers().find((entry) => entry.id === id);
  return user ? toPublicUser(user) : null;
}

export function updateUser(userId: string, patch: Partial<Pick<User, "name" | "city" | "phone">>) {
  const users = listUsers().map((user) =>
    user.id === userId ? { ...user, ...patch } : user,
  );
  writeJson(USERS_KEY, users);
  emitStoreChange();
  const updated = users.find((user) => user.id === userId);
  if (!updated) throw new Error("Account not found.");
  return toPublicUser(updated);
}

export function subscribeStore(onStoreChange: () => void) {
  window.addEventListener("wow-store", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("wow-store", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function listBookings(userId: string) {
  return readJson<Booking[]>(BOOKINGS_KEY, [])
    .filter((booking) => booking.userId === userId)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
}

export function createBooking(booking: Omit<Booking, "id" | "paidAt" | "status">) {
  const full: Booking = {
    ...booking,
    id: `WOW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    paidAt: new Date().toISOString(),
    status: "confirmed",
  };
  const all = readJson<Booking[]>(BOOKINGS_KEY, []);
  writeJson(BOOKINGS_KEY, [full, ...all]);
  emitStoreChange();
  return full;
}

export function cancelBooking(userId: string, bookingId: string) {
  const all = readJson<Booking[]>(BOOKINGS_KEY, []).map((booking) =>
    booking.id === bookingId && booking.userId === userId
      ? { ...booking, status: "cancelled" as const }
      : booking,
  );
  writeJson(BOOKINGS_KEY, all);
  emitStoreChange();
  return all.find((booking) => booking.id === bookingId) ?? null;
}
