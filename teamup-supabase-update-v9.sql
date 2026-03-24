-- ============================================================
-- TeamUp — SQL de actualización v9
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ¡IMPORTANTE! Este archivo complementa el setup inicial.
-- No borra nada existente. Es seguro ejecutarlo varias veces.
-- ============================================================

-- ─── 1. Columna avatar_url en profiles ───────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- ─── 2. Tabla event_messages (chat por evento) ───────────────
CREATE TABLE IF NOT EXISTS public.event_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  text        text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1000),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice para cargar los mensajes de un evento ordenados
CREATE INDEX IF NOT EXISTS event_messages_event_id_idx
  ON public.event_messages (event_id, created_at);

-- ─── 3. Tabla moments (posts del feed) ───────────────────────
CREATE TABLE IF NOT EXISTS public.moments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text        text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  sport       text,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moments_created_at_idx
  ON public.moments (created_at DESC);

CREATE INDEX IF NOT EXISTS moments_sport_idx
  ON public.moments (sport);

-- ─── 4. Tabla moment_likes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.moment_likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id  uuid NOT NULL REFERENCES public.moments(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id)     ON DELETE CASCADE,
  UNIQUE (moment_id, user_id)
);

CREATE INDEX IF NOT EXISTS moment_likes_moment_id_idx
  ON public.moment_likes (moment_id);

-- ─── 5. Row Level Security ───────────────────────────────────

-- event_messages
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participantes leen mensajes" ON public.event_messages;
CREATE POLICY "Participantes leen mensajes"
  ON public.event_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_participants ep
      WHERE ep.event_id = event_messages.event_id
        AND ep.user_id  = auth.uid()
        AND ep.status   = 'joined'
    )
  );

DROP POLICY IF EXISTS "Participantes escriben mensajes" ON public.event_messages;
CREATE POLICY "Participantes escriben mensajes"
  ON public.event_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.event_participants ep
      WHERE ep.event_id = event_messages.event_id
        AND ep.user_id  = auth.uid()
        AND ep.status   = 'joined'
    )
  );

-- moments
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven moments" ON public.moments;
CREATE POLICY "Todos ven moments"
  ON public.moments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Autenticados crean moments" ON public.moments;
CREATE POLICY "Autenticados crean moments"
  ON public.moments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Propietario borra moment" ON public.moments;
CREATE POLICY "Propietario borra moment"
  ON public.moments FOR DELETE
  USING (auth.uid() = user_id);

-- moment_likes
ALTER TABLE public.moment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven likes" ON public.moment_likes;
CREATE POLICY "Todos ven likes"
  ON public.moment_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Autenticados dan like" ON public.moment_likes;
CREATE POLICY "Autenticados dan like"
  ON public.moment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Propietario quita like" ON public.moment_likes;
CREATE POLICY "Propietario quita like"
  ON public.moment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 6. Storage bucket "avatars" ─────────────────────────────
-- Crear el bucket desde el Dashboard: Storage → New bucket
-- Nombre: avatars  |  Public: ON
-- O ejecutar la siguiente instrucción si tienes la extensión storage habilitada:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública
DROP POLICY IF EXISTS "Avatars públicos" ON storage.objects;
CREATE POLICY "Avatars públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Política de subida (solo el propietario)
DROP POLICY IF EXISTS "Upload avatar propio" ON storage.objects;
CREATE POLICY "Upload avatar propio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Update avatar propio" ON storage.objects;
CREATE POLICY "Update avatar propio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── 7. Vista moments_with_likes (opcional, mejora rendimiento) ──
CREATE OR REPLACE VIEW public.moments_with_likes AS
SELECT
  m.*,
  p.username,
  p.full_name,
  p.avatar_url,
  COUNT(ml.id)::int AS like_count
FROM public.moments m
LEFT JOIN public.profiles p  ON p.id = m.user_id
LEFT JOIN public.moment_likes ml ON ml.moment_id = m.id
GROUP BY m.id, p.username, p.full_name, p.avatar_url;

-- ─── FIN ─────────────────────────────────────────────────────
-- Tablas creadas: event_messages, moments, moment_likes
-- Columna añadida: profiles.avatar_url
-- Bucket creado: avatars (público)
-- Vista creada: moments_with_likes
