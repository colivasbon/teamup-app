-- ============================================================
-- TeamUp v10.1 — Triggers de notificaciones automáticas
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Trigger: alguien se une a tu evento ──────────────
CREATE OR REPLACE FUNCTION public.notify_on_join()
RETURNS trigger AS $$
DECLARE
  ev_title  text;
  ev_creator uuid;
  actor_name text;
BEGIN
  -- Obtener datos del evento
  SELECT title, creator_id INTO ev_title, ev_creator
  FROM public.events WHERE id = NEW.event_id;

  -- No notificar si el que se une es el propio creador
  IF NEW.user_id = ev_creator THEN RETURN NEW; END IF;

  -- Nombre del actor
  SELECT full_name INTO actor_name
  FROM public.profiles WHERE id = NEW.user_id;

  -- Insertar notificación al creador
  INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
  VALUES (
    ev_creator,
    'joined',
    NEW.event_id,
    NEW.user_id,
    COALESCE(actor_name, 'Alguien') || ' se ha apuntado a tu evento "' || COALESCE(ev_title, 'sin título') || '"'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_participant_joined ON public.event_participants;
CREATE TRIGGER on_participant_joined
  AFTER INSERT ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_join();

-- ─── 2. Trigger: alguien escribe en el chat de tu evento ─
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger AS $$
DECLARE
  ev_title   text;
  ev_creator uuid;
  actor_name text;
BEGIN
  SELECT title, creator_id INTO ev_title, ev_creator
  FROM public.events WHERE id = NEW.event_id;

  -- No notificar si escribe el propio creador
  IF NEW.user_id = ev_creator THEN RETURN NEW; END IF;

  SELECT full_name INTO actor_name
  FROM public.profiles WHERE id = NEW.user_id;

  -- Solo una notificación por evento si ya hay una no leída reciente (últimos 5 min)
  -- para no saturar con cada mensaje
  IF EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = ev_creator
      AND event_id = NEW.event_id
      AND type = 'message'
      AND read = false
      AND created_at > NOW() - INTERVAL '5 minutes'
  ) THEN RETURN NEW; END IF;

  INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
  VALUES (
    ev_creator,
    'message',
    NEW.event_id,
    NEW.user_id,
    COALESCE(actor_name, 'Alguien') || ' escribió en el chat de "' || COALESCE(ev_title, 'tu evento') || '"'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_message ON public.event_messages;
CREATE TRIGGER on_event_message
  AFTER INSERT ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();

-- ─── 3. Asegurar que notifications tiene type 'message' ──
-- (el check constraint original solo tenía joined/left/event_full/karma)
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- ─── FIN ─────────────────────────────────────────────────
-- Los triggers se disparan automáticamente en Supabase.
-- No requieren ningún cambio en el código frontend.
