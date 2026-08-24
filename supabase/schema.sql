-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- Then disable "Confirm email" under Authentication → Providers → Email
-- if you want travelers to sign in immediately after register.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  email text not null default '',
  country text not null default 'IN',
  state text not null default '',
  city text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references auth.users on delete cascade,
  tour_slug text not null,
  tour_title text not null,
  travel_date text not null,
  seats integer not null check (seats > 0),
  amount integer not null,
  payment_mode text not null,
  status text not null default 'confirmed',
  paid_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "bookings_own" on public.bookings;
create policy "bookings_own"
  on public.bookings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, country, state, city, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'country', 'IN'),
    coalesce(new.raw_user_meta_data->>'state', ''),
    coalesce(new.raw_user_meta_data->>'city', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    country = excluded.country,
    state = excluded.state,
    city = excluded.city,
    phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.profiles to authenticated, service_role;
grant select, insert, update, delete on table public.bookings to authenticated, service_role;

-- Owner desk: trip catalog the public site reads. Run this whole file even if
-- you already created profiles/bookings — statements are safe to repeat.

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text not null default '',
  region text not null default 'India',
  tagline text not null default '',
  description text not null default '',
  image text not null default '',
  image_alt text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  days integer not null default 1,
  nights integer not null default 0,
  price integer not null default 0,
  difficulty text not null default 'Easy',
  group_size integer not null default 12,
  seats_left integer not null default 12,
  next_date text not null default '',
  host_name text not null default 'Wings of Women',
  host_years integer not null default 1,
  host_bio text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  availability_label text not null default 'Limited slots',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tours enable row level security;

drop policy if exists "tours_public_read" on public.tours;
create policy "tours_public_read"
  on public.tours
  for select
  using (published = true);

grant select on table public.tours to anon, authenticated;
grant select, insert, update, delete on table public.tours to service_role;

insert into public.tours (
  slug, title, location, region, tagline, description, image, image_alt, gallery,
  days, nights, price, difficulty, group_size, seats_left, next_date,
  host_name, host_years, host_bio, highlights, inclusions, exclusions, itinerary,
  availability_label, published
)
values (
  'seetharkundu-falls-kollengodu',
  'Trip to Seetharkundu Falls, Kollengodu',
  'Seetharkundu Falls, Kollengode, Palakkad, Kerala',
  'India',
  'Women only. Strangers today, sisters forever.',
  'A one-day strangers trip for women. Come solo. Leave with stories, friendships, and memories for life. Waterfalls, viewpoints, and hidden gems around Seetharkundu Falls, Kollengodu — plus many more spots to cover. Detailed itinerary will be shared personally.',
  '/tours/seetharkundu-1.jpg',
  'Seetharkundu Falls cascading into a forest river',
  '[
    {"src":"/tours/seetharkundu-1.jpg","alt":"Long-exposure river below Seetharkundu Falls"},
    {"src":"/tours/seetharkundu-2.jpg","alt":"Forest pool and waterfall at Seetharkundu"}
  ]'::jsonb,
  1, 0, 1, 'Easy', 12, 8, 'Saturday, 22 August 2026',
  'Wings of Women', 1,
  'DM @wings._ofwomen or WhatsApp 9489029797. Limited slots. Itinerary details are shared personally.',
  '["Breathtaking waterfalls","Scenic viewpoints","Hidden gems","New friends, unforgettable memories"]'::jsonb,
  '["One-day hosted trip, women-only roster","Local host on the route","Stops at waterfalls, viewpoints, and hidden spots"]'::jsonb,
  '["Personal meals unless listed when we share the itinerary","Travel to the meeting point"]'::jsonb,
  '[{"day":1,"title":"Seetharkundu Falls, Kollengodu","detail":"One-day escape covering waterfalls, viewpoints, and more. The detailed hour-by-hour plan is shared personally after you book."}]'::jsonb,
  'Limited slots',
  true
)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('tour-photos', 'tour-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "tour_photos_public_read" on storage.objects;
create policy "tour_photos_public_read"
  on storage.objects
  for select
  using (bucket_id = 'tour-photos');
