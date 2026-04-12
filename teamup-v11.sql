-- ============================================================
-- TeamUp v11 — SQL completo
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Columna sport_details en events ──────────────────
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS sport_details jsonb;

-- ─── 2. Tabla moment_comments ────────────────────────────
CREATE TABLE IF NOT EXISTS public.moment_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id   uuid NOT NULL REFERENCES public.moments(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id)     ON DELETE CASCADE,
  text        text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 280),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moment_comments_moment_idx ON public.moment_comments (moment_id, created_at);

ALTER TABLE public.moment_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mc_select_all"  ON public.moment_comments FOR SELECT USING (true);
CREATE POLICY "mc_insert_auth" ON public.moment_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mc_delete_own"  ON public.moment_comments FOR DELETE USING (auth.uid() = user_id);

-- ─── 3. Columna priority en notifications ────────────────
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority text DEFAULT 'high';
-- 'high' = eventos (join, leave, message) → banner home + punto navbar
-- 'low'  = social (like, comment)        → solo pestaña notificaciones

-- ─── 4. Trigger: notificación de like (prioridad baja) ───
CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS trigger AS $$
DECLARE
  moment_author uuid;
  actor_name    text;
  moment_text   text;
BEGIN
  -- Obtener autor del momento
  SELECT user_id, left(text,40) INTO moment_author, moment_text
  FROM public.moments WHERE id = NEW.moment_id;

  -- No notificarse a sí mismo
  IF NEW.user_id = moment_author THEN RETURN NEW; END IF;

  SELECT full_name INTO actor_name FROM public.profiles WHERE id = NEW.user_id;

  INSERT INTO public.notifications (user_id, type, event_id, actor_id, message, priority)
  VALUES (
    moment_author,
    'like',
    NULL,
    NEW.user_id,
    COALESCE(actor_name,'Alguien') || ' dio ❤️ a tu momento "' || COALESCE(moment_text,'') || '..."',
    'low'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_moment_liked ON public.moment_likes;
CREATE TRIGGER on_moment_liked
  AFTER INSERT ON public.moment_likes
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_like();

-- ─── 5. Trigger: notificación de comentario (prioridad baja) ─
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger AS $$
DECLARE
  moment_author uuid;
  actor_name    text;
  moment_text   text;
BEGIN
  SELECT user_id, left(text,40) INTO moment_author, moment_text
  FROM public.moments WHERE id = NEW.moment_id;

  IF NEW.user_id = moment_author THEN RETURN NEW; END IF;

  -- Anti-spam: máx 1 notif de comentario por momento en 5 min
  IF EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = moment_author AND type = 'comment'
      AND actor_id = NEW.user_id
      AND read = false
      AND created_at > NOW() - INTERVAL '5 minutes'
  ) THEN RETURN NEW; END IF;

  SELECT full_name INTO actor_name FROM public.profiles WHERE id = NEW.user_id;

  INSERT INTO public.notifications (user_id, type, event_id, actor_id, message, priority)
  VALUES (
    moment_author,
    'comment',
    NULL,
    NEW.user_id,
    COALESCE(actor_name,'Alguien') || ' comentó tu momento: "' || COALESCE(moment_text,'') || '..."',
    'low'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_moment_commented ON public.moment_comments;
CREATE TRIGGER on_moment_commented
  AFTER INSERT ON public.moment_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- ─── 6. Actualizar triggers existentes para añadir priority='high' ─
-- (las funciones existentes ya no incluyen el campo priority por defecto)
-- Se actualiza el DEFAULT de la columna para que los triggers antiguos
-- sigan funcionando con priority='high' automáticamente.
-- (ya hecho en el ALTER TABLE de arriba con DEFAULT 'high')

-- ─── FIN ─────────────────────────────────────────────────
