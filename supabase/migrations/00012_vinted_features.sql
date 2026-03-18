-- ============================================================
-- Vinted-style features: bumps, saved searches, condition photos
-- ============================================================

-- Listing bumps
ALTER TABLE listings ADD COLUMN IF NOT EXISTS bumped_at timestamptz;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS bump_count integer NOT NULL DEFAULT 0;

-- Saved searches
CREATE TABLE saved_searches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  filters     jsonb NOT NULL DEFAULT '{}',
  notify      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches"
  ON saved_searches FOR ALL
  USING (auth.uid() = user_id);

-- Condition/flaw photos stored as JSONB array on listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition_photos jsonb DEFAULT '[]';

-- Buyer saved addresses for quick buy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_address jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
