-- ============================================================
-- Homepage content management
-- ============================================================

-- Key-value store for homepage sections. Each row is a section.
create table site_content (
  key         text primary key,
  value       jsonb not null default '{}',
  enabled     boolean not null default true,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create trigger site_content_updated_at
  before update on site_content
  for each row execute function set_updated_at();

-- RLS
alter table site_content enable row level security;

-- Anyone can read (homepage needs it)
create policy "Anyone can read site content"
  on site_content for select
  using (true);

-- Only admins can modify
create policy "Admins can update site content"
  on site_content for update
  using (is_admin());

create policy "Admins can insert site content"
  on site_content for insert
  with check (is_admin());

create policy "Admins can delete site content"
  on site_content for delete
  using (is_admin());

-- Staff picks (listing IDs chosen by admin)
create table staff_picks (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  unique(listing_id)
);

create index idx_staff_picks_order on staff_picks(sort_order);

alter table staff_picks enable row level security;

create policy "Anyone can read staff picks"
  on staff_picks for select
  using (true);

create policy "Admins can manage staff picks"
  on staff_picks for all
  using (is_admin());

-- Seed default content
INSERT INTO site_content (key, value, enabled, sort_order) VALUES
  ('hero', '{
    "title": "Authenticated Sports\nMemorabilia",
    "subtitle": "Buy and sell verified collectibles with confidence. Every item is authenticated by our experts and every transaction is protected with escrow payments.",
    "cta_text": "Browse Marketplace",
    "cta_link": "/marketplace",
    "cta_secondary_text": "Start Selling",
    "cta_secondary_link": "/register"
  }', true, 0),
  ('trust_bar', '{
    "items": [
      {"icon": "shield", "title": "Expert Verified", "subtitle": "Every item authenticated"},
      {"icon": "lock", "title": "Escrow Payments", "subtitle": "Funds held until delivery"},
      {"icon": "card", "title": "Secure Checkout", "subtitle": "Powered by Stripe"},
      {"icon": "star", "title": "Buyer Protection", "subtitle": "Full money-back guarantee"}
    ]
  }', true, 1),
  ('new_arrivals', '{
    "title": "New Arrivals",
    "subtitle": "The latest additions to our marketplace.",
    "count": 8
  }', true, 2),
  ('staff_picks_section', '{
    "title": "Staff Picks",
    "subtitle": "Premium items hand-picked by our team."
  }', true, 3),
  ('featured_collections', '{
    "items": [
      {"name": "Signed Jerseys", "description": "Authenticated game-day and replica jerseys from the biggest names in sports.", "category": "Signed Jersey", "gradient": "from-blue-950 to-blue-800"},
      {"name": "Trading Cards", "description": "Rare signed cards from rookies to legends, all verified authentic.", "category": "Signed Card", "gradient": "from-purple-950 to-purple-800"},
      {"name": "Game-Worn Items", "description": "Own a piece of history with authenticated game-used equipment and apparel.", "category": "Game-Worn Item", "gradient": "from-green-950 to-green-800"}
    ]
  }', true, 4),
  ('cta_section', '{
    "title": "Ready to Start Collecting?",
    "subtitle": "Join thousands of collectors who trust our platform for authenticated sports memorabilia. Create an account to start buying or selling today.",
    "cta_text": "Create Account",
    "cta_link": "/register",
    "cta_secondary_text": "Browse Marketplace",
    "cta_secondary_link": "/marketplace"
  }', true, 5);
