-- ============================================================
-- TeamUp v13 — Torneos + featured_until
-- ============================================================

-- 1. Reemplazar featured boolean por featured_until con caducidad
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS featured_until timestamptz;

-- Migrar datos existentes (si alguien tenía featured=true, darle 30 días)
UPDATE events SET featured_until = now() + INTERVAL '30 days' WHERE featured = true;

-- El campo featured antiguo se puede dejar (no rompe nada) o borrar:
-- ALTER TABLE events DROP COLUMN IF EXISTS featured;

-- Vista práctica: un evento está destacado si featured_until > now()
-- En la app se usa: .gt('featured_until', new Date().toISOString())


-- ============================================================
-- 2. Tabla de torneos
-- ============================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title         text NOT NULL,
  description   text,
  sport         text NOT NULL,
  location      text,
  province      text,
  date          date,
  time          time,
  price         text DEFAULT 'Gratis',
  format        text NOT NULL DEFAULT 'single_elimination'
                CHECK (format IN ('single_elimination', 'groups')),
  pair_mode     boolean NOT NULL DEFAULT true,  -- true = inscripción por parejas
  max_pairs     int NOT NULL DEFAULT 8
                CHECK (max_pairs IN (4, 8, 16, 32)),
  status        text NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'finished', 'cancelled')),
  bracket       jsonb,   -- cuadro de llaves generado al cerrar inscripciones
  featured_until timestamptz,
  created_at    timestamptz DEFAULT now()
);

-- RLS torneos
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tournaments_public_read" ON tournaments
  FOR SELECT USING (true);

CREATE POLICY "tournaments_business_insert" ON tournaments
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "tournaments_creator_update" ON tournaments
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "tournaments_creator_delete" ON tournaments
  FOR DELETE USING (auth.uid() = creator_id);


-- ============================================================
-- 3. Tabla de participantes en torneos (por parejas o individual)
-- ============================================================
CREATE TABLE IF NOT EXISTS tournament_participants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  player1_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  player1_name    text,
  player2_id      uuid REFERENCES profiles(id) ON DELETE SET NULL,
  player2_name    text,
  pair_confirmed  boolean NOT NULL DEFAULT false,
  seeking_partner boolean NOT NULL DEFAULT false,  -- busca pareja
  seed            int,   -- posición en el cuadro (asignada por el organizador)
  created_at      timestamptz DEFAULT now(),
  UNIQUE(tournament_id, player1_id)
);

-- RLS participantes torneo
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tp_public_read" ON tournament_participants
  FOR SELECT USING (true);

CREATE POLICY "tp_auth_insert" ON tournament_participants
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "tp_own_update" ON tournament_participants
  FOR UPDATE USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "tp_own_delete" ON tournament_participants
  FOR DELETE USING (auth.uid() = player1_id);


-- ============================================================
-- 4. Trigger: notificar al compañero de pareja cuando le invitan
-- ============================================================
CREATE OR REPLACE FUNCTION notify_partner_invitation()
RETURNS TRIGGER AS $$
DECLARE
  v_tournament  RECORD;
  v_inviter     TEXT;
  v_msg         TEXT;
BEGIN
  -- Solo cuando se asigna un player2_id
  IF NEW.player2_id IS NULL OR OLD.player2_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT title INTO v_tournament FROM tournaments WHERE id = NEW.tournament_id;
  SELECT COALESCE(full_name, username, 'Alguien') INTO v_inviter
    FROM profiles WHERE id = NEW.player1_id;

  v_msg := v_inviter || ' te ha invitado como pareja en el torneo "' || v_tournament.title || '". ¡Confirma tu inscripción!';

  INSERT INTO notifications (user_id, type, event_id, message, priority, read)
  VALUES (NEW.player2_id, 'joined', NEW.tournament_id, v_msg, 'high', false);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_partner_invitation ON tournament_participants;
CREATE TRIGGER on_partner_invitation
  AFTER INSERT OR UPDATE OF player2_id ON tournament_participants
  FOR EACH ROW EXECUTE FUNCTION notify_partner_invitation();


-- ============================================================
-- Cómo destacar un torneo o evento desde Supabase:
--
--   UPDATE tournaments SET featured_until = now() + INTERVAL '30 days'
--   WHERE id = 'uuid-del-torneo';
--
--   UPDATE events SET featured_until = now() + INTERVAL '7 days'
--   WHERE id = 'uuid-del-evento';
-- ============================================================
