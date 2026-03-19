INSERT INTO site_settings (key, value) VALUES
  ('social_tiktok', '')
ON CONFLICT (key) DO NOTHING;
