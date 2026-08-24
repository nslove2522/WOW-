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

On Vercel: Project → Settings → Environment Variables. Add these for **Production and Preview**:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL (`https://xxxx.supabase.co`, no `/rest/v1`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
- `RAZORPAY_KEY_ID` — Key Id from Razorpay, for example `rzp_test_…` or `rzp_live_…`
- `RAZORPAY_KEY_SECRET` — Key Secret from the same pair

Without the two Supabase names, register and pay only store data in the browser. The `profiles` and `bookings` tables stay empty. After saving variables, **Redeploy** Production.

Paste the values with no quotes around them.

Use **test** keys while you try the ₹1 trip. Switch to **live** keys (`rzp_live_…`) only on HTTPS. Live Checkout will not run on `http://localhost`. Test and live keys cannot be mixed.

Get keys from [Razorpay Dashboard → Account & Settings → API Keys](https://dashboard.razorpay.com/app/website-app-settings/api-keys). Never put `RAZORPAY_KEY_SECRET` in client code or `NEXT_PUBLIC_` variables.

If the public site asks for Vercel login, turn off Deployment Protection for Production so Razorpay Checkout can be used by travelers.

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


## Owner desk (no backend knowledge needed)

The public site reads trip details from Supabase. The owner updates them on a separate **owner desk** at `/admin` — same website, different door.

1. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) (safe to run again). That creates the `tours` table, seeds Seetharkundu Falls, and a public photo bucket.
2. In Supabase → Project Settings → API, copy the **service_role** key. This key can read every profile and booking. Keep it server-only.
3. Add these host variables (Vercel Production + Preview), then **Redeploy**:

- `ADMIN_PASSWORD` — the password the owner types at `/admin/login`
- `SUPABASE_SERVICE_ROLE_KEY` — service_role secret (never `NEXT_PUBLIC_`)

4. Bookmark `https://your-domain/admin`. Sign in with `ADMIN_PASSWORD`.
5. Use **Trips** to change the name, date, amount, photos, and whether the trip is live. **Registered women** and **Bookings** show who signed up and who paid.

When a trip is saved and marked live, the public catalog, trip page, and Razorpay amount update from that record. No code change is required.

If those extra variables are missing, travelers still see the built-in Seetharkundu trip. The owner desk will explain what to add.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth + Postgres, Razorpay Checkout.
