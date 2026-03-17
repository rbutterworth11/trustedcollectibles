-- ============================================================
-- TrustedCollectibles database schema
-- ============================================================

-- Custom enum types
create type user_role as enum ('buyer', 'seller', 'admin');

create type listing_status as enum (
  'draft',
  'pending_verification',
  'verified',
  'listed',
  'sold',
  'disputed'
);

create type order_status as enum (
  'pending',
  'payment_held',
  'shipped',
  'delivered',
  'completed',
  'refunded',
  'disputed'
);

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  role        user_role not null default 'buyer',
  stripe_account_id  text,
  stripe_onboarded   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Listings
-- ============================================================
create table listings (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references profiles(id) on delete cascade,
  title        text not null,
  description  text not null default '',
  price        integer not null check (price > 0),  -- stored in cents
  category     text not null,
  sport        text not null,
  player       text not null default '',
  year         text,
  condition    text not null,
  authentication_details text,
  images       text[] not null default '{}',
  status       listing_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_listings_seller  on listings(seller_id);
create index idx_listings_status  on listings(status);
create index idx_listings_sport   on listings(sport);

-- ============================================================
-- Orders
-- ============================================================
create table orders (
  id                      uuid primary key default gen_random_uuid(),
  listing_id              uuid not null references listings(id) on delete restrict,
  buyer_id                uuid not null references profiles(id) on delete restrict,
  seller_id               uuid not null references profiles(id) on delete restrict,
  amount                  integer not null check (amount > 0),  -- cents
  platform_fee            integer not null default 0,            -- cents
  stripe_payment_intent_id text,
  status                  order_status not null default 'pending',
  tracking_number         text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index idx_orders_buyer   on orders(buyer_id);
create index idx_orders_seller  on orders(seller_id);
create index idx_orders_listing on orders(listing_id);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_updated_at
  before update on listings
  for each row execute function set_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- Profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Listings
alter table listings enable row level security;

create policy "Listed items are viewable by everyone"
  on listings for select
  using (status = 'listed' or seller_id = auth.uid());

create policy "Sellers can insert own listings"
  on listings for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update own listings"
  on listings for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy "Sellers can delete own draft listings"
  on listings for delete
  using (auth.uid() = seller_id and status = 'draft');

-- Orders
alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create orders"
  on orders for insert
  with check (auth.uid() = buyer_id);

create policy "Order participants can update orders"
  on orders for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ============================================================
-- Storage bucket for listing images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true);

create policy "Anyone can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

create policy "Users can update own listing images"
  on storage.objects for update
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
