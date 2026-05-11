-- ============================================================
-- TeamUp v13 — Perfiles de empresa
-- ============================================================

-- 1. Campo account_type en profiles
--    'user'     → usuario normal (por defecto)
--    'business' → club, gimnasio o marca deportiva (activado manualmente)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'user'
  CHECK (account_type IN ('user', 'business'));

-- 2. Campo featured en events
--    Las empresas pueden marcar sus eventos como destacados
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- 3. Índice para filtrar eventos destacados eficientemente
CREATE INDEX IF NOT EXISTS events_featured_idx ON events (featured) WHERE featured = true;

-- ──────────────────────────────────────────────────────────
-- Cómo activar una cuenta de empresa desde Supabase:
--
--   UPDATE profiles
--   SET account_type = 'business'
--   WHERE username = 'nombre_del_club';
--
-- Cómo marcar un evento como destacado:
--
--   UPDATE events
--   SET featured = true
--   WHERE id = 'uuid-del-evento';
-- ──────────────────────────────────────────────────────────
