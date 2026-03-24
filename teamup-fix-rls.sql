-- ============================================================
-- TeamUp — Fix RLS + columna province en moments
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Arreglar participantes con status NULL ────────────
UPDATE public.event_participants
  SET status = 'joined'
  WHERE status IS NULL;

ALTER TABLE public.event_participants
  ALTER COLUMN status SET DEFAULT 'joined';

-- ─── 2. Columna province en moments ──────────────────────
ALTER TABLE public.moments
  ADD COLUMN IF NOT EXISTS province text;

-- ─── 3. Moments — RLS limpia ─────────────────────────────
ALTER TABLE public.moments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven moments"          ON public.moments;
DROP POLICY IF EXISTS "Autenticados crean moments" ON public.moments;
DROP POLICY IF EXISTS "Propietario borra moment"   ON public.moments;
DROP POLICY IF EXISTS "moments_select_all"         ON public.moments;
DROP POLICY IF EXISTS "moments_insert_auth"        ON public.moments;
DROP POLICY IF EXISTS "moments_delete_own"         ON public.moments;

CREATE POLICY "moments_select_all"
  ON public.moments FOR SELECT USING (true);

CREATE POLICY "moments_insert_auth"
  ON public.moments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "moments_delete_own"
  ON public.moments FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 4. Moment_likes — RLS limpia ────────────────────────
ALTER TABLE public.moment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos ven likes"        ON public.moment_likes;
DROP POLICY IF EXISTS "Autenticados dan like"  ON public.moment_likes;
DROP POLICY IF EXISTS "Propietario quita like" ON public.moment_likes;
DROP POLICY IF EXISTS "likes_select_all"       ON public.moment_likes;
DROP POLICY IF EXISTS "likes_insert_auth"      ON public.moment_likes;
DROP POLICY IF EXISTS "likes_delete_own"       ON public.moment_likes;

CREATE POLICY "likes_select_all"
  ON public.moment_likes FOR SELECT USING (true);

CREATE POLICY "likes_insert_auth"
  ON public.moment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_own"
  ON public.moment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 5. Event_messages — sin filtro de status ────────────
ALTER TABLE public.event_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participantes leen mensajes"     ON public.event_messages;
DROP POLICY IF EXISTS "Participantes escriben mensajes" ON public.event_messages;
DROP POLICY IF EXISTS "messages_select_participants"    ON public.event_messages;
DROP POLICY IF EXISTS "messages_insert_participants"    ON public.event_messages;

CREATE POLICY "messages_select_participants"
  ON public.event_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_participants ep
      WHERE ep.event_id = event_messages.event_id
        AND ep.user_id  = auth.uid()
    )
  );

CREATE POLICY "messages_insert_participants"
  ON public.event_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.event_participants ep
      WHERE ep.event_id = event_messages.event_id
        AND ep.user_id  = auth.uid()
    )
  );

-- ─── 6. Profiles — lectura pública garantizada ───────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles públicos"      ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all"    ON public.profiles;
DROP POLICY IF EXISTS "Usuarios leen perfiles" ON public.profiles;

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuario actualiza su perfil" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"         ON public.profiles;

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── FIN ─────────────────────────────────────────────────
