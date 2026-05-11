-- ============================================================
-- TeamUp v13 — Categorías en torneos
-- ============================================================

-- 1. Nuevas columnas en tournaments
ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
  -- Ej: [{"id":"cat1","name":"Nivel 1"},{"id":"cat2","name":"Nivel 2"}]
  ADD COLUMN IF NOT EXISTS prize_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS prize_description text,
  ADD COLUMN IF NOT EXISTS province text;

-- 2. Categoría elegida por el participante
ALTER TABLE tournament_participants
  ADD COLUMN IF NOT EXISTS category_id text,   -- referencia al id de la categoría
  ADD COLUMN IF NOT EXISTS category_name text; -- nombre de la categoría (desnormalizado)

-- ============================================================
-- Notas:
-- - categories es un array jsonb: [{id, name}, ...]
-- - Si categories está vacío o tiene 1 elemento, no se muestra selector
-- - El bracket se genera por categoría: bracket es un objeto
--   con claves = category_id: { "cat1": [...rounds], "cat2": [...rounds] }
-- ============================================================
