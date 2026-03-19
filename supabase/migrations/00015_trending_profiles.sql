-- Trending players & teams for homepage
CREATE TABLE trending_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  image_url   text,
  filter_type text NOT NULL DEFAULT 'player' CHECK (filter_type IN ('player', 'team')),
  sort_order  integer NOT NULL DEFAULT 0,
  enabled     boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_trending_profiles_order ON trending_profiles(sort_order);

ALTER TABLE trending_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trending profiles"
  ON trending_profiles FOR SELECT USING (true);

CREATE POLICY "Admins can manage trending profiles"
  ON trending_profiles FOR ALL USING (is_admin());

-- Seed default trending profiles
INSERT INTO trending_profiles (name, filter_type, sort_order) VALUES
  ('Cristiano Ronaldo', 'player', 0),
  ('Maradona', 'player', 1),
  ('Lionel Messi', 'player', 2),
  ('Muhammad Ali', 'player', 3),
  ('Tyson Fury', 'player', 4),
  ('Mike Tyson', 'player', 5),
  ('Liverpool FC', 'team', 6),
  ('Manchester United', 'team', 7),
  ('Wayne Rooney', 'player', 8),
  ('Lewis Hamilton', 'player', 9);
