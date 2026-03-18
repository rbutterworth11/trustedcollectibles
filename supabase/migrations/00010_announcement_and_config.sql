-- Announcement bar, maintenance notice, hero carousel
INSERT INTO site_content (key, value, enabled, sort_order) VALUES
  ('announcement_bar', '{"text":"Free shipping on orders over £500!","link":"/marketplace","bg_color":"#c67b2f","text_color":"#08090e"}', false, -2),
  ('maintenance_notice', '{"text":"","type":"info"}', false, -1),
  ('hero_slides', '{"slides":[]}', false, -1)
ON CONFLICT (key) DO NOTHING;

-- Add conditions and COA sources to managed_categories
INSERT INTO managed_categories (type, name, sort_order) VALUES
  ('condition', 'Mint', 0), ('condition', 'Near Mint', 1),
  ('condition', 'Excellent', 2), ('condition', 'Very Good', 3),
  ('condition', 'Good', 4), ('condition', 'Fair', 5), ('condition', 'Poor', 6)
ON CONFLICT DO NOTHING;

-- We need to allow 'condition' and 'coa_source' in the type check
ALTER TABLE managed_categories DROP CONSTRAINT IF EXISTS managed_categories_type_check;
ALTER TABLE managed_categories ADD CONSTRAINT managed_categories_type_check
  CHECK (type IN ('sport', 'item_type', 'condition', 'coa_source'));

INSERT INTO managed_categories (type, name, sort_order) VALUES
  ('coa_source', 'PSA', 0),
  ('coa_source', 'JSA (James Spence Authentication)', 1),
  ('coa_source', 'Beckett Authentication', 2),
  ('coa_source', 'SGC', 3),
  ('coa_source', 'Fanatics', 4),
  ('coa_source', 'Upper Deck Authenticated', 5),
  ('coa_source', 'Steiner Sports', 6),
  ('coa_source', 'Mounted Memories', 7),
  ('coa_source', 'Tristar Productions', 8),
  ('coa_source', 'GTSM (Global Trading Sports Marketing)', 9),
  ('coa_source', 'Seller Self-Authenticated', 10),
  ('coa_source', 'Other', 11)
ON CONFLICT DO NOTHING;

-- Shipping settings
INSERT INTO site_settings (key, value) VALUES
  ('free_shipping_threshold', '50000'),
  ('shipping_rate_standard', '999'),
  ('shipping_rate_express', '1999'),
  ('shipping_rate_international', '2999')
ON CONFLICT (key) DO NOTHING;
