-- ============================================================
-- TeamUp v10.2 — Banner de perfil personalizable
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Columnas de banner en profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banner_color text DEFAULT 'grad-1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banner_url   text;

-- Bucket para fotos de portada
INSERT INTO storage.buckets (id, name, public)
  VALUES ('banners', 'banners', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "banners_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "banners_upload_auth"  ON storage.objects;
DROP POLICY IF EXISTS "banners_update_auth"  ON storage.objects;

CREATE POLICY "banners_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "banners_upload_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND auth.uid() IS NOT NULL);

CREATE POLICY "banners_update_auth"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banners' AND auth.uid() IS NOT NULL);

-- ─── FIN ─────────────────────────────────────────────────
