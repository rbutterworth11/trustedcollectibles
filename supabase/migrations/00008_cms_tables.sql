-- ============================================================
-- CMS tables: content pages, categories, site settings
-- ============================================================

-- Editable content pages (About, FAQ, T&Cs, Privacy, Cookies, How It Works)
create table content_pages (
  slug        text primary key,
  title       text not null,
  content     text not null default '',
  meta_description text,
  updated_at  timestamptz not null default now()
);

create trigger content_pages_updated_at
  before update on content_pages
  for each row execute function set_updated_at();

alter table content_pages enable row level security;

create policy "Anyone can read content pages"
  on content_pages for select using (true);

create policy "Admins can manage content pages"
  on content_pages for all using (is_admin());

-- Seed content pages (HTML content will be populated by admin)
INSERT INTO content_pages (slug, title, content, meta_description) VALUES
  ('about', 'About Us', '', 'TrustedCollectibles was built by sports memorabilia experts.'),
  ('how-it-works', 'How It Works', '', 'Learn how to buy and sell authenticated sports memorabilia.'),
  ('faq', 'Frequently Asked Questions', '', 'Get answers to common questions about TrustedCollectibles.'),
  ('terms', 'Terms & Conditions', '', 'Terms and conditions for using TrustedCollectibles.'),
  ('privacy', 'Privacy Policy', '', 'GDPR-compliant privacy policy for TrustedCollectibles.'),
  ('cookies', 'Cookie Policy', '', 'Cookie policy for TrustedCollectibles.');

-- Category management
create table managed_categories (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('sport', 'item_type')),
  name        text not null,
  image_url   text,
  enabled     boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_managed_categories_type on managed_categories(type, sort_order);

alter table managed_categories enable row level security;

create policy "Anyone can read categories"
  on managed_categories for select using (true);

create policy "Admins can manage categories"
  on managed_categories for all using (is_admin());

-- Seed categories from existing constants
INSERT INTO managed_categories (type, name, sort_order) VALUES
  ('sport', 'Baseball', 0), ('sport', 'Basketball', 1), ('sport', 'Boxing', 2),
  ('sport', 'Cricket', 3), ('sport', 'Football (American)', 4),
  ('sport', 'Football (Soccer)', 5), ('sport', 'Golf', 6), ('sport', 'Hockey', 7),
  ('sport', 'MMA/UFC', 8), ('sport', 'Motorsport', 9), ('sport', 'Rugby', 10),
  ('sport', 'Tennis', 11), ('sport', 'Track & Field', 12), ('sport', 'Wrestling', 13),
  ('sport', 'Other', 14),
  ('item_type', 'Signed Jersey', 0), ('item_type', 'Signed Ball', 1),
  ('item_type', 'Signed Photo', 2), ('item_type', 'Signed Card', 3),
  ('item_type', 'Signed Bat/Stick', 4), ('item_type', 'Signed Glove', 5),
  ('item_type', 'Signed Helmet', 6), ('item_type', 'Signed Boots/Cleats', 7),
  ('item_type', 'Signed Program/Magazine', 8), ('item_type', 'Game-Worn Item', 9),
  ('item_type', 'Trophy/Medal', 10), ('item_type', 'Ticket Stub', 11),
  ('item_type', 'Other Memorabilia', 12);

-- Site settings (singleton key-value)
create table site_settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "Anyone can read site settings"
  on site_settings for select using (true);

create policy "Admins can manage site settings"
  on site_settings for all using (is_admin());

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'TrustedCollectibles'),
  ('contact_email', 'support@trustedcollectibles.com'),
  ('commission_rate', '10'),
  ('min_listing_price', '500'),
  ('accepted_coa_sources', 'PSA,JSA (James Spence Authentication),Beckett Authentication,SGC,Fanatics,Upper Deck Authenticated,Steiner Sports,Mounted Memories,Tristar Productions,GTSM (Global Trading Sports Marketing),Seller Self-Authenticated,Other'),
  ('shipping_options', 'Royal Mail Tracked,DPD,Hermes,UPS,FedEx,DHL,Seller Arranged'),
  ('social_twitter', ''),
  ('social_instagram', ''),
  ('social_facebook', ''),
  ('currency_base', 'GBP'),
  ('usd_rate', '1.27'),
  ('eur_rate', '1.17');
