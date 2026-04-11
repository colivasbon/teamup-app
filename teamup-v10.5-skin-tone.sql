-- TeamUp v10.5 — Columna skin_tone en profiles
-- Ejecutar en: Supabase Dashboard → SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skin_tone text DEFAULT 'default';
