-- ============================================================
-- TeamUp v10 — SQL de actualización
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Duración del evento ───────────────────────────────
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS duration_minutes int;

-- ─── 2. Tabla de notificaciones ──────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        text NOT NULL, -- 'joined', 'left', 'event_full', 'karma'
  event_id    uuid REFERENCES public.events(id) ON DELETE CASCADE,
  actor_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message     text NOT NULL,
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_insert_auth" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ─── 3. Tabla de karma (valoraciones al organizador) ─────
CREATE TABLE IF NOT EXISTS public.karma_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  voter_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote        smallint NOT NULL CHECK (vote IN (1, -1)),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, voter_id)
);

ALTER TABLE public.karma_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "karma_select_all"   ON public.karma_votes FOR SELECT USING (true);
CREATE POLICY "karma_insert_auth"  ON public.karma_votes FOR INSERT WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "karma_delete_own"   ON public.karma_votes FOR DELETE USING (auth.uid() = voter_id);

-- ─── 4. Función para actualizar karma en profiles ────────
CREATE OR REPLACE FUNCTION public.update_karma()
RETURNS trigger AS $$
BEGIN
  -- Recalcular karma del target como suma de votos
  UPDATE public.profiles
  SET karma = (
    SELECT COALESCE(SUM(vote), 0)
    FROM public.karma_votes
    WHERE target_id = COALESCE(NEW.target_id, OLD.target_id)
  )
  WHERE id = COALESCE(NEW.target_id, OLD.target_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_karma_vote ON public.karma_votes;
CREATE TRIGGER on_karma_vote
  AFTER INSERT OR DELETE ON public.karma_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_karma();

-- ─── 5. Añadir columna karma si no existe ────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS karma int DEFAULT 0;

-- ─── FIN ─────────────────────────────────────────────────
