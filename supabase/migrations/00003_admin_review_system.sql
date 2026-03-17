-- ============================================================
-- Admin review system
-- ============================================================

-- Add review fields to listings
alter table listings add column reviewed_by uuid references profiles(id);
alter table listings add column reviewed_at timestamptz;
alter table listings add column rejection_reason text;
alter table listings add column admin_notes text;
alter table listings add column flagged boolean not null default false;
alter table listings add column flag_reason text;

-- Review log for audit trail
create table listing_reviews (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete restrict,
  action      text not null check (action in ('approved', 'rejected', 'request_photos', 'flagged', 'unflagged')),
  reason      text,
  created_at  timestamptz not null default now()
);

create index idx_listing_reviews_listing on listing_reviews(listing_id);

-- RLS for listing_reviews
alter table listing_reviews enable row level security;

-- Helper function to check if the current user is an admin
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all reviews"
  on listing_reviews for select
  using (is_admin());

create policy "Admins can insert reviews"
  on listing_reviews for insert
  with check (is_admin());

-- Update listing RLS to allow admins full access
create policy "Admins can view all listings"
  on listings for select
  using (is_admin());

create policy "Admins can update any listing"
  on listings for update
  using (is_admin());

-- Allow admins to view all orders
create policy "Admins can view all orders"
  on orders for select
  using (is_admin());
