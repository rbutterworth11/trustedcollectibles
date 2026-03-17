-- ============================================================
-- Dashboard feature tables: offers, wishlists, follows, reviews
-- ============================================================

-- Offers on listings
create table offers (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  buyer_id    uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  amount      integer not null check (amount > 0),  -- cents
  status      text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired', 'withdrawn')),
  message     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_offers_listing on offers(listing_id);
create index idx_offers_buyer   on offers(buyer_id);
create index idx_offers_seller  on offers(seller_id);

create trigger offers_updated_at
  before update on offers
  for each row execute function set_updated_at();

-- Wishlists
create table wishlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  listing_id  uuid not null references listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, listing_id)
);

create index idx_wishlists_user on wishlists(user_id);

-- Followed sellers
create table followed_sellers (
  id          uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(follower_id, seller_id)
);

create index idx_followed_sellers_follower on followed_sellers(follower_id);

-- Seller reviews (from buyers after completed orders)
create table seller_reviews (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  rating      integer not null check (rating >= 1 and rating <= 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique(order_id)
);

create index idx_seller_reviews_seller on seller_reviews(seller_id);

-- ============================================================
-- RLS policies
-- ============================================================

-- Offers
alter table offers enable row level security;

create policy "Offer participants can view offers"
  on offers for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create offers"
  on offers for insert
  with check (auth.uid() = buyer_id);

create policy "Offer participants can update offers"
  on offers for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Wishlists
alter table wishlists enable row level security;

create policy "Users can view own wishlist"
  on wishlists for select
  using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on wishlists for delete
  using (auth.uid() = user_id);

-- Followed sellers
alter table followed_sellers enable row level security;

create policy "Users can view own follows"
  on followed_sellers for select
  using (auth.uid() = follower_id);

create policy "Users can follow sellers"
  on followed_sellers for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow sellers"
  on followed_sellers for delete
  using (auth.uid() = follower_id);

-- Seller reviews
alter table seller_reviews enable row level security;

create policy "Anyone can view seller reviews"
  on seller_reviews for select
  using (true);

create policy "Buyers can create reviews for their orders"
  on seller_reviews for insert
  with check (auth.uid() = reviewer_id);

-- Admin policies for new tables
create policy "Admins can view all offers"
  on offers for select
  using (is_admin());

create policy "Admins can view all wishlists"
  on wishlists for select
  using (is_admin());

create policy "Admins can view all follows"
  on followed_sellers for select
  using (is_admin());
