-- Authenticity confidence rating for listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS confidence_factors text[] DEFAULT '{}';
