-- ============================================================
-- Seed script: sample seller profiles and listings
-- Run this in the Supabase SQL Editor after all migrations.
--
-- Creates 4 seller profiles (inserted directly into auth.users
-- and profiles) and 15 realistic listings marked as 'listed'.
-- ============================================================

-- Generate deterministic UUIDs for sellers
-- Seller 1: James Mitchell (Football memorabilia dealer)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_user_meta_data)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'james.mitchell@example.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(), '',
  '{"full_name": "James Mitchell"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seller 2: Sarah Thompson (Boxing & MMA specialist)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_user_meta_data)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'sarah.thompson@example.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(), '',
  '{"full_name": "Sarah Thompson"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seller 3: David Williams (Rugby & Cricket)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_user_meta_data)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'david.williams@example.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(), '',
  '{"full_name": "David Williams"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seller 4: Emma Clarke (Premium collectibles)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_user_meta_data)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'emma.clarke@example.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(), '',
  '{"full_name": "Emma Clarke"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Profiles (seller role)
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'james.mitchell@example.com', 'James Mitchell', 'seller'),
  ('a1000000-0000-0000-0000-000000000002', 'sarah.thompson@example.com', 'Sarah Thompson', 'seller'),
  ('a1000000-0000-0000-0000-000000000003', 'david.williams@example.com', 'David Williams', 'seller'),
  ('a1000000-0000-0000-0000-000000000004', 'emma.clarke@example.com', 'Emma Clarke', 'seller')
ON CONFLICT (id) DO UPDATE SET role = 'seller', full_name = EXCLUDED.full_name;

-- ============================================================
-- Listings (15 items, all status = 'listed')
-- Prices are in cents (USD). Images use picsum.photos.
-- ============================================================

-- 1. Wayne Rooney signed Manchester United shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged, reviewed_at, reviewed_by)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Wayne Rooney Signed Manchester United Shirt 2011',
  'Authentic Wayne Rooney signed Manchester United home shirt from the 2010/11 Premier League season. Signed in black marker on the front. This shirt was personally signed at a private signing event. Comes with a Certificate of Authenticity from Beckett Authentication.',
  34999, 'Signed Jersey', 'Football (Soccer)', 'Wayne Rooney', 'Manchester United', '2011', 'Excellent',
  ARRAY['https://picsum.photos/seed/rooney1/800/800', 'https://picsum.photos/seed/rooney2/800/800', 'https://picsum.photos/seed/rooney3/800/800'],
  'listed', true, 25000, 'Beckett Authentication', 'BAS-WR-20110042', false, now(), NULL
);

-- 2. Steven Gerrard signed Liverpool FC shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Steven Gerrard Signed Liverpool FC Champions League Shirt 2005',
  'Iconic Steven Gerrard signed Liverpool home shirt from the unforgettable 2004/05 Champions League winning season. The shirt features Gerrard''s signature in silver marker across the number 8. One of the most sought-after pieces of football memorabilia.',
  74999, 'Signed Jersey', 'Football (Soccer)', 'Steven Gerrard', 'Liverpool FC', '2005', 'Near Mint',
  ARRAY['https://picsum.photos/seed/gerrard1/800/800', 'https://picsum.photos/seed/gerrard2/800/800'],
  'listed', true, 50000, 'PSA', 'PSA-SG-05CL-8821', false
);

-- 3. Cristiano Ronaldo signed Real Madrid photo
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Cristiano Ronaldo Signed Real Madrid 16x20 Photo',
  'Stunning 16x20 photograph of Cristiano Ronaldo celebrating a Champions League goal for Real Madrid. Signed in blue marker with full signature. Authenticated by PSA/DNA with tamper-evident hologram.',
  49999, 'Signed Photo', 'Football (Soccer)', 'Cristiano Ronaldo', 'Real Madrid', '2017', 'Mint',
  ARRAY['https://picsum.photos/seed/ronaldo1/800/800', 'https://picsum.photos/seed/ronaldo2/800/800'],
  'listed', false, 'PSA', 'PSA-CR7-RM-44291', false
);

-- 4. Lionel Messi signed Barcelona shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Lionel Messi Signed FC Barcelona Home Shirt 2015',
  'Lionel Messi hand-signed FC Barcelona home shirt from the treble-winning 2014/15 season. Signed on the front in permanent black marker. This is a genuine Nike match shirt, not a replica. Includes full JSA letter of authenticity.',
  99999, 'Signed Jersey', 'Football (Soccer)', 'Lionel Messi', 'FC Barcelona', '2015', 'Excellent',
  ARRAY['https://picsum.photos/seed/messi1/800/800', 'https://picsum.photos/seed/messi2/800/800', 'https://picsum.photos/seed/messi3/800/800'],
  'listed', true, 75000, 'JSA (James Spence Authentication)', 'JSA-LM10-BCN-76543', false
);

-- 5. Muhammad Ali signed boxing glove
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Muhammad Ali Signed Everlast Boxing Glove',
  'Rare Muhammad Ali signed red Everlast boxing glove. Signed "Muhammad Ali" in black marker. This glove was signed in the 1990s and has been kept in excellent condition in a display case. A true centrepiece for any boxing collection. Authenticated by PSA/DNA.',
  499999, 'Signed Glove', 'Boxing', 'Muhammad Ali', '', '1995', 'Very Good',
  ARRAY['https://picsum.photos/seed/ali1/800/800', 'https://picsum.photos/seed/ali2/800/800', 'https://picsum.photos/seed/ali3/800/800'],
  'listed', true, 400000, 'PSA', 'PSA-MA-GLV-99102', false
);

-- 6. Mike Tyson signed boxing photo
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Mike Tyson Signed 11x14 Knockout Photo',
  'Mike Tyson signed 11x14 photograph capturing one of his legendary knockout victories. Signed in silver marker with "Iron Mike" inscription. Perfect for framing. Beckett authenticated.',
  12999, 'Signed Photo', 'Boxing', 'Mike Tyson', '', '2020', 'Mint',
  ARRAY['https://picsum.photos/seed/tyson1/800/800', 'https://picsum.photos/seed/tyson2/800/800'],
  'listed', true, 'Beckett Authentication', 'BAS-MT-KO-33847', false
);

-- 7. Anthony Joshua signed boxing glove
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Anthony Joshua Signed Red Everlast Boxing Glove',
  'Anthony Joshua signed red Everlast boxing glove from a private signing session in London. Signed in black marker with "AJ" inscription. Comes with photo proof of signing and Beckett COA.',
  19999, 'Signed Glove', 'Boxing', 'Anthony Joshua', '', '2023', 'Mint',
  ARRAY['https://picsum.photos/seed/aj1/800/800', 'https://picsum.photos/seed/aj2/800/800'],
  'listed', true, 15000, 'Beckett Authentication', 'BAS-AJ-GLV-55102', false
);

-- 8. Jonny Wilkinson signed England rugby shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Jonny Wilkinson Signed England Rugby World Cup Shirt 2003',
  'Jonny Wilkinson signed England rugby shirt from the 2003 Rugby World Cup winning campaign. Signed on the back below the number 10. One of the most iconic moments in English sporting history. Authenticated by JSA.',
  44999, 'Signed Jersey', 'Rugby', 'Jonny Wilkinson', 'England', '2003', 'Excellent',
  ARRAY['https://picsum.photos/seed/wilko1/800/800', 'https://picsum.photos/seed/wilko2/800/800'],
  'listed', true, 35000, 'JSA (James Spence Authentication)', 'JSA-JW-ENG-03RWC', false
);

-- 9. Martin Johnson signed rugby photo
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Martin Johnson Signed England Rugby Captain Photo 2003',
  'Martin Johnson signed 12x16 photograph lifting the Webb Ellis Cup after England''s 2003 Rugby World Cup Final victory over Australia. A stunning piece signed in gold marker. PSA authenticated.',
  14999, 'Signed Photo', 'Rugby', 'Martin Johnson', 'England', '2003', 'Mint',
  ARRAY['https://picsum.photos/seed/johnson1/800/800'],
  'listed', false, 'PSA', 'PSA-MJ-RWC-03FIN', false
);

-- 10. Sachin Tendulkar signed cricket bat
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Sachin Tendulkar Signed Full-Size Cricket Bat',
  'Sachin Tendulkar hand-signed full-size Gray-Nicolls cricket bat. Signed on the face of the bat in black marker. The greatest batsman in cricket history — a must-have for any cricket collector. Comes with Beckett LOA.',
  39999, 'Signed Bat/Stick', 'Cricket', 'Sachin Tendulkar', 'India', '2013', 'Very Good',
  ARRAY['https://picsum.photos/seed/sachin1/800/800', 'https://picsum.photos/seed/sachin2/800/800'],
  'listed', true, 30000, 'Beckett Authentication', 'BAS-ST-BAT-IND2013', false
);

-- 11. Ben Stokes signed England cricket shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Ben Stokes Signed England Ashes Cricket Shirt 2019',
  'Ben Stokes signed England cricket shirt from the historic 2019 Ashes series, where he played one of the greatest innings of all time at Headingley. Signed on the front in blue marker. PSA/DNA authenticated.',
  17999, 'Signed Jersey', 'Cricket', 'Ben Stokes', 'England', '2019', 'Excellent',
  ARRAY['https://picsum.photos/seed/stokes1/800/800', 'https://picsum.photos/seed/stokes2/800/800'],
  'listed', true, 'PSA', 'PSA-BS-ENG-ASHES19', false
);

-- 12. Thierry Henry signed Arsenal shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Thierry Henry Signed Arsenal Invincibles Shirt 2004',
  'Thierry Henry signed Arsenal home shirt from the legendary 2003/04 Invincibles season. Signed on the front below the O2 sponsor logo in black marker. One of the most desirable football shirts in existence. Full Beckett authentication.',
  59999, 'Signed Jersey', 'Football (Soccer)', 'Thierry Henry', 'Arsenal', '2004', 'Near Mint',
  ARRAY['https://picsum.photos/seed/henry1/800/800', 'https://picsum.photos/seed/henry2/800/800', 'https://picsum.photos/seed/henry3/800/800'],
  'listed', true, 45000, 'Beckett Authentication', 'BAS-TH14-ARS-04INV', false
);

-- 13. David Beckham signed England shirt
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'David Beckham Signed England 2002 World Cup Shirt',
  'David Beckham signed England home shirt from the 2002 FIFA World Cup in Japan/South Korea. Features Beckham''s signature on the number 7 on the back. A beautiful piece from the golden generation era. JSA authenticated with full letter.',
  29999, 'Signed Jersey', 'Football (Soccer)', 'David Beckham', 'England', '2002', 'Excellent',
  ARRAY['https://picsum.photos/seed/beckham1/800/800', 'https://picsum.photos/seed/beckham2/800/800'],
  'listed', true, 22000, 'JSA (James Spence Authentication)', 'JSA-DB7-ENG-02WC', false
);

-- 14. Lennox Lewis signed boxing glove
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Lennox Lewis Signed Black Everlast Boxing Glove',
  'Lennox Lewis signed black Everlast boxing glove. The last undisputed heavyweight champion of the 20th century. Signed in silver marker with inscription "2 x Champ". PSA authenticated.',
  8999, 'Signed Glove', 'Boxing', 'Lennox Lewis', '', '2022', 'Mint',
  ARRAY['https://picsum.photos/seed/lewis1/800/800', 'https://picsum.photos/seed/lewis2/800/800'],
  'listed', true, 'PSA', 'PSA-LL-GLV-HW2022', false
);

-- 15. Eric Cantona signed Manchester United photo
INSERT INTO listings (seller_id, title, description, price, category, sport, player, team, year, condition, images, status, accept_offers, minimum_offer, coa_source, coa_certificate_number, flagged)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Eric Cantona Signed Manchester United Celebration Photo',
  'Eric Cantona signed 16x12 photograph showing his iconic collar-up celebration at Old Trafford. Signed in black marker with "King Eric" inscription. A true piece of Manchester United and Premier League history. Beckett authenticated.',
  24999, 'Signed Photo', 'Football (Soccer)', 'Eric Cantona', 'Manchester United', '1996', 'Mint',
  ARRAY['https://picsum.photos/seed/cantona1/800/800', 'https://picsum.photos/seed/cantona2/800/800'],
  'listed', true, 18000, 'Beckett Authentication', 'BAS-EC7-MUFC-96ICN', false
);

-- ============================================================
-- Done! 4 sellers, 15 listings across Football, Boxing, Rugby, Cricket
-- ============================================================
