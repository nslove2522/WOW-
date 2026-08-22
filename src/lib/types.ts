export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "password">;

export type PaymentMode = "card" | "upi" | "razorpay" | "netbanking" | "wallet";

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  userId: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  seats: number;
  amount: number;
  paymentMode: PaymentMode;
  status: BookingStatus;
  paidAt: string;
};

export const PAYMENT_LABELS: Record<PaymentMode, string> = {
  card: "Card (Razorpay)",
  upi: "UPI (Razorpay)",
  razorpay: "Razorpay",
  netbanking: "Net banking",
  wallet: "Digital wallet",
};
