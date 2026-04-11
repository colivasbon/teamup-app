-- ============================================================
-- TeamUp — Fix vista events_with_counts
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Borrar la vista actual (necesario porque cambian los nombres de columna)
DROP VIEW IF EXISTS public.events_with_counts;

-- Recrear sin filtro de status
CREATE VIEW public.events_with_counts AS
SELECT
  e.*,
  p.full_name    AS creator_name,
  p.username     AS creator_username,
  p.avatar_url   AS creator_avatar,
  COUNT(ep.id)::int AS participant_count
FROM public.events e
LEFT JOIN public.profiles p
  ON p.id = e.creator_id
LEFT JOIN public.event_participants ep
  ON ep.event_id = e.id
GROUP BY e.id, p.full_name, p.username, p.avatar_url;
