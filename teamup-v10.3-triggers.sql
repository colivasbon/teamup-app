-- ============================================================
-- TeamUp v10.3 — Trigger notificación al salir de un evento
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Trigger: alguien sale de tu evento
CREATE OR REPLACE FUNCTION public.notify_on_leave()
RETURNS trigger AS $$
DECLARE
  ev_title  text;
  ev_creator uuid;
  actor_name text;
BEGIN
  SELECT title, creator_id INTO ev_title, ev_creator
  FROM public.events WHERE id = OLD.event_id;

  -- No notificar si el que sale es el propio creador
  IF OLD.user_id = ev_creator THEN RETURN OLD; END IF;

  SELECT full_name INTO actor_name
  FROM public.profiles WHERE id = OLD.user_id;

  INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
  VALUES (
    ev_creator,
    'left',
    OLD.event_id,
    OLD.user_id,
    COALESCE(actor_name, 'Alguien') || ' ha salido de tu evento "' || COALESCE(ev_title, 'sin título') || '"'
  );

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_participant_left ON public.event_participants;
CREATE TRIGGER on_participant_left
  AFTER DELETE ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_leave();

-- Eliminar restricción de tipo si existe (para aceptar 'left' y 'message')
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- ─── FIN ─────────────────────────────────────────────────
