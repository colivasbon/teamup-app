-- Notificar a todos los participantes cuando alguien se une
CREATE OR REPLACE FUNCTION public.notify_participants_on_join()
RETURNS trigger AS $$
DECLARE
  ev_title text;
  actor_name text;
  participant_id uuid;
BEGIN
  SELECT title INTO ev_title FROM public.events WHERE id = NEW.event_id;
  SELECT full_name INTO actor_name FROM public.profiles WHERE id = NEW.user_id;
  
  -- Notificar a cada participante existente (excepto el que se acaba de unir)
  FOR participant_id IN
    SELECT user_id FROM public.event_participants
    WHERE event_id = NEW.event_id AND user_id != NEW.user_id
  LOOP
    INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
    VALUES (
      participant_id,
      'joined',
      NEW.event_id,
      NEW.user_id,
      COALESCE(actor_name, 'Alguien') || ' se ha unido al evento "' || COALESCE(ev_title,'') || '"'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_participant_joined_notify_all ON public.event_participants;
CREATE TRIGGER on_participant_joined_notify_all
  AFTER INSERT ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION public.notify_participants_on_join();

-- Notificar a todos cuando alguien escribe en el chat
CREATE OR REPLACE FUNCTION public.notify_participants_on_message()
RETURNS trigger AS $$
DECLARE
  ev_title text;
  actor_name text;
  participant_id uuid;
BEGIN
  SELECT title INTO ev_title FROM public.events WHERE id = NEW.event_id;
  SELECT full_name INTO actor_name FROM public.profiles WHERE id = NEW.user_id;
  
  -- Evitar spam: solo si el participante no tiene ya una notif de chat no leída en los últimos 5 min
  FOR participant_id IN
    SELECT user_id FROM public.event_participants
    WHERE event_id = NEW.event_id AND user_id != NEW.user_id
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = participant_id AND event_id = NEW.event_id
        AND type = 'message' AND read = false
        AND created_at > NOW() - INTERVAL '5 minutes'
    ) THEN
      INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
      VALUES (
        participant_id,
        'message',
        NEW.event_id,
        NEW.user_id,
        COALESCE(actor_name, 'Alguien') || ' escribió en el chat de "' || COALESCE(ev_title,'') || '"'
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_message_notify_all ON public.event_messages;
CREATE TRIGGER on_event_message_notify_all
  AFTER INSERT ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_participants_on_message();

-- Notificar cuando se crea un evento en la provincia del usuario y su deporte favorito
CREATE OR REPLACE FUNCTION public.notify_new_event_nearby()
RETURNS trigger AS $$
DECLARE
  rec record;
BEGIN
  -- Notificar a usuarios cuya location (provincia) coincida con el evento
  -- y tengan el deporte en sus favoritos
  FOR rec IN
    SELECT id FROM public.profiles
    WHERE id != NEW.creator_id
      AND lower(replace(location, ' ', '-')) = NEW.province
      AND sports @> ARRAY[NEW.sport]
    LIMIT 100
  LOOP
    INSERT INTO public.notifications (user_id, type, event_id, actor_id, message)
    VALUES (
      rec.id,
      'event_new',
      NEW.id,
      NEW.creator_id,
      'Nuevo evento de ' || NEW.sport || ' cerca de ti: "' || COALESCE(NEW.title,'') || '"'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_event_nearby ON public.events;
CREATE TRIGGER on_new_event_nearby
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_event_nearby();
