# WOW — Wings of Women

A women-only trip site for **WOW (Wings of Women)**: browse hosted tours, register, book the Seetharkundu Falls day trip, and pay with **Razorpay** (card or UPI).

Accounts and bookings live in **Supabase** when you add your project keys, so every traveler shares the same cloud data. Without keys, this machine still runs a local demo in the browser. Without Razorpay keys, checkout records a local receipt and does not charge.

## Host it so everyone can use it

Supabase holds sign-in and bookings. [Vercel](https://vercel.com) (or any Next.js host) serves the website. Razorpay collects the payment.

### 1. Create a Supabase project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Go to **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql), and run it.
3. Authentication → Providers → Email: turn **off** “Confirm email” if you want people to enter the site right after they register.
4. Project Settings → API: copy **Project URL** and **anon public** key.

### 2. Put the keys on the host

Copy `.env.example` to `.env.local` for your laptop:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

On Vercel: Import this Git repo → Project Settings → Environment Variables → add the same names for Production (and Preview) → Deploy.

Use **test** keys while you try the flow. Switch to **live** keys (`rzp_live_…`) only on HTTPS. Live Checkout will not run on `http://localhost`.

Get keys from [Razorpay Dashboard → Account & Settings → API Keys](https://dashboard.razorpay.com/app/website-app-settings/api-keys). Never put `RAZORPAY_KEY_SECRET` in client code or `NEXT_PUBLIC_` variables.

### 3. Deploy

```bash
npm install
npm run build
```

Or click **Deploy** on Vercel after the env vars are saved. The public URL is then the site anyone can open.

Authentication → URL configuration: set **Site URL** to your Vercel domain (for example `https://wow-wings-of-women.vercel.app`).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

Without Supabase keys, a demo traveler still works on this device only:

- Email: `aisha@wingsofwomen.test`
- Password: `wander2026`

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth + Postgres, Razorpay Checkout.
