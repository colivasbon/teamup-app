-- ============================================================
-- TeamUp — Fix RLS event_participants + events + profiles trigger
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Events — asegurar que el creador puede leer sus eventos ──
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all"    ON public.events;
DROP POLICY IF EXISTS "Eventos p\u00fablicos"     ON public.events;
DROP POLICY IF EXISTS "events_insert_auth"   ON public.events;
DROP POLICY IF EXISTS "events_update_owner"  ON public.events;
DROP POLICY IF EXISTS "events_delete_owner"  ON public.events;

-- Cualquiera puede leer eventos (necesario para la query post-insert)
CREATE POLICY "events_select_all"
  ON public.events FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear eventos
CREATE POLICY "events_insert_auth"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Solo el creador puede editar o borrar su evento
CREATE POLICY "events_update_owner"
  ON public.events FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "events_delete_owner"
  ON public.events FOR DELETE
  USING (auth.uid() = creator_id);

-- ─── 2. Event_participants — INSERT libre para autenticados ───
ALTER TABLE public.event_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participantes leen"              ON public.event_participants;
DROP POLICY IF EXISTS "Usuarios se apuntan"             ON public.event_participants;
DROP POLICY IF EXISTS "Usuarios se desapuntan"          ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_select"       ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_insert"       ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_delete"       ON public.event_participants;
DROP POLICY IF EXISTS "ep_select_all"                   ON public.event_participants;
DROP POLICY IF EXISTS "ep_insert_self"                  ON public.event_participants;
DROP POLICY IF EXISTS "ep_delete_self"                  ON public.event_participants;

CREATE POLICY "ep_select_all"
  ON public.event_participants FOR SELECT
  USING (true);

CREATE POLICY "ep_insert_self"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ep_delete_self"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 3. Trigger para crear perfil automáticamente ─────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '')),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 4. Crear perfiles para usuarios existentes sin perfil ──
INSERT INTO public.profiles (id, full_name, username, created_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)), ' ', '')),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- ─── FIN ─────────────────────────────────────────────────
