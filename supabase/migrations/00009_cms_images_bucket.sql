-- Storage bucket for CMS images (hero backgrounds, category images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view cms images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');

CREATE POLICY "Admins can upload cms images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cms-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update cms images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cms-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete cms images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cms-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
