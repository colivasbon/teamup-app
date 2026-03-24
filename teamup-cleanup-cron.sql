-- ============================================================
-- TeamUp — Limpieza automática de momentos antiguos
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- Borra momentos con más de 30 días cada día a las 3:00 AM
-- ============================================================

-- Activar la extensión pg_cron (ya viene incluida en Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar el borrado diario a las 3:00 AM UTC
SELECT cron.schedule(
  'teamup-cleanup-old-moments',   -- nombre del job (único)
  '0 3 * * *',                    -- cron: cada día a las 3:00 AM UTC
  $$
    -- 1. Borrar likes de momentos que van a eliminarse
    DELETE FROM public.moment_likes
    WHERE moment_id IN (
      SELECT id FROM public.moments
      WHERE created_at < NOW() - INTERVAL '30 days'
    );

    -- 2. Borrar los momentos en sí
    DELETE FROM public.moments
    WHERE created_at < NOW() - INTERVAL '30 days';
  $$
);

-- ── Para verificar que está activo: ──────────────────────
-- SELECT * FROM cron.job WHERE jobname = 'teamup-cleanup-old-moments';

-- ── Para cancelarlo si cambias de opinión: ────────────────
-- SELECT cron.unschedule('teamup-cleanup-old-moments');

-- ── Para cambiar a 7 días en vez de 30: ──────────────────
-- SELECT cron.unschedule('teamup-cleanup-old-moments');
-- (y volver a ejecutar este archivo cambiando '30 days' por '7 days')
-- ============================================================
