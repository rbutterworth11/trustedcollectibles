INSERT INTO site_content (key, value, enabled, sort_order) VALUES
  ('trust_section', '{"trustpilot_url":"https://www.trustpilot.com/review/trustedcollectibles.com","trustpilot_rating":"4.8","trustpilot_reviews":"127","trustpilot_text":"Rated Excellent on Trustpilot","show_stripe":true,"show_ssl":true,"show_psa":true,"show_beckett":true,"show_jsa":true}', true, 5)
ON CONFLICT (key) DO NOTHING;
