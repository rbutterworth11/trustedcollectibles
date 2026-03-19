-- ============================================================
-- Paid authentication check service
-- ============================================================

CREATE TABLE auth_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier            text NOT NULL CHECK (tier IN ('standard', 'premium')),
  status          text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'in_review', 'completed')),
  sport           text NOT NULL,
  item_type       text NOT NULL,
  details         text,
  item_photos     text[] NOT NULL DEFAULT '{}',
  coa_photos      text[] NOT NULL DEFAULT '{}',
  verdict         text CHECK (verdict IN ('authentic', 'likely_authentic', 'inconclusive', 'likely_not_authentic')),
  reviewer_notes  text,
  reviewed_by     uuid REFERENCES profiles(id),
  reviewed_at     timestamptz,
  stripe_session_id text,
  amount          integer NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_requests_user ON auth_requests(user_id);
CREATE INDEX idx_auth_requests_status ON auth_requests(status);

CREATE TRIGGER auth_requests_updated_at
  BEFORE UPDATE ON auth_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE auth_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own auth requests"
  ON auth_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create auth requests"
  ON auth_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending requests"
  ON auth_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending_payment');

CREATE POLICY "Admins can view all auth requests"
  ON auth_requests FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update auth requests"
  ON auth_requests FOR UPDATE
  USING (is_admin());
