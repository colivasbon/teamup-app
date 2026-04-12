-- ============================================================
-- TeamUp v12 SQL
-- 1. Trigger: notificación cuando alguien nuevo se une al evento
-- 2. Función pg_cron para recordatorio 1h antes del evento
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. TRIGGER: notificar al creador cuando un participante
--    se une a su evento (evita duplicados)
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_creator_on_join()
RETURNS TRIGGER AS $$
DECLARE
  v_event      RECORD;
  v_joiner     RECORD;
  v_msg        TEXT;
BEGIN
  -- Solo cuando se une (status = 'joined') y no es el propio creador
  IF NEW.status <> 'joined' THEN RETURN NEW; END IF;

  SELECT id, title, creator_id INTO v_event
    FROM events WHERE id = NEW.event_id;

  IF v_event.creator_id IS NULL OR v_event.creator_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(full_name, username, 'Alguien') INTO v_joiner
    FROM profiles WHERE id = NEW.user_id;

  v_msg := v_joiner || ' se ha apuntado a tu evento "' || v_event.title || '"';

  -- Insertar solo si no existe ya la misma notificación
  INSERT INTO notifications (user_id, type, event_id, message, priority, read)
  SELECT v_event.creator_id, 'joined', v_event.id, v_msg, 'high', false
  WHERE NOT EXISTS (
    SELECT 1 FROM notifications
    WHERE user_id = v_event.creator_id
      AND type    = 'joined'
      AND event_id = v_event.id
      AND message  = v_msg
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_participant_join ON event_participants;

CREATE TRIGGER on_participant_join
  AFTER INSERT OR UPDATE OF status ON event_participants
  FOR EACH ROW EXECUTE FUNCTION notify_creator_on_join();


-- ──────────────────────────────────────────────────────────
-- 2. FUNCIÓN: crear recordatorios 1h antes del evento
--    Debe ejecutarse periódicamente (ej. cada 15 min con pg_cron
--    o llamarse desde un cron externo vía RPC).
--
--    Para activar con pg_cron (si está habilitado en Supabase):
--      SELECT cron.schedule('recordatorios-eventos', '*/15 * * * *',
--        $$SELECT create_event_reminders()$$);
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION create_event_reminders()
RETURNS void AS $$
DECLARE
  r RECORD;
BEGIN
  -- Eventos que empiezan entre 55 y 65 minutos desde ahora
  FOR r IN
    SELECT e.id, e.title, e.time, e.date, ep.user_id
    FROM events e
    JOIN event_participants ep ON ep.event_id = e.id AND ep.status = 'joined'
    WHERE
      (e.date::text || 'T' || e.time::text)::timestamptz
        BETWEEN NOW() + INTERVAL '55 minutes'
            AND NOW() + INTERVAL '65 minutes'
  LOOP
    INSERT INTO notifications (user_id, type, event_id, message, priority, read)
    SELECT r.user_id,
           'event_new',
           r.id,
           '⏰ Tu evento "' || r.title || '" empieza en 1 hora',
           'high',
           false
    WHERE NOT EXISTS (
      SELECT 1 FROM notifications
      WHERE user_id   = r.user_id
        AND event_id  = r.id
        AND type      = 'event_new'
        AND message LIKE '%empieza en 1 hora%'
        AND created_at > NOW() - INTERVAL '2 hours'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Para activar el cron automático (ejecutar si pg_cron está disponible):
-- SELECT cron.schedule('teamup-recordatorios', '*/15 * * * *', $$SELECT create_event_reminders()$$);
