-- ============================================================
-- TeamUp v12 FIX — Eliminar triggers duplicados de "unirse a evento"
-- y limpiar notificaciones duplicadas existentes
-- ============================================================

-- 1. Eliminar TODOS los triggers relacionados con unirse a eventos
--    (los de v10, v11 y v12 que pueden estar solapados)
DROP TRIGGER IF EXISTS on_participant_join          ON event_participants;
DROP TRIGGER IF EXISTS on_participant_joined        ON event_participants;
DROP TRIGGER IF EXISTS notify_new_participant       ON event_participants;
DROP TRIGGER IF EXISTS on_join_notify_creator       ON event_participants;
DROP TRIGGER IF EXISTS on_participant_status_change ON event_participants;

-- 2. Eliminar las funciones antiguas asociadas
DROP FUNCTION IF EXISTS notify_creator_on_join()   CASCADE;
DROP FUNCTION IF EXISTS notify_new_participant()   CASCADE;
DROP FUNCTION IF EXISTS on_participant_join()      CASCADE;
DROP FUNCTION IF EXISTS handle_participant_join()  CASCADE;

-- 3. Limpiar notificaciones duplicadas — mantener solo la más reciente
--    por cada combinación (user_id, event_id, type = 'joined')
DELETE FROM notifications
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, event_id, message)
    id
  FROM notifications
  WHERE type = 'joined'
  ORDER BY user_id, event_id, message, created_at DESC
)
AND type = 'joined';

-- 4. Recrear el trigger limpio y único
CREATE OR REPLACE FUNCTION notify_creator_on_join()
RETURNS TRIGGER AS $$
DECLARE
  v_event  RECORD;
  v_joiner TEXT;
  v_msg    TEXT;
BEGIN
  IF NEW.status <> 'joined' THEN RETURN NEW; END IF;

  SELECT id, title, creator_id INTO v_event
    FROM events WHERE id = NEW.event_id;

  IF v_event.creator_id IS NULL OR v_event.creator_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(full_name, username, 'Alguien') INTO v_joiner
    FROM profiles WHERE id = NEW.user_id;

  v_msg := v_joiner || ' se ha apuntado a tu evento "' || v_event.title || '"';

  INSERT INTO notifications (user_id, type, event_id, message, priority, read)
  SELECT v_event.creator_id, 'joined', v_event.id, v_msg, 'high', false
  WHERE NOT EXISTS (
    SELECT 1 FROM notifications
    WHERE user_id  = v_event.creator_id
      AND event_id = v_event.id
      AND type     = 'joined'
      AND created_at > NOW() - INTERVAL '5 minutes'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_participant_join
  AFTER INSERT OR UPDATE OF status ON event_participants
  FOR EACH ROW EXECUTE FUNCTION notify_creator_on_join();
