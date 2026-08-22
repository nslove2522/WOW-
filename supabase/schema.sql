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
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
